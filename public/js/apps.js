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
 *   note    optional — flags a link that still needs confirming
 *   action  optional — 'settings' opens the in-app settings view instead
 */

/* A deliberately short palette. Colour belongs to the *row*, not the app —
   every tile in a section shares one tint, and it's the shape of the drawing
   that tells them apart. That's why there is no per-app `tint`: the rule
   can't be broken by accident. Keep sections to four tiles so each one is a
   single row on a phone. */
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
    id: 'perform',
    label: 'Perform',
    tint: 'orange',
    apps: [
      {
        id: 'profile',
        name: 'Profile',
        blurb: 'Your public page — reels, skills, sizes, availability.',
        url: 'https://www.stuntlisting.com/edit_profile',
        glyph: 'profile',
      },
      {
        id: 'performer-dashboard',
        name: 'Dashboard',
        blurb: 'Your home on StuntListing — work, messages, everything.',
        url: 'https://www.stuntlisting.com/performer_dashboard',
        glyph: 'dashboard',
      },
      {
        id: 'membership',
        name: 'Membership',
        blurb: 'Your plan — what you have bought, and what runs out when.',
        url: 'https://www.stuntlisting.com/membership_plans',
        glyph: 'membership',
      },
      {
        id: 'settings',
        name: 'Settings',
        blurb: 'Hide the apps you never open.',
        url: '#settings',
        glyph: 'gear',
        action: 'settings',
      },
    ],
  },
  {
    id: 'coordinate',
    label: 'Coordinate',
    tint: 'blue',
    apps: [
      {
        id: 'search',
        name: 'Search',
        blurb: 'Find performers by skill, size, location and look.',
        url: 'https://www.stuntlisting.com/coordinator_dashboard',
        glyph: 'search',
      },
      {
        id: 'advanced-search',
        name: 'Advanced Search',
        blurb: 'X Stunts — deeper search across the Canadian stunt database.',
        url: 'https://xstunts.vercel.app',
        glyph: 'advsearch',
      },
      {
        id: 'lists',
        name: 'Lists',
        blurb: 'Build and share a crew list for a show.',
        url: 'https://www.stuntlisting.com/my_lists',
        glyph: 'lists',
      },
      {
        id: 'post-a-job',
        name: 'Post a Job',
        blurb: 'Put a call out — hire for a show.',
        url: 'https://www.stuntlisting.com/job_creation',
        glyph: 'postjob',
      },
    ],
  },
  {
    id: 'getting-hired',
    label: 'Getting Hired',
    tint: 'amber',
    apps: [
      {
        id: 'stunt-breakdown',
        name: 'The Stunt Breakdown',
        blurb: "What's filming, and who's hiring.",
        url: 'https://thestuntbreakdown.com/',
        glyph: 'slate',
      },
      {
        id: 'stunt-jobs',
        name: 'Stunt Jobs',
        blurb: 'Open calls and jobs going out now.',
        url: 'https://www.stuntlisting.com/job_postings',
        glyph: 'jobs',
      },
      {
        id: 'hair-selfie',
        name: 'Hair Selfie',
        blurb: 'Four-angle hair reference sheet, shot on your phone.',
        url: 'https://hairselfie.jamie-181.workers.dev/',
        glyph: 'hairgrid',
      },
      {
        id: 'quick-headshot',
        name: 'Quick Headshot',
        /* Not a web app: this opens the phone's messages app. It does nothing
           on a desktop, which is why the blurb says so out loud. */
        blurb: 'Text a photo to the headshot line and get one back.',
        url: 'sms:8312788687',
        glyph: 'headshot',
      },
    ],
  },
  {
    id: 'set',
    label: 'Set',
    tint: 'green',
    apps: [
      {
        id: 'call-time',
        name: 'Call Time',
        /* Nothing in the repos is a call time alarm yet, so this is a
           placeholder tile. Point it at the real thing once it exists. */
        blurb: 'Set an alarm for tomorrow\'s call.',
        url: 'https://www.stuntlisting.com/call-time',
        glyph: 'alarm',
        note: 'Not built yet. This link 404s until the alarm exists — the tile is a placeholder.',
      },
      {
        id: 'rate-calculator',
        name: 'Rate Calculator',
        blurb: 'Work out a day rate — overtime, adjustments, meal penalties.',
        url: 'https://www.stuntlisting.com/rate_calculator',
        glyph: 'calculator',
      },
      {
        /* id stays 'contract-toolkit' — it's the key Settings uses to
           remember a hidden app, so renaming it would reset that. */
        id: 'contract-toolkit',
        name: 'SAG Contract Helper',
        blurb: 'Deal memos, terms and the rate schedules behind them.',
        url: 'https://stuntlisting-contract-toolkit.vercel.app/',
        glyph: 'contract',
      },
      {
        id: 'selfwrap',
        name: 'Selfwrap',
        blurb: 'Log your own hours as the day runs.',
        url: 'https://selfwrap.vercel.app/',
        glyph: 'stopwatch',
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    tint: 'violet',
    apps: [
      {
        id: 'action-vault',
        name: 'Action Vault',
        blurb: 'The training library — reels, videos, podcasts and books.',
        url: 'https://action-vault-blond.vercel.app/Splash',
        glyph: 'vault',
      },
      {
        id: 'atlas-action',
        name: 'Atlas Action',
        blurb: 'Essentials for Stunts — the on-demand course.',
        url: 'https://atlasaction.com/',
        glyph: 'globe',
      },
      {
        id: 'gymmap',
        name: 'Gym Map',
        blurb: 'World map of stunt training schools and gyms.',
        url: 'https://gymmap.jamie-181.workers.dev/',
        glyph: 'gympin',
      },
      {
        id: 'stunt-flashcards',
        name: 'Stunt People Flashcards',
        blurb: 'Paste a list and learn everyone on it — faces and skills.',
        url: 'https://stunt-flashcards.jamie-181.workers.dev/',
        glyph: 'flashcards',
      },
    ],
  },
  {
    id: 'etc',
    label: 'Etc',
    tint: 'teal',
    apps: [
      {
        id: 'store',
        name: 'Store',
        blurb: 'StuntListing merch and the Atlas Action course.',
        url: 'https://stuntlisting.myshopify.com/?utm_source=stuntlisting&utm_medium=nav_link&utm_campaign=store_redirect',
        glyph: 'store',
      },
      {
        /* Yes, "stunt-school-link" is the arcade. The stunt school and the
           game launcher are the same app — it's branded "Virtual Stunt
           School" and it launches the games. The ?id=33 is part of the link
           as given; don't trim it. */
        id: 'stlg-arcade',
        name: 'All Games',
        blurb: 'The game launcher — every StuntListing game in one place.',
        url: 'https://stunt-school-link.vercel.app/?id=33',
        glyph: 'gamepad',
      },
      {
        id: 'stunt-news',
        name: 'Stunt News',
        blurb: 'Stunt industry news and features, from StuntListing.',
        url: 'https://stuntlisting.ghost.io/',
        glyph: 'news',
      },
    ],
  },
];

/* One flat list, for search and for the settings toggles. */
export const ALL_APPS = SECTIONS.flatMap((section) =>
  section.apps.map((app) => ({ ...app, section: section.label })),
);
