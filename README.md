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
| **Perform** | orange | Profile · Dashboard · Membership · Settings |
| **Coordinate** | blue | Search · Advanced Search · Lists · Post a Job |
| **Getting Hired** | amber | The Stunt Breakdown · Stunt Jobs · Hair Selfie · Quick Headshot |
| **Set** | green | Call Time · Rate Calculator · SAG Contract Helper · Selfwrap |
| **Learn** | violet | Action Vault · Atlas Action · Gym Map · Stunt People Flashcards |
| **Etc** | teal | Store · All Games · Stunt News |

Two rules hold the layout together, and both are worth keeping:

- **Four tiles per section, so each one is a single row on a phone.** Five
  strands a lonely tile on a second row, which is what the board used to look
  like.
- **One colour per row.** Every tile in a section shares the section's tint,
  and it's the shape of the drawing that tells the apps apart. There is no
  per-app `tint` field, so the rule can't be broken by accident.

The cap does real work: it's why adding Call Time to Set pushed Stunt
People Flashcards to Learn (it is a learning tool) and Stunt News to Etc (it's
a newsletter builder more than a thing you read). Adding a fifth tile anywhere
means moving one out.

Every game goes through the single **All Games** tile. Pro High Faller, Pro
Stair Faller, Pro Fire Burner and Coordinator Please have no tiles of their
own, which is what keeps Etc to one row.

## Changing what's on it

**The easy way: `/admin`.** It isn't linked from the board and is marked
`noindex` — by meta tag and by response header — so you have to know the URL.
It's a table — one line per app with its name, link and icon — so two dozen
links can be checked in a screen rather than scrolled through. Reorder within
a row, move an app to another row, add and delete. Descriptions aren't edited
here; they're still carried on every app for search and screen readers, they
just aren't worth a line each.
**Publish** writes the catalog to KV and the board changes for everyone
straight away — no redeploy.

### Published beats built-in

Once anything has been published, **the stored catalog wins and `apps.js` is
ignored entirely.** A deploy that edits `apps.js` then changes nothing on the
live board, with no error to notice — the only symptom is that an edit doesn't
show up. `/admin` says which of the two is live at the top of the page, and
**Revert to built-in** hands control back to the file.

### Publishing is open, on purpose

There's no password. Anyone who knows the URL can change what every visitor
sees. Two things stand in for a lock:

- **Undo.** Every publish records the state it replaced — including "nothing
  was stored", so undoing a publish made from the built-in board puts the
  built-in board back rather than some older version. Pressing undo twice
  returns you to where you started.
- **Validation.** Links are restricted to `http`, `https`, `sms`, `tel` and
  `mailto`, so a tile can't be pointed at a `javascript:` URL, and payloads
  are size-capped with duplicate ids rejected.

Neither stops someone deliberately repointing a tile at a lookalike login
page. If this ever needs to be genuinely private, put **Cloudflare Access** in
front of `/admin` and `/api` — that needs no password either, just your email.

**The other way: edit the file.** Everything still lives in
[`public/js/apps.js`](public/js/apps.js) — one file, one list. Add an entry
and a tile appears; the grid, the search and the settings toggles all rebuild
from it. This is the built-in default the board falls back to whenever nothing
is stored in KV.

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

## Links

Every link below was given by Jamie, or opened and confirmed. Nothing is
flagged any more — the amber dot is gone from the board.

