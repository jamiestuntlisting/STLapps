/*
 * Builds the home screen from the catalog and wires up the few things that
 * move: the clock, the pages, and Spotlight.
 *
 * Icons navigate in the same tab on purpose — tapping an app on a phone
 * leaves the home screen, and Back brings you home again. That also keeps
 * every link working inside an installed web app, where a new tab would
 * throw you out to the browser.
 */

import { DOCK, PAGES, ALL_APPS } from './apps.js';
import { glyphSvg } from './icons.js';

const $ = (sel) => document.querySelector(sel);

/* ── Icons ──────────────────────────────────────────────────────── */

function iconMarkup(app) {
  const [from, to] = app.tint;
  return `<span class="app-icon" style="--from:${from};--to:${to}">${glyphSvg(app.glyph)}</span>`;
}

function appLink(app) {
  const a = document.createElement('a');
  a.className = 'app';
  a.href = app.url;
  a.innerHTML = `${iconMarkup(app)}<span class="app-name">${app.name}</span>`;

  /* An unconfirmed link says so rather than pretending. */
  if (app.note) {
    a.dataset.note = '';
    a.title = `${app.name} — ${app.blurb}\n⚠ ${app.note}`;
  } else {
    a.title = `${app.name} — ${app.blurb}`;
  }
  return a;
}

/* ── Home screen ────────────────────────────────────────────────── */

function renderHome() {
  const dock = $('#dock');
  DOCK.forEach((app) => {
    const item = appLink(app);
    item.setAttribute('role', 'listitem');
    dock.append(item);
  });

  const pages = $('#pages');
  PAGES.forEach((page) => {
    const section = document.createElement('section');
    section.className = 'page';
    section.dataset.page = page.id;
    section.setAttribute('aria-label', page.title);

    const heading = document.createElement('h2');
    heading.className = 'page-title';
    heading.textContent = page.title;
    section.append(heading);

    page.apps.forEach((app) => section.append(appLink(app)));
    pages.append(section);
  });

  renderDots(PAGES.length);
}

function renderDots(count) {
  const dots = $('#dots');
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Page ${i + 1}: ${PAGES[i].title}`);
    dot.setAttribute('aria-current', String(i === 0));
    dot.addEventListener('click', () => goToPage(i));
    dots.append(dot);
  }
}

/* ── Paging ─────────────────────────────────────────────────────── */

const pagesEl = () => $('#pages');

function currentPage() {
  const el = pagesEl();
  return el.clientWidth ? Math.round(el.scrollLeft / el.clientWidth) : 0;
}

function goToPage(index) {
  const el = pagesEl();
  el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
}

function syncDots() {
  const active = currentPage();
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.setAttribute('aria-current', String(i === active));
  });
}

function wirePaging() {
  const el = pagesEl();

  /* rAF-throttled: scroll fires far more often than the dots need redrawing. */
  let queued = false;
  el.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncDots();
    });
  }, { passive: true });

  el.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToPage(Math.min(currentPage() + 1, PAGES.length - 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPage(Math.max(currentPage() - 1, 0));
    }
  });
}

/* ── Clock ──────────────────────────────────────────────────────── */

function startClock() {
  const clock = $('#clock');

  const tick = () => {
    /* Hour and minute only, in the reader's own locale and 12/24h setting. */
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  tick();
  /* Line up with the top of the next minute, then run once a minute. */
  setTimeout(() => {
    tick();
    setInterval(tick, 60_000);
  }, (60 - new Date().getSeconds()) * 1000);
}

/* ── Spotlight ──────────────────────────────────────────────────── */

const spotlight = {
  root: null,
  input: null,
  list: null,
  active: -1,
  matches: [],
};

function searchApps(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  /* Every word has to appear somewhere in the app — so "high fall" finds
     Pro High Faller, and "stunt news" doesn't drag in everything stunt. */
  const words = q.split(/\s+/);

  return ALL_APPS
    .map((app) => {
      const haystack = `${app.name} ${app.blurb} ${app.page} ${app.id}`.toLowerCase();
      if (!words.every((w) => haystack.includes(w))) return null;

      /* Rank: name beats blurb, and a name that starts with the query wins. */
      const name = app.name.toLowerCase();
      let score = 0;
      if (name.startsWith(q)) score += 100;
      if (name.includes(q)) score += 50;
      if (app.blurb.toLowerCase().includes(q)) score += 10;
      return { app, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.app.name.localeCompare(b.app.name))
    .map((hit) => hit.app);
}

function renderResults(query) {
  const { list } = spotlight;
  spotlight.matches = searchApps(query);
  spotlight.active = spotlight.matches.length ? 0 : -1;
  list.innerHTML = '';

  if (!query.trim()) return;

  if (!spotlight.matches.length) {
    const empty = document.createElement('li');
    empty.className = 'spotlight-empty';
    empty.textContent = `No app matches “${query.trim()}”.`;
    list.append(empty);
    return;
  }

  spotlight.matches.forEach((app, i) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'result';
    link.href = app.url;
    link.dataset.active = String(i === 0);
    link.setAttribute('role', 'option');
    link.innerHTML = `
      ${iconMarkup(app)}
      <span class="result-text">
        <span class="result-name">${app.name}</span>
        <span class="result-blurb">${app.blurb}</span>
      </span>
      <span class="result-page">${app.page}</span>`;
    link.addEventListener('mouseenter', () => setActiveResult(i));
    li.append(link);
    list.append(li);
  });
}

function setActiveResult(index) {
  const links = spotlight.list.querySelectorAll('.result');
  if (!links.length) return;

  spotlight.active = (index + links.length) % links.length;
  links.forEach((link, i) => {
    link.dataset.active = String(i === spotlight.active);
  });
  links[spotlight.active].scrollIntoView({ block: 'nearest' });
}

function openSpotlight(seed = '') {
  spotlight.root.hidden = false;
  spotlight.input.value = seed;
  renderResults(seed);
  spotlight.input.focus();
}

function closeSpotlight() {
  spotlight.root.hidden = true;
  spotlight.input.value = '';
  spotlight.list.innerHTML = '';
  spotlight.matches = [];
}

function wireSpotlight() {
  spotlight.root = $('#spotlight');
  spotlight.input = $('#search-input');
  spotlight.list = $('#search-results');

  $('#search-open').addEventListener('click', () => openSpotlight());
  $('#search-close').addEventListener('click', closeSpotlight);

  /* Tapping the dimmed area behind the sheet closes it. */
  spotlight.root.addEventListener('click', (event) => {
    if (event.target === spotlight.root) closeSpotlight();
  });

  spotlight.input.addEventListener('input', (event) => {
    renderResults(event.target.value);
  });

  spotlight.input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult(spotlight.active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult(spotlight.active - 1);
    } else if (event.key === 'Enter') {
      const target = spotlight.matches[spotlight.active];
      if (target) window.location.href = target.url;
    } else if (event.key === 'Escape') {
      closeSpotlight();
    }
  });

  /* ⌘K / Ctrl-K from anywhere, and — like a real home screen — just start
     typing. We stay out of the way of modifier combos and actual fields. */
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSpotlight();
      return;
    }

    if (!spotlight.root.hidden) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest('input, textarea, select')) return;

    if (/^[a-z0-9]$/i.test(event.key)) {
      event.preventDefault();
      openSpotlight(event.key);
    }
  });
}

/* ── Go ─────────────────────────────────────────────────────────── */

renderHome();
wirePaging();
wireSpotlight();
startClock();
