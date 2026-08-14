/*
 * The app catalog — the single source of truth for this launcher.
 *
 * To add, remove, rename or re-point an app, edit this file only. The grid,
 * the search and the settings list all build themselves from what's here.
 *
 * Each app takes:
 *   id      unique slug — also the key settings uses to remember hidden apps
 *   name    the title on the card
 *   blurb   one line saying what it actually is, shown under the name
 *   url     where the card goes
 *   glyph   which drawing to use, from the set in icons.js
 *   tint    the icon colour — one of the TINTS below
 *   note    optional — flags a link that still needs confirming
 *   action  optional — 'settings' opens the in-app settings view instead
 */

/* A deliberately short palette. Colour appears only inside the small icon
   tiles, never on the card itself — that's what keeps a wall of apps calm
   instead of turning it into a patchwork. */
export const TINTS = {
  orange: '#ff5a36',   // StuntListing house colour
  amber:  '#f2a33c',
  blue:   '#4c8df6',
  teal:   '#3fb6a8',
  violet: '#8b7be8',
  red:    '#e5484d',
  green:  '#4bb96a',
  slate:  '#8a93a6',
};

export const SECTIONS = [
  {
    id: 'you',
    label: 'You',
    hint: 'Your StuntListing account',
    apps: [
      {
        id: 'performer-dashboard',
        name: 'Performer Dashboard',
        blurb: 'Your home on StuntListing — work, messages, everything.',
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'dashboard',
        tint: 'orange',
      },
      {
        id: 'profile',
        name: 'Profile',
        blurb: 'Your public page — reels, skills, sizes, availability.',
        /* Replaced with stuntlisting.com/<your-username> once a username is
           set in Settings, since that's where profiles actually live. */
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'profile',
        tint: 'amber',
        note: 'Profiles live at stuntlisting.com/<username> — set yours in Settings and this points straight at it.',
      },
      {
        id: 'search',
        name: 'Search',
        blurb: 'Find performers by skill, size, location and look.',
        url: 'https://www.stuntlisting.com/coordinator_dashboard',
        glyph: 'search',
        tint: 'blue',
      },
      {
        id: 'lists',
        name: 'Lists',
        blurb: 'Build and share a crew list for a show.',
        url: 'https://www.stuntlisting.com/lists/',
        glyph: 'lists',
        tint: 'teal',
      },
    ],
  },
  {
    id: 'on-set',
    label: 'On Set',
    hint: 'Tools for the working day',
    apps: [
      {
        id: 'rate-calculator',
        name: 'Rate Calculator',
        blurb: 'Work out a day rate — overtime, adjustments, meal penalties.',
        url: 'https://rate-calculator-v3.vercel.app',
        glyph: 'calculator',
        tint: 'green',
        note: 'Mid-migration from Vercel to Cloudflare Workers — confirm this URL.',
      },
      {
        /* id stays 'contract-toolkit' — it's the key Settings uses to
           remember a hidden app, so renaming it would reset that. */
        id: 'contract-toolkit',
        name: 'SAG Contract Helper',
        blurb: 'Deal memos, terms and the rate schedules behind them.',
        url: 'https://stuntlisting-contract-toolkit.vercel.app',
        glyph: 'contract',
        tint: 'blue',
      },
      {
        id: 'selfwrap',
        name: 'Selfwrap',
        blurb: 'Log your own hours as the day runs.',
        url: 'https://selfwrap.vercel.app',
        glyph: 'stopwatch',
        tint: 'teal',
      },
      {
        id: 'stunt-breakdown',
        name: 'The Stunt Breakdown',
        blurb: "What's filming, and who's hiring.",
        url: 'https://stuntbreakdown3.vercel.app',
        glyph: 'slate',
        tint: 'red',
      },
      {
        id: 'hair-selfie',
        name: 'Hair Selfie',
        blurb: 'Four-angle hair reference sheet, shot on your phone.',
        url: 'https://hairselfie.jamie-181.workers.dev',
        glyph: 'hairgrid',
        tint: 'violet',
      },
      {
        id: 'stunt-flashcards',
        name: 'Stunt Flashcards',
        blurb: 'Paste a list and learn everyone on it — faces and skills.',
        url: 'https://stunt-flashcards.jamie-181.workers.dev',
        glyph: 'flashcards',
        tint: 'amber',
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    hint: 'Training and the people who teach it',
    apps: [
      {
        id: 'action-vault',
        name: 'Action Vault',
        blurb: 'The training library — reels, videos, podcasts and books.',
        url: 'https://action-vault-blond.vercel.app',
        glyph: 'vault',
        tint: 'violet',
      },
      {
        id: 'atlas-action',
        name: 'Atlas Action',
        blurb: 'Essentials for Stunts — the on-demand course.',
        url: 'https://www.atlasaction.com',
        glyph: 'globe',
        tint: 'amber',
      },
      {
        id: 'gymmap',
        name: 'Gym Map',
        blurb: 'World map of stunt training schools and gyms.',
        url: 'https://gymmap-iota.vercel.app',
        glyph: 'gympin',
        tint: 'teal',
      },
      {
        id: 'stunt-school',
        name: 'Stunt School',
        blurb: 'The virtual stunt school — lessons and school analytics.',
        url: 'https://stunt-school-link.vercel.app',
        glyph: 'school',
        tint: 'blue',
      },
    ],
  },
  {
    id: 'play',
    label: 'Play',
    hint: 'The arcade',
    apps: [
      {
        id: 'stlg-arcade',
        name: 'STLG Arcade',
        blurb: 'The whole cabinet — every StuntListing game in one place.',
        url: 'https://stlg-arcade.vercel.app',
        glyph: 'gamepad',
        tint: 'red',
      },
      {
        id: 'pro-high-faller',
        name: 'Pro High Faller',
        blurb: 'Ride the high fall down to the box.',
        url: 'https://pro-high-faller.vercel.app',
        glyph: 'highfall',
        tint: 'blue',
      },
      {
        id: 'pro-stair-faller',
        name: 'Pro Stair Faller',
        blurb: 'Take the stairs the hard way.',
        url: 'https://pro-stair-faller.vercel.app',
        glyph: 'stairs',
        tint: 'violet',
      },
      {
        id: 'pro-fire-burner',
        name: 'Pro Fire Burner',
        blurb: 'Gel up, light up, hit the safety.',
        url: 'https://pro-fire-burner.vercel.app',
        glyph: 'flame',
        tint: 'amber',
      },
    ],
  },
  {
    id: 'more',
    label: 'More',
    hint: 'Everything else',
    apps: [
      {
        id: 'stunt-news',
        name: 'Stunt News',
        blurb: 'Build the newsletter — compose, preview, export the HTML.',
        url: 'https://stunt-news.vercel.app',
        glyph: 'news',
        tint: 'slate',
      },
      {
        id: 'x-stunts',
        name: 'X Stunts',
        blurb: 'The Canadian stunt community site.',
        url: 'https://xstunts.vercel.app',
        glyph: 'xmark',
        tint: 'red',
      },
      {
        id: 'store',
        name: 'Store',
        blurb: 'StuntListing merch and the Atlas Action course.',
        url: 'https://stuntlisting.myshopify.com',
        glyph: 'store',
        tint: 'amber',
      },
      {
        id: 'settings',
        name: 'Settings',
        blurb: 'Hide apps you never use, and set your profile link.',
        url: '#settings',
        glyph: 'gear',
        tint: 'slate',
        action: 'settings',
      },
    ],
  },
];

/* One flat list, for search and for the settings list. */
export const ALL_APPS = SECTIONS.flatMap((section) =>
  section.apps.map((app) => ({ ...app, section: section.label })),
);
