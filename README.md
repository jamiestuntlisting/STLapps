# StuntListing Apps

One launcher for everything we've built. Twenty-three apps on a single screen of
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
| **Etc** | teal | Store · Stunt School · Stunt News |

Two rules hold the layout together, and both are worth keeping:

- **Four tiles per section, so each one is a single row on a phone.** Five
  strands a lonely tile on a second row, which is what the board used to look
  like.
- **One colour per row.** Every tile in a section shares the section's tint,
  and it's the shape of the drawing that tells the apps apart. There is no
  per-app `tint` field, so the rule can't be broken by accident.

The cap does real work: it's why adding Call Time to On Set pushed Stunt
People Flashcards to Learn (it is a learning tool) and Stunt News to Etc (it's
a newsletter builder more than a thing you read). Adding a fifth tile anywhere
means moving one out.

**No games are on the board.** They were dropped on the assumption that an
"All Games" tile reached them; that tile turned out to serve the Virtual Stunt
School instead. All four games are live — see below — and want a row of their
own if they should be one tap away.

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

Most links have now been opened and confirmed working (200 OK, correct page)
by fetching them through Vercel's own network, which reaches what this
session's egress proxy blocks. What could **not** be reached from here at all:
`*.workers.dev`, `stuntlisting.com`, `atlasaction.com` and the Shopify store.

Confirmed live, with the page title each one actually serves:

| App | Serves |
| --- | --- |
| Rate Calculator | StuntListing Bookkeeper (redirects to `/login`) |
| SAG Contract Helper | StuntListing Contract Guide |
| Selfwrap | Exhibit G Time Logger |
| The Stunt Breakdown | The Stunt Breakdown |
| Advanced Search | xStunts — Stunt Performer Search |
| Action Vault | Action Vault |
| Gym Map | Stunt Training & Specialty Facilities — World Map |
| Stunt News | Stunt News — Newsletter Generator |
| Stunt School | **Virtual Stunt School** — see below |

**The `stlg-arcade` deployment is not an arcade.** It serves the Virtual Stunt
School. The tile used to say "All Games" and open a stunt school, so it's now
labelled Stunt School. The four games are alive at their own URLs and are
currently not on the board at all:

| Game | Serves |
| --- | --- |
| `pro-high-faller` | StuntListing's Pro Stunt High Faller |
| `pro-stair-faller` | Pro Stair Faller |
| `pro-fire-burner` | Fire Burn Simulator |
| `coordinator-please` | Coordinator Please |

Still unverified, and flagged in the app with an amber dot:

| App | URL | Why |
| --- | --- | --- |
| **Membership** | `stuntlisting.com/membership` | Guessed. No page by that name turned up. |
| **Post a Job** | `stuntlisting.com/post-a-job` | Guessed. Posting may live inside `/job_postings`. |
| **Call Time** | `stuntlisting.com/call-time` | A call time alarm doesn't exist yet — nothing in any repo is one. Placeholder. |
| **Quick Headshot** | `sms:+18312788687` | Not a web app — opens a text message. Swap the `url` when a page exists. |
| **Rate Calculator** | `rate-calculator-v3.vercel.app` | It loads, but the repo is mid-migration to Cloudflare Workers and its last three Vercel deploys failed. Working today; confirm where it should live. |

Confirmed by search rather than by fetching: `/edit_profile` is the real
profile page and `/job_postings` the real job board, so those two tiles are no
longer guesses.

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
