# StuntListing Apps

One launcher for everything we've built. Twenty-four apps on a single screen of
icons, grouped by what you're actually doing — your own account, coordinating
a show, getting hired, the working day, and training. Each group is one row,
in one colour.

It's a home screen, but not a phone's: the tiles are matte plates with a
tinted line drawing rather than glossy squircles, and they sit under titled
section rules instead of floating on a wallpaper. No dock, no page dots,
nothing to swipe.

Search from the top rail or press `/`. Settings hides the apps you never open.

**Live:** _not deployed yet — see [Deploying](#deploying)._

## What's on it

| Section | | Apps |
| --- | --- | --- |
| **Performer** | orange | Profile · Dashboard · Membership · Settings |
| **Coordinating** | blue | Search · Advanced Search · Lists · Post a Job |
| **Getting Hired** | amber | The Stunt Breakdown · Stunt Jobs · Hair Selfie · Quick Headshot |
| **On Set** | green | Call Time · Rate Calculator · SAG Contract Helper · Selfwrap |
| **Learn** | violet | Action Vault · Atlas Action · Gym Map · Stunt People Flashcards |
| **Etc** | teal | Store · All Games · Coordinator Please · Stunt News |

Two rules hold the layout together, and both are worth keeping:

- **Four tiles per section, so each one is a single row on a phone.** Five
  strands a lonely tile on a second row, which is what the board used to look
  like.
- **One colour per row.** Every tile in a section shares the section's tint,
  and it's the shape of the drawing that tells the apps apart. There is no
  per-app `tint` field, so the rule can't be broken by accident.

The four-per-row cap does real work. It's why the arcade collapsed to a
single **All Games** tile — Pro High Faller, Pro Stair Faller and Pro Fire
Burner are reached through it rather than having tiles of their own — and why
adding Call Time to On Set pushed Stunt People Flashcards to Learn (it is a
learning tool) and Stunt News to Etc (it's a newsletter builder more than a
thing you read). Adding a fifth tile anywhere means moving one out.

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
}
```

The colour isn't set here — it comes from the section's `tint`.

Move an app between sections by moving its entry between the `SECTIONS`
arrays; it takes that section's colour with it. Section tints come from the
short `TINTS` palette at the top of the file, and colour only ever appears
inside the icon tile — never on the label or the background.

Drawings live in [`public/js/icons.js`](public/js/icons.js). Two rules when
adding one: draw it in a 24×24 box at stroke weight 1.7, and make sure it
can't be mistaken for another icon at 30px — that's why Search is a magnifier
with a person in the lens while Advanced Search has the filter sliders, and
the two falling games are drawn from different angles.

## Links worth confirming

This session's network blocked `*.vercel.app`, `*.workers.dev`, `github.io`
and `stuntlisting.com`, so no link below was opened — they came from the
Vercel and GitHub APIs, from each repo's own README, and from URL patterns
found in the Stunt Flashcards and Hair Selfie source. The seven below are
flagged in the app with an amber dot:

| App | URL | Why |
| --- | --- | --- |
| **Rate Calculator** | `rate-calculator-v3.vercel.app` | The repo is mid-migration from Vercel to Cloudflare Workers. Its last three Vercel production deploys failed and the project no longer carries that clean alias — this is the URL the repo itself advertises. If it's on a Worker now, point it there. |
| **Membership** | `stuntlisting.com/membership` | Guessed. Nothing in any repo names the real membership page. |
| **Stunt Jobs** | `stuntlisting.com/jobs` | Guessed, same reason. |
| **Profile** | `stuntlisting.com/performer_dashboard` | Profiles live at `stuntlisting.com/<username>`, so no single URL works for everyone. Falls back to the dashboard. |
| **Post a Job** | `stuntlisting.com/post-a-job` | Guessed, same reason. |
| **Call Time** | `stuntlisting.com/call-time` | A call time alarm doesn't exist yet — nothing in any of the repos is one. The tile is a placeholder so the row is ready for it. |
| **Quick Headshot** | `sms:+18312788687` | Not a web app — the tile opens a text message to the headshot line. Swap the `url` for a real page when one exists. |

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
| `public/js/app.js` | Builds the grid, runs search and settings |
| `public/css/styles.css` | The whole look |

Notes for whoever edits this next:

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
  that still fits four across a small phone, which is what makes the
  four-per-section rule land as exactly one row.
- **Settings only hides apps.** It used to also take a StuntListing username
  to build the Profile link; that's an account setting that belongs on
  StuntListing itself, so it's gone. Preferences are per-device, in
  `localStorage`.
