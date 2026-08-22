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
 *   PUT  /api/catalog   replace it — requires the admin password
 *   GET  /api/status    whether an admin password is configured at all
 *
 * Writing FAILS CLOSED. With no ADMIN_PASSWORD secret set, PUT is refused
 * outright rather than left open — an unprotected write endpoint would let
 * anyone repoint every tile on the board. Set one with:
 *
 *   npx wrangler secret put ADMIN_PASSWORD
 */

const KEY = 'catalog';

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
    if (pathname === '/api/status') return status(env);

    return env.ASSETS.fetch(request);
  },
};

/* ── Endpoints ──────────────────────────────────────────────────── */

function status(env) {
  return json({ adminConfigured: Boolean(env.ADMIN_PASSWORD) });
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
    if (!env.ADMIN_PASSWORD) {
      return json({
        error: 'No admin password is set on the server, so saving is disabled. '
             + 'Run: npx wrangler secret put ADMIN_PASSWORD',
      }, 503);
    }

    if (!authorised(request, env.ADMIN_PASSWORD)) {
      return json({ error: 'Wrong password.' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Body was not valid JSON.' }, 400);
    }

    const problem = invalid(body);
    if (problem) return json({ error: problem }, 400);

    await env.CATALOG.put(KEY, JSON.stringify(body));
    return json({ ok: true, sections: body.sections.length });
  }

  if (request.method === 'DELETE') {
    if (!env.ADMIN_PASSWORD) return json({ error: 'Saving is disabled.' }, 503);
    if (!authorised(request, env.ADMIN_PASSWORD)) return json({ error: 'Wrong password.' }, 401);
    await env.CATALOG.delete(KEY);
    return json({ ok: true, reverted: true });
  }

  return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, PUT, DELETE' } });
}

/* ── Auth ───────────────────────────────────────────────────────── */

function authorised(request, expected) {
  const header = request.headers.get('authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  return timingSafeEqual(given, expected);
}

/* Compares in time that doesn't depend on where the strings first differ, so
   the response time can't be used to guess the password one character at a
   time. Length is allowed to leak; the content is not. */
function timingSafeEqual(a, b) {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
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
