/*
 * The app catalog — the single source of truth for this launcher.
 *
 * To add, remove, rename or re-point an app, edit this file only. The grid,
 * the search and the settings list all build themselves from what's here.
 *
 * Each app takes:
 *   id      unique slug — also the key settings uses to remember hidden apps
 *   name    the label under the icon
 *   blurb   one line saying what it is — not printed on the grid, but it's
 *           what search matches on and what a screen reader reads out
 *   url     where the tile goes
 *   glyph   which drawing to use, from the set in icons.js
 *   tint    the icon colour — one of the TINTS below
 *   note    optional — flags a link that still needs confirming
 *   action  optional — 'settings' opens the in-app settings view instead
 */

/* A deliberately short palette. Colour appears only inside the icon tile,
   which is what keeps a wall of apps calm instead of a patchwork. */
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
    id: 'performer',
    label: 'Performer',
    apps: [
      {
        id: 'profile',
        name: 'Profile',
        blurb: 'Your public page — reels, skills, sizes, availability.',
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'profile',
        tint: 'amber',
        note: 'Profiles live at stuntlisting.com/<username>, so there is no one URL for everyone — this goes to the dashboard.',
      },
      {
        id: 'performer-dashboard',
        name: 'Dashboard',
        blurb: 'Your home on StuntListing — work, messages, everything.',
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'dashboard',
        tint: 'orange',
      },
      {
        id: 'membership',
        name: 'Membership',
        blurb: 'Your plan — what you have bought, and what runs out when.',
        url: 'https://www.stuntlisting.com/membership',
        glyph: 'membership',
        tint: 'green',
        note: 'Guessed URL — swap it for the real membership page.',
      },
      {
        id: 'settings',
        name: 'Settings',
        blurb: 'Hide the apps you never open.',
        url: '#settings',
        glyph: 'gear',
        tint: 'slate',
        action: 'settings',
      },
    ],
  },
  {
    id: 'coordinating',
    label: 'Coordinating',
    apps: [
      {
        id: 'search',
        name: 'Search',
        blurb: 'Find performers by skill, size, location and look.',
        url: 'https://www.stuntlisting.com/coordinator_dashboard',
        glyph: 'search',
        tint: 'blue',
      },
      {
        id: 'advanced-search',
        name: 'Advanced Search',
        blurb: 'X Stunts — deeper search across the Canadian stunt database.',
        url: 'https://xstunts.vercel.app',
        glyph: 'advsearch',
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
    id: 'getting-hired',
    label: 'Getting Hired',
    apps: [
      {
        id: 'stunt-breakdown',
        name: 'The Stunt Breakdown',
        blurb: "What's filming, and who's hiring.",
        url: 'https://stuntbreakdown3.vercel.app',
        glyph: 'slate',
        tint: 'red',
      },
      {
        id: 'stunt-jobs',
        name: 'Stunt Jobs',
        blurb: 'Open calls and jobs going out now.',
        url: 'https://www.stuntlisting.com/jobs',
        glyph: 'jobs',
        tint: 'amber',
        note: 'Guessed URL — swap it for the real jobs page.',
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
        id: 'quick-headshot',
        name: 'Quick Headshot',
        /* No web tool for this yet, so the tile opens a text message to the
           headshot line. Swap the url for a real one when it exists. */
        blurb: 'Text a photo in and get a headshot back.',
        url: 'sms:+18312788687',
        glyph: 'headshot',
        tint: 'teal',
        note: 'Opens a text message to (831) 278-8687 — placeholder until there is a web tool.',
      },
    ],
  },
  {
    id: 'on-set',
    label: 'On Set',
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
        id: 'stunt-flashcards',
        name: 'Stunt People Flashcards',
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
        id: 'stunt-news',
        name: 'Stunt News',
        blurb: 'Build the newsletter — compose, preview, export the HTML.',
        url: 'https://stunt-news.vercel.app',
        glyph: 'news',
        tint: 'slate',
      },
    ],
  },
  {
    id: 'play',
    label: 'Play',
    apps: [
      {
        /* The arcade is the front door. The individual games below are the
           ones confirmed to still stand up on their own. */
        id: 'stlg-arcade',
        name: 'All Games',
        blurb: 'The whole arcade cabinet — every StuntListing game.',
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
      {
        id: 'coordinator-please',
        name: 'Coordinator Please',
        blurb: 'The coordinator game — run the day and keep everyone alive.',
        url: 'https://coordinator-please.vercel.app',
        glyph: 'megaphone',
        tint: 'green',
      },
    ],
  },
  {
    id: 'ect',
    label: 'Ect',
    apps: [
      {
        id: 'store',
        name: 'Store',
        blurb: 'StuntListing merch and the Atlas Action course.',
        url: 'https://stuntlisting.myshopify.com',
        glyph: 'store',
        tint: 'orange',
      },
    ],
  },
];

/* One flat list, for search and for the settings toggles. */
export const ALL_APPS = SECTIONS.flatMap((section) =>
  section.apps.map((app) => ({ ...app, section: section.label })),
);
