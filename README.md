# StuntListing Apps

One launcher for everything we've built. Twenty-two apps on a single screen of
icons, sorted into what you'd actually be doing — your account, the working
day, training, the arcade.

It's a home screen, but not a phone's: the tiles are matte plates with a
tinted line drawing rather than glossy squircles, and they sit under titled
section rules instead of floating on a wallpaper. No dock, no page dots,
nothing to swipe.

Search from the top rail or press `/`. Settings hides the apps you never open
and points the Profile tile at your own page.

**Live:** _not deployed yet — see [Deploying](#deploying)._

## What's on it

| Section | Apps |
| --- | --- |
| **You** | Performer Dashboard · Profile · Search · Lists |
| **On Set** | Rate Calculator · SAG Contract Helper · Selfwrap · The Stunt Breakdown · Hair Selfie · Stunt Flashcards |
| **Learn** | Action Vault · Atlas Action · Gym Map · Stunt School |
| **Play** | STLG Arcade · Pro High Faller · Pro Stair Faller · Pro Fire Burner |
| **More** | Stunt News · X Stunts · Store · Settings |

## Changing what's on it

Everything lives in [`public/js/apps.js`](public/js/apps.js) — one file, one
list. Add an entry and a tile appears; the grid, the search and the settings
toggles all rebuild from it.

```js
{
  id: 'my-app',
  name: 'My App',
  blurb: 'One line saying what it actually is.',
  url: 'https://example.com',
  glyph: 'camera',          // any name from public/js/icons.js
  tint: 'teal',             // one of the eight in TINTS
}
```

Move an app between sections by moving its entry between the `SECTIONS`
arrays. Colour comes from the short `TINTS` palette at the top of the file —
it only ever appears inside the icon tile, which is what stops a wall of apps
turning into a patchwork.

Drawings live in [`public/js/icons.js`](public/js/icons.js). Two rules when
adding one: draw it in a 24×24 box at stroke weight 1.7, and make sure it
can't be mistaken for another icon at 25px — that's why Search is a magnifier
with a person inside it, and the two falling games are drawn from different
angles.

## Links worth confirming

This session's network blocked `*.vercel.app`, `*.workers.dev`, `github.io`
and `stuntlisting.com`, so no link below was opened — they came from the
Vercel and GitHub APIs, from each repo's own README, and from URL patterns
found in the Stunt Flashcards and Hair Selfie source. Two are flagged in the
app with an amber dot:

| App | URL | Why |
| --- | --- | --- |
| **Rate Calculator** | `rate-calculator-v3.vercel.app` | The repo is mid-migration from Vercel to Cloudflare Workers. Its last three Vercel production deploys failed and the project no longer carries that clean alias — this is the URL the repo itself advertises. If it's on a Worker now, point it there. |
| **Profile** | `stuntlisting.com/performer_dashboard` | Profiles live at `stuntlisting.com/<username>`, so there's no single URL that works for everyone. Set a username in Settings and the tile points straight at your page; until then it falls back to the dashboard. |

A few others aren't the obvious guess and are worth a glance: Action Vault is
`action-vault-blond`, Gym Map is `gymmap-iota`, The Stunt Breakdown points at
`stuntbreakdown3`, and Hair Selfie is `hairselfie.jamie-181.workers.dev`
(worker name confirmed, subdomain inferred from Stunt Flashcards).

## Running it

Static files, no build step. The site is `public/`.

```bash
npm start          # http://localhost:4173
npm run dev        # or the real Workers runtime, via wrangler
```

To produce a single self-contained HTML file for sharing a preview:

```bash
npm run build:preview          # → dist/preview.html
```

## Deploying

An assets-only Cloudflare Worker, the same shape as Hair Selfie and Stunt
Flashcards. Pick one:

**1 — From your machine (quickest first deploy).**

```bash
npm install
npx wrangler deploy        # opens a browser login the first time
```

Publishes to `https://stlapps.<your-subdomain>.workers.dev`. Given Stunt
Flashcards lives on `jamie-181.workers.dev`, expect
`https://stlapps.jamie-181.workers.dev`.

**2 — On every push, via GitHub Actions.** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
is already set up and needs two repository secrets
(Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — a token made from the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID` — on the Workers overview page in the dashboard

**3 — Workers Builds.** In the Cloudflare dashboard: Workers & Pages → Create →
import this repository. Leave the build command empty (there's nothing to
build) and set the deploy command to `npx wrangler deploy`.

For a custom domain, add it under the Worker's Settings → Domains & Routes —
`apps.stuntlisting.com` being the obvious one.

## How it's built

No framework, no dependencies, no build. Four files:

| File | What it does |
| --- | --- |
| `public/js/apps.js` | The catalog — every app, its URL, colour and glyph |
| `public/js/icons.js` | The icon drawings |
| `public/js/app.js` | Builds the grid, runs search, settings and the timecode |
| `public/css/styles.css` | The whole look |

Notes for whoever edits this next:

- **Settings are per-device.** Username and hidden apps sit in `localStorage`
  under one key. Nothing is sent anywhere; there is no server and no account.
- **`[hidden] { display: none !important }` in the CSS is load-bearing.** The
  tiles, sections and board all set `display`, and a class selector outranks
  the browser's own `[hidden]` rule — without it, hiding anything silently
  does nothing and Settings renders on top of the board.
- **The look** is borrowed from set paperwork: matte black, hairline rules,
  and monospaced labels of the kind that run down a call sheet. It commits to
  one dark palette rather than following the system theme — this gets opened
  on set, often at night.
- **Blurbs are carried but not printed.** Each tile holds its one-line
  description in a visually-hidden span, which is what search matches on and
  what a screen reader reads out. Drop it and searching "overtime" stops
  finding the Rate Calculator.
- **The grid's 78px minimum column is deliberate** — it's the widest column
  that still fits four across a small phone. Most sections hold four apps, so
  anything wider strands the fourth on a row of its own.
