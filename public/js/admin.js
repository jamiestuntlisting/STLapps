/*
 * The admin page: edit the board's titles, links, icons and order, then
 * publish so everyone sees it.
 *
 * It loads whatever is currently live — the stored catalog if there is one,
 * otherwise the built-in apps.js — edits a plain copy of that in memory, and
 * PUTs it back. Nothing is written until Publish is pressed.
 *
 * There is no password: this page simply isn't linked from the board and is
 * marked noindex. Anyone with the URL can publish, which is why every publish
 * keeps the version it replaced — see the Undo button.
 *
 * Descriptions aren't editable here. They're still carried on every app —
 * search matches on them and screen readers read them out — they just aren't
 * worth a row of screen space when the point of this page is to scan 23 links
 * at once.
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

/* Says which of the two catalogs the board is actually serving.
 *
 * This is the question that bites: once anything is published, the stored
 * catalog wins and the built-in apps.js is ignored entirely — so a deploy
 * that edits apps.js changes nothing on the live board, silently. Without
 * this line the only symptom is "my edit didn't show up". */
function showSource(source) {
  const state = $('#server-state');
  state.hidden = false;

  if (source === 'stored') {
    state.className = 'server-state info';
    state.innerHTML = 'The board is showing a <strong>published</strong> catalog, saved here. '
      + 'It overrides the built-in one in <code>apps.js</code>, so changes deployed to that file '
      + "won't appear until you publish again or press <strong>Revert to built-in</strong>.";
  } else {
    state.className = 'server-state info';
    state.innerHTML = 'The board is showing the <strong>built-in</strong> catalog from '
      + '<code>apps.js</code>. Publishing replaces it for everyone.';
  }
}

async function checkServer() {
  const state = $('#server-state');
  try {
    const response = await fetch('api/status');
    if (!response.ok) throw new Error('no api');
    const { canUndo } = await response.json();
    $('#undo').hidden = !canUndo;
  } catch {
    /* No Worker behind this page — running from a plain static server. */
    state.hidden = false;
    state.className = 'server-state warn';
    state.innerHTML = 'This page isn\'t being served by the Worker, so there\'s nothing to '
      + 'publish to. Edits here can still be saved with <strong>Download apps.js</strong>.';
    $('#publish').disabled = true;
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
      /* blurb is not edited here any more, but it still feeds search and
         screen readers, so existing ones are left alone and new apps start
         with their name as a sensible stand-in. */
      section.apps.push({
        id: uniqueId('new-app'),
        name: 'New app',
        blurb: 'New app',
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

async function publish() {
  const button = $('#publish');
  button.disabled = true;
  button.textContent = 'Publishing…';

  try {
    const response = await fetch('api/catalog', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sections }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      if (data.canUndo) $('#undo').hidden = false;
      showSource('stored');
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

  try {
    const response = await fetch('api/catalog', { method: 'DELETE' });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      sections = structuredClone(BUILT_IN);
      render();
      if (data.canUndo) $('#undo').hidden = false;
      showSource('built-in');
      toast('Reverted to the built-in catalog.');
    } else {
      toast(data.error || `Revert failed (${response.status}).`, true);
    }
  } catch {
    toast('Could not reach the server.', true);
  }
}

/* Puts back whatever the last publish replaced. Undo toggles between the last
   two versions, so pressing it twice returns you to where you started. */
async function undoPublish() {
  try {
    const response = await fetch('api/undo', { method: 'POST' });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return toast(data.error || `Undo failed (${response.status}).`, true);
    const source = await loadLive();
    render();
    showSource(source);
    toast('Put the previous version back.');
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
  const source = await loadLive();
  if (!$('#publish').disabled) showSource(source);
  render();

  $('#publish').addEventListener('click', publish);
  $('#undo').addEventListener('click', undoPublish);
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
