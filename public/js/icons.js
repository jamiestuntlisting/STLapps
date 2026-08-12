/*
 * The glyphs drawn inside each icon tile.
 *
 * Every entry is the inner markup of a 24×24 SVG. They're stroked with
 * `currentColor` and no fill unless a shape reads better solid, so a glyph
 * picks up whatever colour the tile sets — one drawing works on any tint.
 *
 * Adding a glyph: draw it in a 24×24 box, keep the strokes on the same
 * visual weight as the rest (1.7), and name it in apps.js.
 */

const GLYPHS = {
  /* ── Dock ─────────────────────────────────────────────────────── */
  listing: `
    <circle cx="10.5" cy="10.5" r="5.5"/>
    <path d="m15 15 4.5 4.5"/>
    <path d="M8 9.5h5M8 12h3.5"/>`,

  contract: `
    <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5Z"/>
    <path d="M14 3.5V8h4"/>
    <path d="M8.5 16.5c1.2-2 2-2 2.6-.6.5 1.2 1.2 1.2 1.9.2.6-.9 1.4-.9 2.5.4"/>`,

  calculator: `
    <rect x="5" y="3" width="14" height="18" rx="2.2"/>
    <rect x="7.75" y="6" width="8.5" height="3.2" rx="0.9"/>
    <path d="M8.4 13h.01M12 13h.01M15.6 13h.01M8.4 17h.01M12 17h.01M15.6 17h.01"
          stroke-width="2.4"/>`,

  vault: `
    <rect x="3" y="4.5" width="18" height="15" rx="2.2"/>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 8.6V6.9M12 17.1v-1.7M15.4 12h1.7M6.9 12h1.7"/>`,

  /* ── Stunt work ───────────────────────────────────────────────── */
  performer: `
    <circle cx="12" cy="7.5" r="3.2"/>
    <path d="M5.5 20.5c0-3.6 2.9-6.3 6.5-6.3s6.5 2.7 6.5 6.3"/>`,

  coordinator: `
    <circle cx="9" cy="8" r="2.9"/>
    <path d="M3.5 19.5c0-3.1 2.5-5.4 5.5-5.4s5.5 2.3 5.5 5.4"/>
    <path d="M16 5.6a2.9 2.9 0 0 1 0 5.5M17.5 14.6c1.9.7 3.1 2.4 3.1 4.6"/>`,

  clock: `
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M12 7.2V12l3.2 2.1"/>`,

  callsheet: `
    <rect x="5" y="4" width="14" height="17" rx="2"/>
    <path d="M9 4V2.8h6V4"/>
    <path d="M8.6 10h6.8M8.6 13.4h6.8M8.6 16.8h4"/>`,

  breakdown: `
    <path d="M3.5 9.2 20 6.4v10.9a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/>
    <path d="m4.1 5.6 15.3-2.6.6 3.4-16 2.8Z"/>
    <path d="m8.4 4.9.9 3.3M13 4.1l.9 3.3"/>`,

  megaphone: `
    <path d="M4 10.2v3.6a1.5 1.5 0 0 0 1.5 1.5H8l6.5 4.2V5.5L8 9.7H5.5A1.5 1.5 0 0 0 4 11.2Z"/>
    <path d="M17.8 9.2a4 4 0 0 1 0 5.6"/>
    <path d="M8 15.3v3.4a1.4 1.4 0 0 0 2.8 0v-1.6"/>`,

  camera: `
    <path d="M4 8.4h3l1.4-2.2h7.2L17 8.4h3a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.4a1 1 0 0 1 1-1Z"/>
    <circle cx="12" cy="13.2" r="3.4"/>`,

  cards: `
    <rect x="8.4" y="4.2" width="11" height="14.4" rx="1.8"/>
    <path d="M5.6 6.6A1.8 1.8 0 0 0 4.4 8.3v9.3a2.2 2.2 0 0 0 2.2 2.2h7.1"/>
    <path d="M11.6 9.4h4.6M11.6 12.4h3"/>`,

  news: `
    <path d="M3.5 5.6h13.2v13.3a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/>
    <path d="M16.7 9h2.2a1.6 1.6 0 0 1 1.6 1.6v8a1.9 1.9 0 0 1-3.8 0"/>
    <path d="M6.4 8.8h7M6.4 12h7M6.4 15.2h4.4"/>`,

  map: `
    <path d="m3.5 6.6 5.6-2.2 5.8 2.2 5.6-2.2v12.9l-5.6 2.2-5.8-2.2-5.6 2.2Z"/>
    <path d="M9.1 4.4v12.9M14.9 6.6v12.9"/>`,

  school: `
    <path d="m2.8 8.8 9.2-4.3 9.2 4.3-9.2 4.3Z"/>
    <path d="M6.6 10.7v4.9c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.9"/>
    <path d="M20.4 9.3v5.2"/>`,

  atlas: `
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M3.6 12h16.8"/>
    <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z"/>`,

  scores: `
    <path d="M3.6 20.4h16.8"/>
    <rect x="5.4" y="12.4" width="3.6" height="6"/>
    <rect x="10.2" y="8.4" width="3.6" height="10"/>
    <rect x="15" y="4.6" width="3.6" height="13.8"/>`,

  /* The stem is doing real work here: without it the leaf reads as a star. */
  maple: `
    <path d="M12 2.6 13.5 6l2.4-.9-.7 3.1 3.4-.5-1 1.8 2.8 2.1-3.6 1.3.6 2-3.9-.6.4 2.6h-4.8l.4-2.6-3.9.6.6-2-3.6-1.3 2.8-2.1-1-1.8 3.4.5-.7-3.1 2.4.9Z"
          fill="currentColor" stroke="none"/>
    <path d="M12 16.9v4.5"/>`,

  vest: `
    <path d="M8.6 3.4 12 6.2l3.4-2.8 3.7 2.1a1.4 1.4 0 0 1 .7 1.5l-1.3 6.3V20a.6.6 0 0 1-.6.6h-3.5"/>
    <path d="M8.6 3.4 4.9 5.5a1.4 1.4 0 0 0-.7 1.5l1.3 6.3V20a.6.6 0 0 0 .6.6h3.5"/>
    <path d="M9.6 20.6h4.8M12 6.2v5.4"/>`,

  bag: `
    <path d="M5.4 7.6h13.2l1 12a1.4 1.4 0 0 1-1.4 1.5H5.8a1.4 1.4 0 0 1-1.4-1.5Z"/>
    <path d="M8.8 10V6.9a3.2 3.2 0 0 1 6.4 0V10"/>`,

  /* ── Arcade ───────────────────────────────────────────────────── */
  /* A gamepad, not a figure — it sits two icons away from the performer
     glyph and the two must not read the same at 60px. */
  arcade: `
    <path d="M8.9 7.4h6.2a5.2 5.2 0 0 1 5.1 4.2l.7 4.2a2.5 2.5 0 0 1-4.6 1.7l-1.1-1.8H8.8l-1.1 1.8a2.5 2.5 0 0 1-4.6-1.7l.7-4.2a5.2 5.2 0 0 1 5.1-4.2Z"/>
    <path d="M7.4 10.9v2.8M6 12.3h2.8"/>
    <circle cx="15.4" cy="11.4" r="1" fill="currentColor" stroke="none"/>
    <circle cx="17.6" cy="13.6" r="1" fill="currentColor" stroke="none"/>`,

  car: `
    <path d="M4 14.6 5.8 9a2 2 0 0 1 1.9-1.4h8.6A2 2 0 0 1 18.2 9l1.8 5.6"/>
    <path d="M3.6 14.6h16.8v3.2a.8.8 0 0 1-.8.8H18a.8.8 0 0 1-.8-.8v-.9H6.8v.9a.8.8 0 0 1-.8.8H4.4a.8.8 0 0 1-.8-.8Z"/>
    <path d="M7 11.6h.01M17 11.6h.01" stroke-width="2.4"/>`,

  highfall: `
    <circle cx="12" cy="4.8" r="2.2"/>
    <path d="M12 7.4v5.2M12 12.6l-3 4M12 12.6l3 4M8.4 9.2 12 8l3.6 1.2"/>
    <path d="M4.6 20.4h14.8" stroke-dasharray="2.6 2.4"/>`,

  stairs: `
    <path d="M3.6 20.4V16h4.6v-4.4h4.6V7.2h4.6V2.8h2.9"/>
    <path d="M3.6 20.4h16.7"/>`,

  fire: `
    <path d="M12 2.6c.4 3 2.1 4 3.6 5.6a7.4 7.4 0 0 1 2.3 5.3 6 6 0 0 1-11.8 0c0-2.1 1.1-3.6 2.1-4.7.4 1 1 1.6 1.8 1.9C9.6 8.4 10.4 5.5 12 2.6Z"/>
    <path d="M12 21a3 3 0 0 1-1.6-5.6c.5 1 1 1.3 1.6 1.5.7-1.1.6-2.2.3-3.1 1.5.9 2.7 2.3 2.7 4.2A3 3 0 0 1 12 21Z"
          fill="currentColor" stroke="none" opacity=".55"/>`,
};

/* Anything asking for a glyph we don't have gets a neutral rounded square,
   so a typo in apps.js shows up as a blank tile instead of breaking the page. */
const FALLBACK = `<rect x="5" y="5" width="14" height="14" rx="3.4"/>`;

export function glyphSvg(name) {
  const inner = GLYPHS[name] || FALLBACK;
  return `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
    fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export const GLYPH_NAMES = Object.keys(GLYPHS);
