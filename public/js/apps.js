/*
 * The app catalog — the single source of truth for this home screen.
 *
 * To add, remove, rename or re-point an icon, edit this file only. Nothing
 * else needs to change: the grid, the Spotlight search and the page dots all
 * build themselves from what's here.
 *
 * Each app takes:
 *   id      unique slug (used for keys and search)
 *   name    the label under the icon — keep it short, iOS truncates ~13 chars
 *   url     where the icon goes
 *   glyph   which drawing to use, from the set in icons.js
 *   tint    [from, to] — the two colours of the icon's gradient
 *   blurb   one line, shown in Spotlight search results
 *   note    optional — flags a link that still needs confirming
 */

/* The four apps pinned to the dock. They sit on every page, so they're
   deliberately the ones reached for most and are not repeated in the grid. */
export const DOCK = [
  {
    id: 'stuntlisting',
    name: 'StuntListing',
    url: 'https://www.stuntlisting.com',
    glyph: 'listing',
    tint: ['#ff7a45', '#e8331d'],
    blurb: 'The stunt directory — search performers, build lists, hire.',
  },
  {
    id: 'contract-toolkit',
    name: 'Contracts',
    url: 'https://stuntlisting-contract-toolkit.vercel.app',
    glyph: 'contract',
    tint: ['#5b7cfa', '#2b3fd0'],
    blurb: 'Contract toolkit — deal memos, terms and rate schedules.',
  },
  {
    id: 'rate-calculator',
    name: 'Rate Calc',
    url: 'https://rate-calculator-v3.vercel.app',
    glyph: 'calculator',
    tint: ['#3ddc84', '#12a35c'],
    blurb: 'Work out a day rate — overtime, adjustments, meal penalties.',
    note: 'Mid-migration from Vercel to Cloudflare Workers — confirm this URL.',
  },
  {
    id: 'action-vault',
    name: 'Action Vault',
    url: 'https://action-vault-blond.vercel.app',
    glyph: 'vault',
    tint: ['#9a6bff', '#5b2bc9'],
    blurb: 'Training library — reels, videos, podcasts, books and courses.',
  },
];

/* The home screen pages. On a phone these swipe left and right, four across
   and up to six down. On a desktop they open out into one wide board. */
