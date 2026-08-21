/*
 * Builds the board from the catalog, filters it as you type, and runs the
 * settings view.
 *
 * Preferences live in localStorage under one key, so the board looks the same
 * next time on that device. Nothing is sent anywhere — there is no server.
 */

import { SECTIONS, ALL_APPS, TINTS } from './apps.js';
import { glyphSvg } from './icons.js';

const $ = (sel) => document.querySelector(sel);

const STORE_KEY = 'stlapps.prefs.v1';

const prefs = loadPrefs();

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return { hidden: Array.isArray(saved.hidden) ? saved.hidden : [] };
  } catch {
    /* Corrupt or unavailable storage shouldn't take the page down. */
    return { hidden: [] };
  }
}

function savePrefs() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(prefs));
    flashSaved();
  } catch {
    /* Private browsing can refuse writes — the board still works this session. */
  }
}

let savedTimer;
function flashSaved() {
  const el = $('#saved');
  el.textContent = 'Saved';
  el.dataset.on = 'true';
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => { el.dataset.on = 'false'; }, 1400);
}

/* ── Tiles ──────────────────────────────────────────────────────── */

function tileFor(app, tint) {
  const note = app.note || '';

  /* Settings is a view, not a destination, so it's a button not a link. */
  const el = document.createElement(app.action ? 'button' : 'a');
  el.className = 'tile';
  /* The colour comes from the section, so a whole row reads as one group and
     only the shape of the drawing tells the apps apart. */
  el.style.setProperty('--tint', TINTS[tint] || TINTS.slate);

  if (app.action) {
    el.type = 'button';
    el.addEventListener('click', () => showSettings());
  } else {
    el.href = app.url;
  }

  /* The blurb is carried but not printed: it's what search matches on, what a
     screen reader reads, and what the hover tooltip shows. */
  el.innerHTML = `
    <span class="tile-icon">${glyphSvg(app.glyph)}</span>
    <span class="tile-name">${app.name}</span>
    <span class="sr-only">${app.blurb}</span>
    ${note ? '<span class="tile-flag" aria-hidden="true"></span>' : ''}`;

  el.title = note ? `${app.name} — ${app.blurb}\n⚠ ${note}` : `${app.name} — ${app.blurb}`;
  return el;
}

/* The rows fade up once, on the first paint. Re-rendering after a settings
   change skips it — watching the whole board re-animate because you ticked a
   checkbox is worse than no animation at all. */
let firstPaint = true;

function renderBoard() {
  const board = $('#apps');
  board.innerHTML = '';
  board.classList.toggle('is-entering', firstPaint);
  firstPaint = false;

  SECTIONS.forEach((section, index) => {
    const visible = section.apps.filter((app) => !prefs.hidden.includes(app.id));
    if (!visible.length) return;

    const wrap = document.createElement('section');
    wrap.className = 'section';
    wrap.dataset.section = section.id;
    /* The row's colour, used by its heading and rule as well as its tiles. */
    wrap.style.setProperty('--tint', TINTS[section.tint] || TINTS.slate);
    wrap.style.setProperty('--row', String(index));

    wrap.innerHTML = `
      <div class="section-head">
        <h2 class="section-label">${section.label}</h2>
      </div>`;

    const grid = document.createElement('div');
    grid.className = 'grid';
    visible.forEach((app) => grid.append(tileFor(app, section.tint)));
    wrap.append(grid);
    board.append(wrap);
  });
}

/* ── Search ─────────────────────────────────────────────────────── */

function applyFilter(query) {
  const q = query.trim().toLowerCase();
  const words = q ? q.split(/\s+/) : [];
  let shown = 0;

  document.querySelectorAll('.section').forEach((section) => {
    let inSection = 0;

    section.querySelectorAll('.tile').forEach((tile) => {
      const haystack = tile.textContent.toLowerCase();
      const hit = words.every((w) => haystack.includes(w));
      tile.hidden = !hit;
      if (hit) inSection += 1;
    });

    /* A section with nothing left in it goes too, heading and all. */
    section.hidden = inSection === 0;
    shown += inSection;
  });

  $('#empty').hidden = shown > 0;
}

function wireSearch() {
  const input = $('#search');
  input.addEventListener('input', () => applyFilter(input.value));

  document.addEventListener('keydown', (event) => {
    const typing = event.target.closest('input, textarea, select');

    /* "/" and ⌘K both jump to the field, the way a good tool does. */
    if ((event.key === '/' && !typing) ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      showBoard();
      input.focus();
      input.select();
      return;
    }

    if (event.key === 'Escape' && event.target === input) {
      input.value = '';
      applyFilter('');
      input.blur();
    }
  });
}

/* ── Settings ───────────────────────────────────────────────────── */

function showSettings() {
  $('#apps').hidden = true;
  $('#empty').hidden = true;
  $('#settings').hidden = false;
  window.scrollTo({ top: 0 });
  $('#settings-back').focus();
  history.replaceState(null, '', '#settings');
}

function showBoard() {
  $('#settings').hidden = true;
  $('#apps').hidden = false;
  applyFilter($('#search').value);
  history.replaceState(null, '', location.pathname + location.search);
}

function renderToggles() {
  const list = $('#toggles');
  list.innerHTML = '';

  ALL_APPS.filter((app) => !app.action).forEach((app) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'toggle';

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !prefs.hidden.includes(app.id);
    box.addEventListener('change', () => {
      prefs.hidden = box.checked
        ? prefs.hidden.filter((id) => id !== app.id)
        : [...new Set([...prefs.hidden, app.id])];
      savePrefs();
      renderBoard();
    });

    const name = document.createElement('span');
    name.textContent = app.name;

    label.append(box, name);
    li.append(label);
    list.append(li);
  });
}

function wireSettings() {
  $('#settings-back').addEventListener('click', showBoard);

  $('#reset').addEventListener('click', () => {
    prefs.hidden = [];
    savePrefs();
    renderToggles();
    renderBoard();
  });

  renderToggles();

  if (location.hash === '#settings') showSettings();
}

/* ── Go ─────────────────────────────────────────────────────────── */

renderBoard();
wireSearch();
wireSettings();
