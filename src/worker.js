/*
 * The Worker behind the launcher.
 *
 * Almost everything here is static — the board, the admin page, the CSS — and
 * that's served straight from the ASSETS binding. The only server-side work is
 * one endpoint holding the app catalog, so an edit in /admin changes the board
 * for everyone without a redeploy.
 *
 *   GET  /api/catalog   the stored catalog, or 404 when nothing is stored yet
 *                       (the board then falls back to the built-in apps.js)
 *   PUT  /api/catalog   replace it
 *   DELETE /api/catalog drop it, so the built-in apps.js takes over again
 *   POST /api/undo      put the previous version back
 *   GET  /api/status    what the server can do
 *
 * PUBLISHING IS OPEN, by choice: no password, /admin simply isn't linked from
 * the board and is marked noindex. Anyone who knows the URL can change what
 * every visitor sees, so two things stand in for a lock:
 *
 *   - every publish keeps the version it replaced, and POST /api/undo puts it
 *     back in one move, so a bad change is seconds to reverse;
 *   - the payload is validated and links are restricted to http, https, sms,
 *     tel and mailto, so a tile can't be pointed at a javascript: URL.
 *
 * Neither stops someone deliberately repointing a tile at a lookalike page.
 * If this ever needs to be properly private, put Cloudflare Access in front of
 * /admin and /api — that needs no password either.
 */

const KEY = 'catalog';
const PREVIOUS = 'catalog:previous';

/* Caps, so a bad or hostile payload can't store something enormous. */
const LIMITS = {
  sections: 12,
  appsPerSection: 12,
  id: 64,
  name: 60,
  blurb: 200,
  url: 2048,
  glyph: 40,
  tint: 20,
  note: 300,
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/catalog') return catalog(request, env);
    if (pathname === '/api/undo') return undo(request, env);
    if (pathname === '/api/status') return status(env);

    const response = await env.ASSETS.fetch(request);

    /* Keep the editor out of search results even if the URL leaks. The page
       carries a noindex meta tag too; this covers crawlers that only read
       headers. */
    if (pathname === '/admin' || pathname.startsWith('/admin')) {
      const headers = new Headers(response.headers);
      headers.set('x-robots-tag', 'noindex, nofollow');
      return new Response(response.body, { status: response.status, headers });
    }

    return response;
  },
};

/* ── Endpoints ──────────────────────────────────────────────────── */

async function status(env) {
  return json({
    canPublish: true,
    canUndo: Boolean(await env.CATALOG.get(PREVIOUS)),
  });
}

async function catalog(request, env) {
  if (request.method === 'GET') {
    const stored = await env.CATALOG.get(KEY);
    if (!stored) return new Response('No catalog stored', { status: 404 });
    return new Response(stored, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        /* The board must never show a stale catalog after an edit. */
        'cache-control': 'no-store',
      },
    });
  }

  if (request.method === 'PUT') {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Body was not valid JSON.' }, 400);
    }

    const problem = invalid(body);
    if (problem) return json({ error: problem }, 400);

    await remember(env);
    await env.CATALOG.put(KEY, JSON.stringify(body));
    return json({ ok: true, sections: body.sections.length, canUndo: true });
  }

  if (request.method === 'DELETE') {
    await remember(env);
    await env.CATALOG.delete(KEY);
    return json({ ok: true, reverted: true, canUndo: true });
  }

  return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, PUT, DELETE' } });
}

/* Records the state being replaced, so it can be restored.
 *
 * "Nothing stored" is itself a state worth remembering: publish while the
 * board is still running on the built-in apps.js and undo has to be able to
 * put it back on the built-in, not on some older stored version. So this saves
 * an envelope that can say "there was nothing here" rather than saving only
 * the catalogs and losing that distinction. */
async function remember(env) {
  const current = await env.CATALOG.get(KEY);
  await env.CATALOG.put(PREVIOUS, JSON.stringify({ stored: current ?? null }));
}

/* Swaps the previous state back in. Whatever is being replaced becomes the new
   "previous", so undo toggles between the last two rather than dead-ending
   after one press. */
async function undo(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  }

  const envelope = await env.CATALOG.get(PREVIOUS);
  if (!envelope) return json({ error: 'There is no earlier version to go back to.' }, 404);

  let previous;
  try {
    previous = JSON.parse(envelope).stored ?? null;
  } catch {
    return json({ error: 'The saved earlier version is unreadable.' }, 500);
  }

  await remember(env);
  if (previous) await env.CATALOG.put(KEY, previous);
  else await env.CATALOG.delete(KEY);

  return json({ ok: true, restored: true, builtIn: !previous });
}

/* ── Validation ─────────────────────────────────────────────────── */

/* Returns a human-readable problem, or null when the payload is fine. The
   messages are meant to be shown in the admin page, so they say what to fix. */
function invalid(body) {
  if (!body || typeof body !== 'object') return 'Expected an object.';
  if (!Array.isArray(body.sections)) return 'Expected a "sections" array.';
  if (!body.sections.length) return 'There must be at least one section.';
  if (body.sections.length > LIMITS.sections) {
    return `Too many sections (max ${LIMITS.sections}).`;
  }

  const ids = new Set();

  for (const section of body.sections) {
    if (!section || typeof section !== 'object') return 'A section was not an object.';
    for (const field of ['id', 'label', 'tint']) {
      if (typeof section[field] !== 'string' || !section[field]) {
        return `A section is missing "${field}".`;
      }
    }
    if (section.label.length > LIMITS.name) return `Section name "${section.label}" is too long.`;
    if (!Array.isArray(section.apps)) return `Section "${section.label}" has no apps array.`;
    if (section.apps.length > LIMITS.appsPerSection) {
      return `Section "${section.label}" has too many apps (max ${LIMITS.appsPerSection}).`;
    }

    for (const app of section.apps) {
      if (!app || typeof app !== 'object') return 'An app was not an object.';
      for (const field of ['id', 'name', 'url', 'glyph']) {
        if (typeof app[field] !== 'string' || !app[field]) {
          return `An app in "${section.label}" is missing "${field}".`;
        }
      }
      if (ids.has(app.id)) return `Two apps share the id "${app.id}".`;
      ids.add(app.id);

      for (const [field, max] of Object.entries(LIMITS)) {
        if (typeof app[field] === 'string' && app[field].length > max) {
          return `"${app.name}" has a ${field} longer than ${max} characters.`;
        }
      }

      const scheme = app.url.split(':')[0].toLowerCase();
      if (!['http', 'https', 'sms', 'tel', 'mailto'].includes(scheme) && app.url !== '#settings') {
        return `"${app.name}" has a link that isn't http, https, sms, tel or mailto.`;
      }
    }
  }

  return null;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
