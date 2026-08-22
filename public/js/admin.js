/*
 * The admin page: edit the board's titles, links, icons and order, then
 * publish so everyone sees it.
 *
 * It loads whatever is currently live — the stored catalog if there is one,
 * otherwise the built-in apps.js — edits a plain copy of that in memory, and
 * PUTs it back. Nothing is written until Publish is pressed.
 *
 * The password lives in this tab only (sessionStorage). It's the one thing
 * here that shouldn't outlive the window.
 */

import { SECTIONS as BUILT_IN, TINTS } from './apps.js';
import { glyphSvg, GLYPH_NAMES } from './icons.js';

const $ = (sel) => document.querySelector(sel);

/* The working copy. Deep-cloned so editing never mutates the imported
   built-in catalog — otherwise "revert" would have nothing to revert to. */
let sections = structuredClone(BUILT_IN);

/* ── Loading ────────────────────────────────────────────────────── */

async function loadLive() {
  try {
    const response = await fetch('api/catalog');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data?.sections) && data.sections.length) {
        sections = data.sections;
        return 'stored';
      }
    }
  } catch { /* fall through to the built-in catalog */ }
  return 'built-in';
}

async function checkServer() {
  const state = $('#server-state');
  try {
    const response = await fetch('api/status');
    if (!response.ok) throw new Error('no api');
    const { adminConfigured } = await response.json();
    if (!adminConfigured) {
      state.hidden = false;
      state.className = 'server-state warn';
      state.innerHTML = 'No admin password is set on the server, so <strong>Publish is '
        + 'disabled</strong>. Set one once with <code>npx wrangler secret put ADMIN_PASSWORD</code>. '
        + 'Until then you can still edit here and use <strong>Download apps.js</strong>.';
      $('#auth-panel').hidden = true;
    }
  } catch {
    /* No Worker behind this page — running from a plain static server. */
    state.hidden = false;
    state.className = 'server-state warn';
    state.innerHTML = 'This page isn\'t being served by the Worker, so there\'s nothing to '
      + 'publish to. Edits here can still be saved with <strong>Download apps.js</strong>.';
    $('#auth-panel').hidden = true;
  }
}

/* ── Rendering ──────────────────────────────────────────────────── */

function render() {
  const editor = $('#editor');
  editor.innerHTML = '';

  sections.forEach((section, sIndex) => {
    const tint = TINTS[section.tint] || TINTS.slate;

    const wrap = document.createElement('section');
    wrap.className = 'edit-row';
    wrap.style.setProperty('--tint', tint);

    const head = document.createElement('div');
    head.className = 'edit-row-head';

    const name = document.createElement('input');
    name.className = 'f-section-name';
    name.type = 'text';
    name.value = section.label;
    name.setAttribute('aria-label', 'Row name');
    name.addEventListener('input', () => { section.label = name.value; });

    const colour = document.createElement('select');
    colour.className = 'f-tint';
    colour.setAttribute('aria-label', 'Row colour');
    Object.keys(TINTS).forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      option.selected = key === section.tint;
      colour.append(option);
    });
    colour.addEventListener('change', () => {
      section.tint = colour.value;
      render();
    });

    const count = document.createElement('span');
    count.className = 'row-count';
    count.textContent = `${section.apps.length} of 4`;
    if (section.apps.length > 4) count.classList.add('over');

    const controls = document.createElement('span');
    controls.className = 'row-head-controls';
    controls.append(
      iconButton('↑', 'Move row up', () => moveSection(sIndex, -1)),
      iconButton('↓', 'Move row down', () => moveSection(sIndex, 1)),
      iconButton('✕', 'Delete row', () => {
        if (!section.apps.length || confirm(`Delete the "${section.label}" row and its ${section.apps.length} app(s)?`)) {
          sections.splice(sIndex, 1);
          render();
        }
      }),
    );

    head.append(name, colour, count, controls);
    wrap.append(head);

    const list = document.createElement('ul');
    list.className = 'app-rows';
    section.apps.forEach((app, aIndex) => list.append(appRow(app, sIndex, aIndex)));
    wrap.append(list);

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'ghost-btn add-app';
    add.textContent = 'Add an app';
    add.addEventListener('click', () => {
      section.apps.push({
        id: uniqueId('new-app'),
        name: 'New app',
        blurb: '',
        url: 'https://',
        glyph: GLYPH_NAMES[0],
      });
      render();
    });
    wrap.append(add);

    editor.append(wrap);
  });
}

function appRow(app, sIndex, aIndex) {
  const node = $('#app-row-template').content.firstElementChild.cloneNode(true);

  const icon = node.querySelector('.row-icon');
  icon.innerHTML = glyphSvg(app.glyph);

  const name = node.querySelector('.f-name');
  name.value = app.name;
  name.addEventListener('input', () => { app.name = name.value; });

  const url = node.querySelector('.f-url');
  url.value = app.url;
  url.addEventListener('input', () => { app.url = url.value.trim(); });

  const blurb = node.querySelector('.f-blurb');
  blurb.value = app.blurb || '';
  blurb.addEventListener('input', () => { app.blurb = blurb.value; });

  const glyph = node.querySelector('.f-glyph');
  GLYPH_NAMES.forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    option.selected = key === app.glyph;
    glyph.append(option);
  });
  glyph.addEventListener('change', () => {
    app.glyph = glyph.value;
    icon.innerHTML = glyphSvg(app.glyph);
  });

  /* Moving between rows is the only way to reorganise on a phone — drag and
     drop is miserable on touch, so it's a dropdown. */
  const move = node.querySelector('.f-move');
  sections.forEach((s, i) => {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = i === sIndex ? `In ${s.label}` : `Move to ${s.label}`;
    option.selected = i === sIndex;
    move.append(option);
  });
  move.addEventListener('change', () => {
    const target = Number(move.value);
    if (target === sIndex) return;
    sections[sIndex].apps.splice(aIndex, 1);
    sections[target].apps.push(app);
    render();
  });

  node.querySelector('.up').addEventListener('click', () => moveApp(sIndex, aIndex, -1));
  node.querySelector('.down').addEventListener('click', () => moveApp(sIndex, aIndex, 1));
  node.querySelector('.remove').addEventListener('click', () => {
    sections[sIndex].apps.splice(aIndex, 1);
    render();
  });

  if (app.action) node.classList.add('is-special');
  return node;
}

