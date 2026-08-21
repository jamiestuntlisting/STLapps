/*
 * The drawings inside each icon tile.
 *
 * Every entry is the inner markup of a 24×24 SVG, stroked with `currentColor`
 * so one drawing works in any tint.
 *
 * The brief for these: each one should say what the app *is*, and no two
 * should read the same at 22px. That's why Search is a magnifier with a
 * person inside it while Advanced Search has the filter sliders, Hair Selfie
 * is four frames around a head, and the two falling games are drawn from
 * different angles.
 *
 * Adding one: draw it in a 24×24 box, keep the stroke on 1.7 to match, and
 * name it in the `glyph` field in apps.js.
 *
 * This is a library, not a mirror of the board: a few drawings here belong to
 * apps that aren't currently tiled (the individual arcade games, the
 * coordinator game) and are kept so those can come back without redrawing.
 */

const GLYPHS = {
  /* ── You ──────────────────────────────────────────────────────── */

  /* A panel with a header bar and three bars of data. */
  dashboard: `
    <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.2"/>
    <path d="M3.4 9.2h17.2"/>
    <path d="M6.4 17.4v-4.2M10.7 17.4v-6.2M15 17.4v-3"/>`,

  /* An ID card: portrait on the left, details on the right. */
  profile: `
    <rect x="3.4" y="5" width="17.2" height="14" rx="2.2"/>
    <circle cx="9.4" cy="10.6" r="2.1"/>
    <path d="M6.2 16.1c0-1.8 1.4-2.9 3.2-2.9s3.2 1.1 3.2 2.9"/>
    <path d="M15.1 10.2h3.2M15.1 13.2h3.2"/>`,

  /* A magnifier with a person in the lens — searching people, not text. */
  search: `
    <circle cx="10.4" cy="10.4" r="6.3"/>
    <circle cx="10.4" cy="8.7" r="1.6"/>
    <path d="M7.8 13.6c0-1.5 1.2-2.5 2.6-2.5s2.6 1 2.6 2.5"/>
    <path d="m15.1 15.1 4.5 4.5"/>`,

  /* A membership card with a tick — the question it answers is "am I paid up". */
  membership: `
    <rect x="3" y="5.4" width="18" height="13.2" rx="2.2"/>
    <path d="M3 9.6h18"/>
    <path d="m9.4 14.9 1.7 1.7 3.5-3.6"/>`,

  /* Plain Search is a magnifier with a person in it; this one has the filter
     sliders instead, so the pair reads as "find someone" vs "narrow it down". */
  advsearch: `
    <circle cx="10.4" cy="10.4" r="6.3"/>
    <path d="M7.4 8.8h6M7.4 12h6"/>
    <circle cx="9.1" cy="8.8" r="1.15" fill="currentColor" stroke="none"/>
    <circle cx="12.3" cy="12" r="1.15" fill="currentColor" stroke="none"/>
    <path d="m15.1 15.1 4.5 4.5"/>`,

  /* Rows of people — a crew list. */
  lists: `
    <circle cx="5.6" cy="7" r="1.7"/><path d="M9.5 7h9"/>
    <circle cx="5.6" cy="12" r="1.7"/><path d="M9.5 12h9"/>
    <circle cx="5.6" cy="17" r="1.7"/><path d="M9.5 17h6"/>`,

  /* ── Work: on set, and getting hired ──────────────────────────── */

  calculator: `
    <rect x="5" y="3" width="14" height="18" rx="2.2"/>
    <rect x="7.75" y="6" width="8.5" height="3.2" rx="0.9"/>
    <path d="M8.4 13h.01M12 13h.01M15.6 13h.01M8.4 17h.01M12 17h.01M15.6 17h.01"
          stroke-width="2.4"/>`,

  contract: `
    <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5Z"/>
    <path d="M14 3.5V8h4"/>
    <path d="M8.5 16.5c1.2-2 2-2 2.6-.6.5 1.2 1.2 1.2 1.9.2.6-.9 1.4-.9 2.5.4"/>`,

  /* A stopwatch, not a clock — this one gets started and stopped. */
  stopwatch: `
    <circle cx="12" cy="13.4" r="7.2"/>
    <path d="M9.8 3.2h4.4M12 3.2v2.9"/>
    <path d="M12 9.6v3.8l2.6 1.6"/>
    <path d="m18.6 6.6 1.5 1.5"/>`,

  /* An alarm clock — bells on its shoulders and legs underneath, so it can't
     be taken for the plain stopwatch that Selfwrap uses. */
  alarm: `
    <circle cx="12" cy="13.4" r="7.2"/>
    <path d="M12 9.8v3.6l2.4 1.4"/>
    <path d="M6.6 5.4A3.4 3.4 0 0 0 2.7 8.6"/>
    <path d="M17.4 5.4a3.4 3.4 0 0 1 3.9 3.2"/>
    <path d="m7.5 20.2-1.5 1.9M16.5 20.2l1.5 1.9"/>`,

  /* A clapperboard. */
  slate: `
    <path d="M3.5 9.2 20 6.4v10.9a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/>
    <path d="m4.1 5.6 15.3-2.6.6 3.4-16 2.8Z"/>
    <path d="m8.4 4.9.9 3.3M13 4.1l.9 3.3"/>`,

  /* Four frames around one head — the four angles the sheet is made of. */
  hairgrid: `
    <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.2"/>
    <path d="M12 4.4v15.2M3.4 12h17.2"/>
    <circle cx="7.7" cy="8.1" r="1.5"/>
    <path d="M5.6 11.2c0-1.2 1-1.9 2.1-1.9s2.1.7 2.1 1.9"/>`,

  /* A deck: the card behind, and a face on the one in front. */
  flashcards: `
    <path d="M8.6 5h9a1.9 1.9 0 0 1 1.9 1.9v8.7"/>
    <rect x="4.5" y="7.6" width="11.6" height="11.9" rx="1.9"/>
    <circle cx="10.3" cy="11.9" r="1.6"/>
    <path d="M7.5 16.6c0-1.6 1.3-2.6 2.8-2.6s2.8 1 2.8 2.6"/>`,

  jobs: `
    <rect x="3" y="7.4" width="18" height="12" rx="2.2"/>
    <path d="M9 7.4V5.8a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 5.8v1.6"/>
    <path d="M3 12.6h18"/>
    <path d="M10.6 12.6v1.7h2.8v-1.7"/>`,

  /* The same briefcase as Stunt Jobs, but with a plus — one is looking for
     work, the other is putting work out. */
  postjob: `
    <rect x="3" y="7.4" width="18" height="12" rx="2.2"/>
    <path d="M9 7.4V5.8a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 15 5.8v1.6"/>
    <path d="M12 11.3v4.6M9.7 13.6h4.6"/>`,

  /* One head, framed by viewfinder corners — a headshot being taken, as
     against the ID card (Profile) and the four-up grid (Hair Selfie). */
  headshot: `
    <path d="M3.6 8V5.4a1.8 1.8 0 0 1 1.8-1.8H8"/>
    <path d="M16 3.6h2.6a1.8 1.8 0 0 1 1.8 1.8V8"/>
    <path d="M20.4 16v2.6a1.8 1.8 0 0 1-1.8 1.8H16"/>
    <path d="M8 20.4H5.4a1.8 1.8 0 0 1-1.8-1.8V16"/>
    <circle cx="12" cy="10.5" r="2.5"/>
    <path d="M7.9 17.3c0-2.2 1.8-3.7 4.1-3.7s4.1 1.5 4.1 3.7"/>`,

  /* ── Learn ────────────────────────────────────────────────────── */

  /* A safe door with a play button behind it. */
  vault: `
    <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="2.4"/>
    <circle cx="12" cy="12" r="4.6"/>
    <path d="m10.9 10 3.3 2-3.3 2Z" fill="currentColor" stroke="none"/>
    <path d="M12 5.6v1.6M12 16.8v1.6M5.8 12h1.6M16.6 12h1.6"/>`,

  globe: `
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M3.6 12h16.8"/>
    <path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z"/>`,

  /* A map pin with a dumbbell in it — where the training is. */
  gympin: `
    <path d="M12 21.2c0 0 6.9-6 6.9-10.9a6.9 6.9 0 1 0-13.8 0c0 4.9 6.9 10.9 6.9 10.9Z"/>
    <path d="M9.2 10.3h5.6"/>
    <path d="M8.5 8.9v2.8M15.5 8.9v2.8"/>`,

  /* ── Play ─────────────────────────────────────────────────────── */

  gamepad: `
    <path d="M8.9 7.4h6.2a5.2 5.2 0 0 1 5.1 4.2l.7 4.2a2.5 2.5 0 0 1-4.6 1.7l-1.1-1.8H8.8l-1.1 1.8a2.5 2.5 0 0 1-4.6-1.7l.7-4.2a5.2 5.2 0 0 1 5.1-4.2Z"/>
    <path d="M7.4 10.9v2.8M6 12.3h2.8"/>
    <circle cx="15.4" cy="11.4" r="1" fill="currentColor" stroke="none"/>
    <circle cx="17.6" cy="13.6" r="1" fill="currentColor" stroke="none"/>`,

  /* A body in the air, and the box waiting underneath. */
  highfall: `
    <circle cx="12" cy="4.3" r="1.9"/>
    <path d="M12 6.4v3.7M9.2 7.9 12 6.9l2.8 1M12 10.1l-2.4 3.3M12 10.1l2.4 3.3"/>
    <rect x="3.4" y="16.2" width="17.2" height="4.6" rx="1.6"/>`,

  /* Stairs, and something coming down them. */
  stairs: `
    <path d="M3.6 20.6h4.6V16h4.6v-4.6h4.6V6.8h2.9"/>
    <path d="M3.6 20.6h16.8"/>
    <circle cx="18.3" cy="3.2" r="1.5"/>
    <path d="M19.3 5.3c-1.9 1.3-3.2 2.9-3.9 5"/>`,

  flame: `
    <path d="M12 2.6c.4 3 2.1 4 3.6 5.6a7.4 7.4 0 0 1 2.3 5.3 6 6 0 0 1-11.8 0c0-2.1 1.1-3.6 2.1-4.7.4 1 1 1.6 1.8 1.9C9.6 8.4 10.4 5.5 12 2.6Z"/>
    <path d="M12 21a3 3 0 0 1-1.6-5.6c.5 1 1 1.3 1.6 1.5.7-1.1.6-2.2.3-3.1 1.5.9 2.7 2.3 2.7 4.2A3 3 0 0 1 12 21Z"
          fill="currentColor" stroke="none" opacity=".55"/>`,

  megaphone: `
    <path d="M5.5 9.6h2.6l6.4-4.1v13l-6.4-4.1H5.5A1.5 1.5 0 0 1 4 12.9v-1.8a1.5 1.5 0 0 1 1.5-1.5Z"/>
    <path d="M17.6 9.3a4 4 0 0 1 0 5.4"/>
    <path d="M8.2 14.4v4.2a1.4 1.4 0 0 0 2.8 0v-2.4"/>`,

  /* ── Odds and ends ────────────────────────────────────────────── */

  news: `
    <path d="M3.5 5.6h13.2v13.3a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6Z"/>
    <path d="M16.7 9h2.2a1.6 1.6 0 0 1 1.6 1.6v8a1.9 1.9 0 0 1-3.8 0"/>
    <path d="M6.4 8.8h7M6.4 12h7M6.4 15.2h4.4"/>`,

  store: `
    <path d="M5.4 7.6h13.2l1 12a1.4 1.4 0 0 1-1.4 1.5H5.8a1.4 1.4 0 0 1-1.4-1.5Z"/>
    <path d="M8.8 10V6.9a3.2 3.2 0 0 1 6.4 0V10"/>`,

  gear: `
    <circle cx="12" cy="12" r="3.1"/>
    <path d="M19.1 14.7a1.5 1.5 0 0 0 .3 1.7l.1.1a1.9 1.9 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.9 1.9 0 0 1-3.8 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.9 1.9 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.9 1.9 0 0 1 0-3.8h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.9 1.9 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.9 1.9 0 0 1 3.8 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.9 1.9 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.9 1.9 0 0 1 0 3.8h-.1a1.5 1.5 0 0 0-1.4.9Z"/>`,
};

/* A missing glyph shows as an empty rounded square rather than breaking the
   page, so a typo in apps.js is obvious but harmless. */
const FALLBACK = `<rect x="5" y="5" width="14" height="14" rx="3.4"/>`;

export function glyphSvg(name) {
  const inner = GLYPHS[name] || FALLBACK;
  return `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
    fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
