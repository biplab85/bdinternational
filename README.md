# KD Education Ltd. — landing page

Single-page marketing site for KD Education Ltd., a study-abroad and
immigration consultancy. Static HTML with a compiled Sass stylesheet and one
vanilla-JS file — no framework, no bundler, no server-side code.

> The repo and some copy still say **BD International**, the company's former
> name. The rebrand to KD Education Ltd. is partially done — see
> [Known leftovers](#known-leftovers).

## Requirements

- **Node.js** — only to compile Sass (`sass` is the single devDependency)
- **A static web server.** Development here runs under WAMP/Apache, with the
  project inside `www/`, served at
  `http://localhost/sklentr/bdinternational/`. Any static server works; the
  page makes no server-side calls.

## Getting started

```bash
npm install
npm run dev     # sass --watch, expanded + source map
```

Then open the site through your web server. Opening `index.html` from the
filesystem (`file://`) mostly works but is not how it is developed.

| Script | Does |
| --- | --- |
| `npm run dev` | Watches `scss/` and recompiles on save, expanded, with a source map |
| `npm run build` | One-shot compressed build, no source map |

## Layout

```
index.html              the entire page — every section, plus the SVG sprite
                        and the two dialogs, in one file
scss/                   source stylesheet (see scss/main.scss for load order)
  abstracts/            variables + mixins, no CSS output
  base/                 reset, typography, utilities
  layout/               header, footer, mobile shell
  components/           buttons, cards, forms, accordion, sliders, sheet
  sections/             one file per page section
  vendor/               overrides that must beat library defaults
assets/css/main.css     compiled output — committed, see below
assets/js/main.js       all behaviour: nav, sliders, reveals, quiz, dialogs
assets/img/             imagery, grouped by section
DESIGN-PLAN.md          the design brief the build follows, section by section
```

Third-party libraries load from CDN in `index.html`, not from npm: Swiper 11,
Fancybox 5, and GSAP 3.12 with ScrollTrigger.

## Conventions worth knowing

**`assets/css/main.css` is committed.** It is build output, but it is tracked,
because the site is deployed by copying files rather than by running a build.
Recompile before committing so the CSS matches the Sass. Source maps are
gitignored.

The tracked file is currently the **expanded** output of `npm run dev`, not the
compressed `npm run build`. Keep it that way unless you mean to switch —
committing a compressed build turns the whole file into one line and every
later diff becomes unreadable.

**Bump the cache-buster when the CSS changes.** `index.html` links the
stylesheet as `assets/css/main.css?v=NN`. Increment `NN` in the same commit as
a CSS change, or browsers keep serving the old file — including yours, which
makes a correct change look broken.

**`scss/main.scss` is a manifest.** Declarations go in the partial they belong
to, never in `main.scss`.

**The contact block lives only inside its dialog.** It is not a section in the
page flow. Every "Free consultation" trigger and every `#contact` link opens
`#sheet-contact`, so edit it there.

## Known leftovers

Carried over from the BD International era and not yet updated:

- Meta description, one body paragraph, and a testimonial still name the UK,
  Canada and the USA. The destination cards and the eligibility quiz now offer
  Australia, New Zealand and Malaysia only.
- The contact form's consent line still reads "BD International".
- The phone-number placeholder is a Bangladesh format (`01XXXXXXXXX`), and the
  top bar still shows a `+880` number and a `bdinternational.com.bd` address,
  while the contact dialog lists the Sydney office.