function iconButton(glyph, label, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-btn';
  button.textContent = glyph;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  return button;
}

/* ── Moving things ──────────────────────────────────────────────── */

function moveApp(sIndex, aIndex, delta) {
  const apps = sections[sIndex].apps;
  const target = aIndex + delta;
  if (target < 0 || target >= apps.length) return;
  [apps[aIndex], apps[target]] = [apps[target], apps[aIndex]];
  render();
}

function moveSection(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= sections.length) return;
  [sections[index], sections[target]] = [sections[target], sections[index]];
  render();
}

function uniqueId(base) {
  const taken = new Set(sections.flatMap((s) => s.apps.map((a) => a.id)));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/* ── Publishing ─────────────────────────────────────────────────── */

function password() {
  return $('#password')?.value || sessionStorage.getItem('stlapps.admin') || '';
}

async function publish() {
  const secret = password();
  if (!secret) return toast('Enter the admin password first.', true);

  const button = $('#publish');
  button.disabled = true;
  button.textContent = 'Publishing…';

  try {
    const response = await fetch('api/catalog', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ sections }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      try { sessionStorage.setItem('stlapps.admin', secret); } catch { /* fine */ }
      toast('Published. The board is updated for everyone.');
    } else {
      toast(data.error || `Publish failed (${response.status}).`, true);
    }
  } catch {
    toast('Could not reach the server.', true);
  } finally {
    button.disabled = false;
    button.textContent = 'Publish';
  }
}

async function revert() {
  if (!confirm('Delete the saved catalog, so the board falls back to the version built into apps.js?')) return;
  const secret = password();
  if (!secret) return toast('Enter the admin password first.', true);

  try {
    const response = await fetch('api/catalog', {
      method: 'DELETE',
      headers: { authorization: `Bearer ${secret}` },
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      sections = structuredClone(BUILT_IN);
      render();
      toast('Reverted to the built-in catalog.');
    } else {
      toast(data.error || `Revert failed (${response.status}).`, true);
    }
  } catch {
    toast('Could not reach the server.', true);
  }
}

/* ── Export ─────────────────────────────────────────────────────── */

/* Writes the working copy back out as apps.js, so what's on the board can be
   committed and become the built-in default. */
function exportSource() {
  const body = sections.map((section) => {
    const apps = section.apps.map((app) => {
      const lines = [
        `        id: ${quote(app.id)},`,
        `        name: ${quote(app.name)},`,
        `        blurb: ${quote(app.blurb || '')},`,
        `        url: ${quote(app.url)},`,
        `        glyph: ${quote(app.glyph)},`,
      ];
      if (app.note) lines.push(`        note: ${quote(app.note)},`);
      if (app.action) lines.push(`        action: ${quote(app.action)},`);
      return `      {\n${lines.join('\n')}\n      },`;
    }).join('\n');

    return `  {\n    id: ${quote(section.id)},\n    label: ${quote(section.label)},`
         + `\n    tint: ${quote(section.tint)},\n    apps: [\n${apps}\n    ],\n  },`;
  }).join('\n');

  const source = `/*
 * The app catalog — the single source of truth for this launcher.
 *
 * Generated by the admin page. Editing it by hand is fine too; both end up
 * in the same shape.
 */

export const TINTS = ${JSON.stringify(TINTS, null, 2).replace(/"([a-z]+)":/g, '$1:')};

export const SECTIONS = [
${body}
];

/* One flat list, for search and for the settings toggles. */
export const ALL_APPS = SECTIONS.flatMap((section) =>
  section.apps.map((app) => ({ ...app, section: section.label })),
);
`;

  const blob = new Blob([source], { type: 'text/javascript' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'apps.js';
  link.click();
  URL.revokeObjectURL(link.href);
  toast('Downloaded apps.js — commit it to make this the built-in default.');
}

/* Single quotes to match the file's own style, with the awkward characters
   escaped so the output is always valid source. */
function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

/* ── Toast ──────────────────────────────────────────────────────── */

let toastTimer;
function toast(message, isError = false) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.toggle('error', isError);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4200);
}

/* ── Go ─────────────────────────────────────────────────────────── */

async function start() {
  await checkServer();
  await loadLive();
  render();

  const saved = sessionStorage.getItem('stlapps.admin');
  if (saved && $('#password')) $('#password').value = saved;

  $('#publish').addEventListener('click', publish);
  $('#revert').addEventListener('click', revert);
  $('#export').addEventListener('click', exportSource);
  $('#add-section').addEventListener('click', () => {
    sections.push({
      id: uniqueId('row'),
      label: 'New row',
      tint: 'slate',
      apps: [],
    });
    render();
  });
}

start();