| Section | App | Link |
| --- | --- | --- |
| Perform | Profile | `stuntlisting.com/edit_profile` |
| Perform | Dashboard | `stuntlisting.com/performer_dashboard` |
| Perform | Membership | `stuntlisting.com/membership_plans` |
| Coordinate | Search | `stuntlisting.com/coordinator_dashboard` |
| Coordinate | Advanced Search | `xstunts.vercel.app` |
| Coordinate | Lists | `stuntlisting.com/my_lists` |
| Coordinate | Post a Job | `stuntlisting.com/job_creation` |
| Getting Hired | The Stunt Breakdown | `thestuntbreakdown.com` |
| Getting Hired | Stunt Jobs | `stuntlisting.com/job_postings` |
| Getting Hired | Hair Selfie | `hairselfie.jamie-181.workers.dev` |
| Getting Hired | Quick Headshot | `sms:8312788687` |
| Set | Call Time | `calltimealarmclock.jamie-181.workers.dev` |
| Set | Rate Calculator | `rate-calculator.jamie-181.workers.dev` |
| Set | SAG Contract Helper | `stuntlisting-contract-toolkit.vercel.app` |
| Set | Selfwrap | `selfwrap.vercel.app` |
| Learn | Action Vault | `action-vault-blond.vercel.app/Splash` |
| Learn | Atlas Action | `atlasaction.com` |
| Learn | Gym Map | `gymmap.jamie-181.workers.dev` |
| Learn | Stunt People Flashcards | `stunt-flashcards.jamie-181.workers.dev` |
| Etc | Store | `stuntlisting.myshopify.com` (with UTM tags) |
| Etc | All Games | `stunt-school-link.vercel.app/?id=33` |
| Etc | Stunt News | `stuntlisting.ghost.io` |

**Quick Headshot isn't a web page.** It opens the phone's messages app to the
headshot line, so it does nothing on a desktop.

**"stunt-school-link" really is the arcade.** The stunt school and the game
launcher are one app, branded "Virtual Stunt School", and it launches the
games. That resolves what looked for a while like two different products. The
individual games (`pro-high-faller`, `pro-stair-faller`, `pro-fire-burner`,
`coordinator-please`) are all live and reached through it rather than having
tiles of their own.

**Several of these had moved**, and the old links still worked well enough to
hide it. The Rate Calculator has now moved twice in this project's lifetime —
Vercel, then `stuntlisting.com`, now its own Cloudflare Worker — and the stale
Vercel deployment still answered the whole time, which is exactly how this
kind of link rots unnoticed. Gym Map moved to Cloudflare too, The Stunt
Breakdown has its own domain, and Stunt News now points at the published title
on Ghost rather than the tool that builds the newsletter.

**The Store link carries UTM tags** exactly as supplied
(`utm_source=stuntlisting&utm_medium=nav_link`). If store visits from the
launcher should be told apart from ones out of the site nav, change
`utm_source` — otherwise they'll be pooled together.

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

No framework and no build step. The board is static; the only server-side code
is one endpoint holding the catalog.

| File | What it does |
| --- | --- |
| `public/js/apps.js` | The built-in catalog — every app, its URL and glyph |
| `public/js/icons.js` | The icon drawings |
| `public/js/app.js` | Builds the grid, runs search and settings |
| `public/js/admin.js` | The editor behind `/admin` |
| `public/css/styles.css` | The board's look |
| `public/css/admin.css` | The editor's look |
| `src/worker.js` | Serves the assets, and `/api/catalog` |

**Where the catalog comes from at runtime:** the board asks `/api/catalog`
first and uses that if it exists; a 404 means nothing has been published and
the built-in `apps.js` stands. Any failure at all — offline, no Worker, opened
as a plain file — lands on the same fallback, which is why the standalone
preview still works.

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
  finding the Rate Calculator. `/admin` doesn't show the field, but it
  preserves what's there.
- **Apps open in a new tab**, so the board stays behind them — but only
  `http(s)` links. `sms:` is handed straight to the phone, and a new tab for
  it would just be left behind, blank.
- **The grid is four fixed columns at every width**, not an auto-fill by
  minimum column size. Auto-fill made nine narrow columns on a desktop and
  left each row of four huddled at the left edge with half the page empty.
  Four columns spread a row across the whole board and keep the columns
  aligned from one section to the next; the tile scales with the room it gets
  (`--icon` / `--glyph` / `--label-size`, 62px → 96px).
- **Settings only hides apps.** It used to also take a StuntListing username
  to build the Profile link; that's an account setting that belongs on
  StuntListing itself, so it's gone. Preferences are per-device, in
  `localStorage`.
