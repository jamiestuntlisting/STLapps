# StuntListing Apps

An iPhone home screen for everything we've built. Open it on a phone and it
looks like a home screen — four icons across, pages that swipe, a dock along
the bottom. Open it on a desktop and the pages open out into one wide board.

Add it to a phone's home screen and it launches full-screen with no browser
chrome, so the launcher itself behaves like an app.

**Live:** _not deployed yet — see [Deploying](#deploying)._

## What's on it

**Dock** (on every page) — StuntListing · Contracts · Rate Calc · Action Vault

**Stunt Work** — Performer Dashboard · Coordinator Dashboard · Exhibit G ·
Call Sheet · Breakdown · Coord Please · Hair Selfie · Flashcards · Stunt News ·
Gym Map · Stunt School · Atlas Action · Stunt Scores · Canada X · Jerk Vest · Shop

**Arcade** — STLG Arcade · Hot to Mark · High Faller · Stair Faller · Fire Burner

## Changing what's on it

Everything lives in [`public/js/apps.js`](public/js/apps.js) — one file, one
list. Add an entry and an icon appears; the grid, the page dots and the search
all rebuild themselves from it. Nothing else needs touching.

```js
{
  id: 'my-app',
  name: 'My App',                       // label — two lines, then it clips
  url: 'https://example.com',
  glyph: 'camera',                      // any name from public/js/icons.js
  tint: ['#ff7a45', '#e8331d'],         // the icon gradient, light → dark
  blurb: 'One line, shown in search.',
}
```

Drawings live in [`public/js/icons.js`](public/js/icons.js). To add one, draw
it in a 24×24 box, keep the stroke weight at 1.7 to match the rest, and name it
in the `glyph` field.

To move an app between pages, move its entry between the `PAGES` arrays. To pin
one to the dock, move it into `DOCK` — dock apps sit on every page and aren't
repeated in the grid, so four is the practical limit.

## Links worth confirming

Two icons point at URLs that couldn't be verified from here — this session's
network blocks `*.vercel.app`, `*.workers.dev` and `github.io`, so every link
below came from the Vercel and GitHub APIs rather than from loading the page.
Both are marked in the app with a small amber dot, and say why on hover.

| App | URL | Why it's flagged |
| --- | --- | --- |
| **Rate Calc** | `rate-calculator-v3.vercel.app` | The repo is mid-migration from Vercel to Cloudflare Workers. Its last three production deploys on Vercel failed, and the Vercel project no longer carries that clean alias — the URL is the one the repo itself advertises. If it now lives on a Worker, point it there. |
| **Hair Selfie** | `hairselfie.jamie-181.workers.dev` | Deduced from the Worker name in `wrangler.jsonc` plus the subdomain Stunt Flashcards uses. The worker name is certain; the subdomain is not. |

Everything else is a canonical domain read straight from the Vercel API, the
repo's own README, or the site itself. A few are not the obvious guess —
Action Vault is `action-vault-blond`, Gym Map is `gymmap-iota`, and the
Breakdown points at `stuntbreakdown3` — so they're worth a glance too.

## What was left off, and why

The screen is public-facing, so it only carries apps a performer or coordinator
could open. Left off deliberately:

- **Internal and demo builds** — performer dashboard mock-up, profile-update
  demo, STLG profile review, devtracker, coordinator-software, the older
  stunt-breakdown versions.
- **Training Sesh** — its README calls it a private personal tool with no
  external branding.
- **Skill Reel Viewer** — a login-gated Express app that appears to deploy on
  Railway; no public URL to point at.
- **What's Going On** — still the unmodified Next.js starter.
- **Non-stunt projects** — Cheese Roll, Streets of New York 2, Gorillaw and
  Order, Book Report, Breathe Better Breaths, Smile Analysis and the rest.

Any of these becomes one entry in `apps.js` if you want it back.

## Running it

It's a static page — no build step. The site lives in `public/`.

```bash
npm start          # serves public/ at http://localhost:4173
npm run dev        # or the real Workers runtime, via wrangler
```

## Deploying

An assets-only Cloudflare Worker, the same shape as Hair Selfie and Stunt
Flashcards:

```bash
npm install
npx wrangler deploy        # prompts a browser login the first time
```

That publishes to `https://stlapps.<your-subdomain>.workers.dev`. Rename the
worker in [`wrangler.jsonc`](wrangler.jsonc) if you'd rather it were something
else, or put it behind a custom domain — `apps.stuntlisting.com` would be the
obvious one.

## How it's built

No framework, no dependencies, no build. Three files do the work:

| File | What it does |
| --- | --- |
| `public/js/apps.js` | The catalog — every app, its URL, colour and glyph |
| `public/js/icons.js` | The 25 icon drawings |
| `public/js/app.js` | Builds the grid, runs the clock, paging and search |
| `public/css/styles.css` | Both layouts — the phone grid and the desktop board |

Details worth knowing:

- **Icons open in the same tab.** Tapping an app on a phone leaves the home
  screen and Back brings you home — and inside an installed web app a new tab
  would throw you out to the browser.
- **Search** opens on tap, on `⌘K` / `Ctrl-K`, or by just typing a letter, the
  way a real home screen does. Arrow keys move, Enter opens, Escape closes.
- **Pages** swipe on a phone and respond to the arrow keys; the dots are
  buttons. Above 900px the pages stop swiping and open out instead.
- The status bar hides itself when the app is installed, so its clock doesn't
  sit under the real one.