export const PAGES = [
  {
    id: 'work',
    title: 'Stunt Work',
    apps: [
      {
        id: 'performer-dashboard',
        name: 'Performer',
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'performer',
        tint: ['#ff9a5a', '#f2612c'],
        blurb: 'Your StuntListing profile — reels, skills, sizes, availability.',
      },
      {
        id: 'coordinator-dashboard',
        name: 'Coordinator',
        url: 'https://www.stuntlisting.com/coordinator_dashboard',
        glyph: 'coordinator',
        tint: ['#ffb648', '#f08a1c'],
        blurb: 'Search performers and build crew lists for a show.',
      },
      {
        id: 'exhibit-g',
        name: 'Exhibit G',
        url: 'https://selfwrap.vercel.app',
        glyph: 'clock',
        tint: ['#4cc9f0', '#1878c9'],
        blurb: 'Exhibit G time logger — log your hours as the day runs.',
      },
      {
        id: 'better-call-sheet',
        name: 'Call Sheet',
        url: 'https://better-call-sheet-web.vercel.app',
        glyph: 'callsheet',
        tint: ['#7d8ba1', '#4a5568'],
        blurb: 'A better call sheet — read the day at a glance.',
      },
      {
        id: 'stunt-breakdown',
        name: 'Breakdown',
        url: 'https://stuntbreakdown3.vercel.app',
        glyph: 'breakdown',
        tint: ['#f0596d', '#c11c47'],
        blurb: "The Stunt Breakdown — what's filming and who's hiring.",
      },
      {
        id: 'coordinator-please',
        name: 'Coord Please',
        url: 'https://coordinator-please.vercel.app',
        glyph: 'megaphone',
        tint: ['#ffd166', '#e8a020'],
        blurb: 'Coordinator Please — the ask-a-coordinator tool.',
      },
      {
        id: 'hair-selfie',
        name: 'Hair Selfie',
        url: 'https://hairselfie.jamie-181.workers.dev',
        glyph: 'camera',
        tint: ['#ff6b9d', '#d61f69'],
        blurb: 'Four-angle hair reference sheet, built on your phone.',
        note: 'URL inferred from the worker name — confirm the subdomain.',
      },
      {
        id: 'stunt-flashcards',
        name: 'Flashcards',
        url: 'https://stunt-flashcards.jamie-181.workers.dev',
        glyph: 'cards',
        tint: ['#38bdf8', '#0369a1'],
        blurb: 'Paste a list URL and learn everyone on it — faces and skills.',
      },
      {
        id: 'stunt-news',
        name: 'Stunt News',
        url: 'https://stunt-news.vercel.app',
        glyph: 'news',
        tint: ['#94a3b8', '#475569'],
        blurb: 'Build the newsletter — compose, preview, export the HTML.',
      },
      {
        id: 'gymmap',
        name: 'Gym Map',
        url: 'https://gymmap-iota.vercel.app',
        glyph: 'map',
        tint: ['#34d399', '#047857'],
        blurb: 'World map of stunt training schools and gyms.',
      },
      {
        id: 'stunt-school',
        name: 'Stunt School',
        url: 'https://stunt-school-link.vercel.app',
        glyph: 'school',
        tint: ['#60a5fa', '#1d4ed8'],
        blurb: 'Virtual stunt school — lessons and school analytics.',
      },
      {
        id: 'atlas-action',
        name: 'Atlas Action',
        url: 'https://www.atlasaction.com',
        glyph: 'atlas',
        tint: ['#fb923c', '#c2410c'],
        blurb: 'Essentials for Stunts — the on-demand course library.',
      },
      {
        id: 'stunt-scores',
        name: 'Stunt Scores',
        url: 'https://stunt-scores.vercel.app',
        glyph: 'scores',
        tint: ['#a3e635', '#4d7c0f'],
        blurb: 'Score sheets and performer analytics.',
      },
      {
        id: 'canada-x-stunts',
        name: 'Canada X',
        url: 'https://xstunts.vercel.app',
        glyph: 'maple',
        tint: ['#f87171', '#b91c1c'],
        blurb: 'Canada X Stunts — the Canadian stunt community site.',
      },
      {
        id: 'jerk-vest',
        name: 'Jerk Vest',
        url: 'https://jerk-vest-app.vercel.app',
        glyph: 'vest',
        tint: ['#c084fc', '#7e22ce'],
        blurb: 'Jerk Vest Productions — the special features menu.',
      },
      {
        id: 'shop',
        name: 'Shop',
        url: 'https://stuntlisting.myshopify.com',
        glyph: 'bag',
        tint: ['#fbbf24', '#d97706'],
        blurb: 'StuntListing merch and the Atlas Action course.',
      },
    ],
  },
  {
    id: 'arcade',
    title: 'Arcade',
    apps: [
      {
        id: 'stlg-arcade',
        name: 'STLG Arcade',
        url: 'https://stlg-arcade.vercel.app',
        glyph: 'arcade',
        tint: ['#f472b6', '#9d174d'],
        blurb: 'The whole arcade cabinet — every StuntListing game.',
      },
      {
        id: 'hot-to-mark',
        name: 'Hot to Mark',
        url: 'https://hot-to-mark.vercel.app',
        glyph: 'car',
        tint: ['#fb7185', '#be123c'],
        blurb: 'The stunt driving game — hit your mark, hot.',
      },
      {
        id: 'pro-high-faller',
        name: 'High Faller',
        url: 'https://pro-high-faller.vercel.app',
        glyph: 'highfall',
        tint: ['#38bdf8', '#0c4a6e'],
        blurb: 'Ride the high fall down to the box.',
      },
      {
        id: 'pro-stair-faller',
        name: 'Stair Faller',
        url: 'https://pro-stair-faller.vercel.app',
        glyph: 'stairs',
        tint: ['#a78bfa', '#5b21b6'],
        blurb: 'Take the stairs the hard way.',
      },
      {
        id: 'pro-fire-burner',
        name: 'Fire Burner',
        url: 'https://pro-fire-burner.vercel.app',
        glyph: 'fire',
        tint: ['#fb923c', '#b91c1c'],
        blurb: 'Full burn — gel up, light up, hit the safety.',
      },
    ],
  },
];

/* One flat list, for Spotlight search. */
export const ALL_APPS = [
  ...DOCK.map((a) => ({ ...a, page: 'Dock' })),
  ...PAGES.flatMap((p) => p.apps.map((a) => ({ ...a, page: p.title }))),
];
