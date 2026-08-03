# BD International — Design Plan

> **Status:** Planning document only. No code has been written yet.
> **Scope of this phase:** Landing page (homepage) only, hand-built in HTML + SCSS.
> **Last updated:** 2026-07-29 · *rev 2 — added reference analysis (§1–2) and app-style mobile spec (§9)*

---

## 0. Assumptions (correct me before we build)

| # | Assumption | Affects |
|---|---|---|
| A1 | **BD International** is a Bangladesh-based education & immigration consultancy placing students in universities abroad (Australia, UK, Canada, USA, Malaysia). | §8 Homepage content |
| A2 | Primary audience: students + parents in Bangladesh. Secondary: partner institutions. | §8, copy tone |
| A3 | Site language is **English only** for v1. Bangla planned but not built now. | §6 Typography (font already Bangla-capable) |
| A4 | We drop the reference sites' B2B corporate services and stay student/visa-facing. | §8.7 Services |
| A5 | Brand identity is **new** — not a recolour of any reference. | §4 Logo, §5 Colour |
| A6 | Forms post to a placeholder endpoint; CRM wired later. | §8.16 Contact |

---

## 1. Reference Analysis

Seven references were supplied and each was fetched, rendered and inspected (computed styles + full-page capture), not just skimmed.

### 1.1 Enonix — `enonix.webflow.io`
**Category:** e-learning platform (Webflow template). The only non-immigration reference.

| | |
|---|---|
| **Type** | Display **Inter Tight 700** @ 64px · Body **Inter 400** @ 18px |
| **Colour** | Forest `#0B5140` · Amber `#FFB91D` · Cream `#F7F3EC` · Sage `#C4D6D2` · Teal `#1CB098` |
| **Feel** | Warm, premium, editorial. Dark-green hero with cream body sections. |

**Worth stealing:**
- **Search bar sitting inside the hero** — turns the hero from a poster into a tool.
- **Avatar stack + "120k+ Students Trust Us" + "4.9/5 Avg. Rating"** directly under the H1. Cheapest, strongest trust signal on the page.
- **Floating glass stat pills** over the hero image (1,000+ Courses / 500+ Instructors / 120k+ Students).
- **Interactive 3-question quiz** ("Choose Smarter") that ends in a recommended course. Enormous lead-capture value.
- **Career-path tabs** showing required skills, **average salary** and **time to complete** per path.
- **Odometer-style digit-reel counters** — each digit scrolls independently. Much more memorable than a plain count-up.

**Reject:** the cream/forest palette (reads as organic/wellness, not visa-and-documents); pricing on cards.

---

### 1.2 Immidox — `23july.hostlin.com/immidox`
**Category:** immigration & visa firm (WordPress + Elementor).

| | |
|---|---|
| **Type** | Display **League Spartan 800** · Body **Poppins 400** |
| **Colour** | Coral `#EC4E4F` · Ink `#222222` · Navy `#1D2133` · Muted `#676767` |
| **Feel** | Friendly, high-energy, rounded. Heavy decorative texture. |

**Worth stealing:**
- **Three white feature cards overlapping the hero's bottom edge** (Apply Visa Online / Visa Resources / Immigration Process) — bridges hero to body and puts three CTAs above the fold.
- **Circular "20 Years of Exp" badge** pinned to the about image.
- **3-step process with circular numbered nodes and dashed arrow connectors.**
- **Full-width coral stats band** — three counters, no ornament.
- **Country checklist** in three tick-list columns + "All Country" button.
- **World-map watermark** and half-tone dot clusters as section texture.
- **Team cards** where social icons reveal on hover.

**Reject:** the coral-on-everything intensity; the dated drop-shadow card style; the volume of decorative dots.

---

### 1.3 Evisa — `wp.xpressbuddy.com/evisa`
**Category:** immigration/visa consulting (WordPress).

| | |
|---|---|
| **Type** | **Plus Jakarta Sans** throughout |
| **Colour** | Deep blue `#003796` · Cyan `#00FCFA` · Yellow `#FFE34C` · Ink `#131923` · Mist `#EDF3F5` · mint-green CTA |
| **Feel** | The most modern of the seven. Airy, light, SaaS-like. Lots of whitespace. |

**Worth stealing:**
- **Duotone / cut-out hero portrait** with floating geometric shapes (circles, diagonal stripes) — distinctive without stock-photo blandness.
- **Tick-list USPs inside the hero** (Expert Legal Support · Meeting Your Unique Needs · Tailored Solutions).
- **Region tabs → flag grid** (Europe / North America / Asia / Latin America / Oceania / Africa) — the best country-browsing pattern of the seven.
- **Trustpilot-branded testimonial cards** with 5-star rows — third-party proof beats self-reported quotes.
- **FAQ answers containing nested tick-lists**, not just prose.
- **Contact form with visa-type chips** you select before writing a message.
- **EN / Arabic / Bangla language switcher** — confirms Bangla is expected in this market.
- **Very light section separation** — near-white `#EDF3F5` bands instead of hard colour blocks.

**Reject:** the almost-invisible thin-grey card borders (too low-contrast); the cyan `#00FCFA` (fails contrast on white).

---

### 1.4 Imigrat — `themexriver.com/wp/imigrat` (4 homepage variants)

One theme, four colourways. Body font **Inter** across all.

| Variant | Accent | Ink/Dark | Character |
|---|---|---|---|
| **Home 1** | Electric blue `#3C67FF` | `#202020` | Big rounded-blob hero mask, email capture in hero, skewed card grid, dark band with circular portrait + `40%` stat, labelled progress bars |
| **Home 3** | Red-orange `#E53E29` | `#1C1C1C` | **Serif headings**, `«»` quote-mark eyebrows, hard diagonal shapes, dark country cards with flags, dark stat column, red accordion |
| **Home 4** | Rose `#FF3E55` | Navy `#1C2448` | Serif two-tone headings, video play buttons, zigzag alternating case studies, pink stat band, navy testimonial band with oversized quote marks |
| **Home 5** | Teal `#22BFCA` | Navy `#1C2448` | Two-tone headings, square-icon service grid, teal "25+ Years" badge, pricing table, navy CTA band with cut-out figure, teal social strip |

**Worth stealing:**
- **Home 5's teal-on-navy** — closest in spirit to our proposed palette, and the most credible of the four.
- **Labelled progress bars** (Immigration Process Responsibility 95% · Quick & Easy Application 79% · 350+ Universities in 17 Countries 99%) — turns claims into visual data.
- **Zigzag alternating image/text rows** (Home 4) for storytelling sections.
- **Dark country cards with flag + short blurb** (Home 3).
- **Cut-out figure breaking out of a coloured band** (Home 5 CTA).
- **Contact card floating over a photo** (Home 3 "Anytime Consulting" form beside a dark stat column).

**Reject:** serif headings (Home 3/4) — wrong register for a digital-first youth audience; the skewed/rotated card grids (fragile on mobile); pricing tables (we don't sell fixed packages).

---

### 1.5 Cross-reference pattern frequency

What appears on how many of the seven. This is the strongest signal of what this category's audience expects.

| Pattern | Count | Verdict for BDI |
|---|---|---|
| Two-tone heading (one phrase in accent colour) | **7/7** | ✅ Adopt — already in plan |
| Eyebrow label above every H2 | **7/7** | ✅ Adopt |
| Animated number counters | **7/7** | ✅ Adopt, with the odometer treatment from Enonix |
| Numbered 3–5 step process | **7/7** | ✅ Adopt |
| Testimonial slider | **7/7** | ✅ Adopt (Swiper) |
| 3-card blog row | **7/7** | ✅ Adopt |
| Partner / affiliation logo row | **6/7** | ✅ Adopt (Swiper marquee) |
| Team member cards | **6/7** | ✅ Adopt |
| Sticky/floating contact CTA | **6/7** | ✅ Adopt — becomes the mobile bottom bar (§9) |
| Floating cards overlapping the hero | **5/7** | ✅ Adopt |
| Country/destination grid with flags | **5/7** | ✅ Adopt — Evisa's region-tab version |
| FAQ accordion | **5/7** | ✅ Adopt |
| "X+ Years Experience" badge | **4/7** | ✅ Adopt |
| Video play button → lightbox | **4/7** | ✅ Adopt (Fancybox) |
| Newsletter signup band | **3/7** | ⚪ Footer only |
| Pricing table | **2/7** | ❌ Reject |
| Serif display headings | **2/7** | ❌ Reject |

### 1.6 What none of them do — our openings

1. **Nobody has a real eligibility checker.** Imigrat says "CHECK ELIGIBILITY" but links to a contact form. Enonix's quiz is the only genuine interactive tool in the set, and it's on the e-learning site. **An honest 4-question eligibility/course-match quiz is the single biggest differentiator available to us.**
2. **All seven are desktop-first.** Every mobile view is a squeezed desktop layout. §9 is where we win.
3. **All seven are stock-photo generic.** Real Bangladeshi students, real offer letters, real airport photos will outperform any of them.
4. **None show pricing or process transparency.** "No hidden fees" as a stated, visible promise is a real differentiator in this market.
5. **Six of seven use lorem ipsum in the live demo.** Sharp, specific copy alone will read as more professional.

---

## 2. Design Direction

**One sentence:** *the airiness and modernity of Evisa, the trust devices of Enonix, the sectional confidence of Imigrat Home 5 — in a navy/teal/gold identity, built mobile-first as an app-like experience.*

| Axis | Where we sit |
|---|---|
| Light ↔ Dark | **Light-dominant** (like Evisa), with 2–3 full-bleed navy bands for rhythm |
| Flat ↔ Decorated | **Restrained** — soft geometric shapes and a faint world-map watermark; no half-tone dot storms |
| Corners | **Soft** — 14–28px radii, pill buttons. Not Imigrat 3/4's hard edges |
| Photography | **Real, warm, human** — cut-out and duotone treatments over the hero |
| Density | **Generous** — Evisa's whitespace, not Immidox's packed sections |
| Motion | **Purposeful** — reveal, count, draw. Nothing that loops forever in the periphery |
| Voice | **Plain and specific.** Numbers over adjectives |

**Signature devices** (used consistently, so the page reads as one system):
1. Two-tone headings — navy phrase + teal or gold emphasis phrase.
2. Eyebrow: 24px teal rule + uppercase tracked label above every H2.
3. Floating glass cards over photography (hero, about, CTA).
4. The logo's **32° arc** reused as section dividers, image masks, and badge shapes.
5. Gold reserved exclusively for proof — stats, badges, ratings, the primary CTA.

---

## 3. Tech Stack & Project Structure

### 3.1 Stack

| Concern | Choice | Notes |
|---|---|---|
| Markup | Static HTML5 | Single `index.html` for v1 |
| Styles | **SCSS** (7-1 architecture) | Compiled to one minified `main.css` |
| Sliders | **Swiper 11** | Partner marquee, destinations, testimonials, mobile snap-rails |
| Lightbox | **Fancybox 5** | Gallery, video testimonials, bottom sheets on mobile |
| Animation | **GSAP 3 + ScrollTrigger** | Reveals, counters, timeline scrub, parallax, mobile drawer |
| Icons | Inline SVG sprite | No icon font; better LCP + a11y |
| Build | Dart Sass CLI | `sass --watch scss/main.scss:assets/css/main.css --style=compressed` |

**No jQuery. No Bootstrap.** Layout is CSS Grid + Flexbox on a custom 12-column container.

### 3.2 Folder structure

```
bdinternational/
├── index.html
├── DESIGN-PLAN.md
├── site.webmanifest
├── assets/
│   ├── css/main.css
│   ├── js/
│   │   ├── vendor/           swiper.min.js · fancybox.umd.js · gsap.min.js · ScrollTrigger.min.js
│   │   ├── modules/
│   │   │   ├── header.js         sticky nav, scroll-direction hide
│   │   │   ├── mobile-nav.js     drawer + bottom tab bar + sheets
│   │   │   ├── sliders.js        all Swiper instances
│   │   │   ├── lightbox.js       Fancybox bindings
│   │   │   ├── animations.js     GSAP timelines + ScrollTrigger
│   │   │   ├── counters.js       odometer stat counters
│   │   │   ├── quiz.js           eligibility checker (§8.9)
│   │   │   └── forms.js          validation + submit
│   │   └── main.js
│   ├── img/  brand/ · hero/ · destinations/ · partners/ · team/ · og/
│   ├── fonts/                self-hosted woff2
│   └── icons/sprite.svg
└── scss/
    ├── abstracts/    _variables · _mixins · _functions · _breakpoints
    ├── base/         _reset · _typography · _utilities
    ├── layout/       _container · _grid · _header · _footer · _mobile-shell
    ├── components/   _button · _card · _badge · _accordion · _form · _stat ·
    │                 _slider · _chip · _sheet · _tabbar · _fab · _skeleton
    ├── sections/     one partial per §8 block
    ├── vendor/       _swiper-overrides · _fancybox-overrides
    └── main.scss     @use manifest only
```

### 3.3 Conventions

- **BEM**: `.hero__title`, `.card--featured`, `.btn.btn--primary`.
- Max 3 levels of SCSS nesting. `@use`/`@forward` only — never `@import`.
- Section root class matches its file. Every section gets an `id` + a `data-animate` hook.
- **Mobile-first**: base styles are the phone layout; `@include mq(lg)` adds desktop.

---

## 4. Logo Design

### 4.1 Concept — "The Open Path"

The monogram **BD** where the bowl of the **D** is cut open and rotated into an upward arc — reading simultaneously as an **open book**, a **rising path**, and a **globe meridian**. Departure and ascent, without the graduation cap or aeroplane every competitor uses. *(Immidox uses a paper plane; Imigrat uses a wordmark only; Evisa uses a tick-in-circle.)*

```
   ┌──────────────────────────────────┐
   │   ██████╗ ╭───╮                  │
   │   ██   ██ │   ╲     ← D's bowl   │
   │   ██████╗ │    │      opens into │
   │   ██   ██ │   ╱       a rising   │
   │   ██████╝ ╰──╯        arc        │
   │                                  │
   │   BD INTERNATIONAL               │
   │   Study Abroad Consultancy       │
   └──────────────────────────────────┘
```

### 4.2 Construction

- Built on an **8pt grid**; strokes a uniform 12 units on a 100-unit cap height.
- The arc sweeps **32°** above the baseline — that angle is reused site-wide for section dividers, image masks and badges.
- **Flat-cut terminals**, not rounded — precision over playfulness.
- Monogram fits **1:1**; horizontal lockup fits **3.4:1**.

### 4.3 Variants (all SVG)

| Variant | File | Use |
|---|---|---|
| Primary horizontal | `logo-primary.svg` | Desktop header, footer |
| Stacked | `logo-stacked.svg` | Mobile header, social profiles |
| Monogram | `logo-mark.svg` | Favicon, PWA icon, loader, watermark |
| Reversed white | `logo-white.svg` | Navy / photo backgrounds |
| Mono black | `logo-black.svg` | Print, single-colour |

### 4.4 Clear space, minimum size, don'ts

- **Clear space** = the arc's height (`x`) on all four sides.
- **Minimums:** horizontal 140px · monogram 24px · print 20mm / 8mm.
- **Don't:** recolour outside the palette · add shadows/bevels/glows · stretch · rotate · place on busy photography without the scrim · re-typeset the wordmark · box it unnecessarily.

### 4.5 Favicon & PWA icon set

`favicon.svg` (monogram, navy) · `favicon-32.png` · `apple-touch-icon-180.png` · `icon-192.png` · `icon-512.png` (maskable, safe-zone padded) · `site.webmanifest` with `theme_color: #0F2A5C`, `background_color: #FFFFFF`, `display: standalone`.

---

## 5. Colour System

### 5.1 Palette

| Token | Hex | Role |
|---|---|---|
| `$c-primary` | `#0F2A5C` | **Deep Ocean** — nav, footer, headings, dark bands |
| `$c-primary-600` | `#1B3F80` | Hover, gradient stop |
| `$c-primary-400` | `#3D66B4` | Links on light backgrounds |
| `$c-accent` | `#00A99D` | **Signal Teal** — secondary CTA, icons, underlines, active states |
| `$c-accent-600` | `#00877E` | Teal hover |
| `$c-accent-100` | `#E4F7F5` | Teal tint — icon chips, active pills |
| `$c-highlight` | `#F6C445` | **Horizon Gold** — primary CTA, stats, badges, ratings |
| `$c-highlight-100` | `#FEF6E0` | Gold tint |
| `$c-ink` | `#0B1220` | Body text |
| `$c-slate` | `#4A5568` | Secondary text |
| `$c-muted` | `#8A94A6` | Placeholders, meta, disabled |
| `$c-line` | `#E2E7F0` | Borders, dividers |
| `$c-mist` | `#F4F6FA` | Alternating section background |
| `$c-white` | `#FFFFFF` | Cards, surfaces |
| `$c-success` / `$c-warning` / `$c-error` | `#2E9E5B` / `#E8A33D` / `#D64545` | Form states |

### 5.2 Positioning against the references

| Reference | Accent | Reads as |
|---|---|---|
| Enonix | Forest + amber | Organic, premium lifestyle |
| Immidox | Coral red | Energetic, budget |
| Evisa | Deep blue + cyan | Clean, corporate SaaS |
| Imigrat 1 | Electric blue | Tech startup |
| Imigrat 3 | Red-orange | Aggressive, legal |
| Imigrat 4 | Rose | Consumer marketing |
| Imigrat 5 | Teal + navy | **Professional services — closest to us** |
| **BD International** | **Navy + teal + gold** | **Institutional trust + human warmth** |

Navy is the register of banks, universities and embassies — the right one for a decision involving a family's savings. Teal keeps it human rather than cold. Gold is the single warm note, reserved for proof.

### 5.3 Gradients & shadows

```scss
$g-primary:   linear-gradient(135deg, #0F2A5C 0%, #1B3F80 100%);
$g-accent:    linear-gradient(135deg, #00A99D 0%, #3DD6C6 100%);
$g-gold:      linear-gradient(135deg, #F6C445 0%, #FFDD84 100%);
$g-scrim:     linear-gradient(180deg, rgba(11,18,32,.72) 0%, rgba(11,18,32,.35) 55%, rgba(11,18,32,.75) 100%);
$g-glass:     linear-gradient(135deg, rgba(255,255,255,.88), rgba(255,255,255,.62));

$shadow-sm:   0 1px 3px  rgba(15,42,92,.08);
$shadow-md:   0 6px 16px rgba(15,42,92,.10);
$shadow-lg:   0 16px 40px rgba(15,42,92,.14);
$shadow-xl:   0 28px 64px rgba(15,42,92,.18);
$shadow-gold: 0 10px 30px rgba(246,196,69,.35);
$shadow-sheet:0 -8px 32px rgba(11,18,32,.18);   // bottom sheets
```

### 5.4 Usage & contrast

**60 / 30 / 10** — 60% white + mist, 30% navy, 10% teal + gold. Gold never exceeds ~3% of any viewport.

Verified: ink on white **16.1:1** · white on primary **12.6:1** · slate on mist **7.4:1** · **ink on gold 13.9:1**. Gold buttons always take ink text, never white *(white on gold is 1.8:1 — a failure Immidox and Imigrat 3 both ship)*.

---

## 6. Typography

### 6.1 Families

| Role | Family | Weights | Rationale |
|---|---|---|---|
| **Display / Headings** | **Plus Jakarta Sans** | 600, 700, 800 | Geometric with humanist warmth; wide apertures survive white-on-photo. *Evisa uses it — the most modern-looking of the seven references.* |
| **Body / UI** | **Inter** | 400, 500, 600 | Best-in-class screen legibility at 15–18px; tabular numerals for stats and phone numbers. *Used by Enonix and all four Imigrat variants.* |
| **Bangla (phase 2)** | **Hind Siliguri** | 400–700 | Pairs cleanly with Inter's proportions. |
| Mono (rare) | `ui-monospace, SFMono-Regular, monospace` | — | Reference codes, IELTS score tables |

> **Alternate** if a tighter, more editorial voice is wanted: **Inter Tight** for display (Enonix's choice) + Inter for body. A one-line swap in `_variables.scss`.
> **Rejected:** League Spartan (Immidox) — too heavy and quirky at small sizes. Serif display (Imigrat 3/4) — wrong register for a youth audience. Poppins — overexposed.

```scss
$font-display: 'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif;
$font-body:    'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
$font-bangla:  'Hind Siliguri', 'Noto Sans Bengali', sans-serif;
```

### 6.2 Scale

Fluid `clamp()`, base 16px, ratio 1.25 mobile → 1.333 desktop.

| Token | Element | Mobile → Desktop | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| `$fs-display` | Hero H1 | `clamp(2.25rem, 5.2vw, 4.25rem)` | 800 | 1.06 | −0.03em |
| `$fs-h1` | Page H1 | `clamp(2rem, 4vw, 3.25rem)` | 700 | 1.12 | −0.02em |
| `$fs-h2` | Section title | `clamp(1.75rem, 3.2vw, 2.5rem)` | 700 | 1.18 | −0.02em |
| `$fs-h3` | Card title | `clamp(1.25rem, 2vw, 1.5rem)` | 600 | 1.30 | −0.01em |
| `$fs-h4` | Sub-head | `1.125rem` | 600 | 1.40 | 0 |
| `$fs-lead` | Intro paragraph | `clamp(1.0625rem, 1.4vw, 1.25rem)` | 400 | 1.65 | 0 |
| `$fs-body` | Body | `1rem` | 400 | 1.70 | 0 |
| `$fs-sm` | Meta, captions | `0.875rem` | 500 | 1.55 | 0 |
| `$fs-eyebrow` | Section label | `0.8125rem` | 600 | 1.40 | **0.14em**, uppercase |
| `$fs-stat` | Counters | `clamp(2.5rem, 4.5vw, 3.5rem)` | 800 | 1.00 | −0.03em |

### 6.3 Rules

- **Max measure 68ch** body, 60ch lead.
- Headings use display; **everything else** uses body. No third face.
- Eyebrow above every H2: uppercase, `$c-accent`, preceded by a 24px teal rule.
- **Two-tone headings** — navy phrase + accent phrase: **"Your Future Starts** *Here***"**. Present on 7/7 references; it works.
- Stats, prices and phone numbers use `font-variant-numeric: tabular-nums`.

### 6.4 Loading

Self-host **woff2 only**, subset `latin` + `latin-ext`, `font-display: swap`. Preload the two above-the-fold files (Jakarta 800, Inter 400). No Google Fonts round-trip — five of the seven references pay that cost unnecessarily.

---

## 7. Layout, Spacing & Motion Tokens

### 7.1 Grid

```scss
$container-max:  1280px;
$container-wide: 1440px;
$gutter: clamp(1rem, 4vw, 2.5rem);
$columns: 12;
$grid-gap: clamp(1rem, 2vw, 2rem);
```

### 7.2 Breakpoints

| Name | Min-width | Target |
|---|---|---|
| `xs` | 0 | 360–479 phones **(design baseline)** |
| `sm` | 480px | Large phones |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `xxl` | 1536px | Large desktop |

Mobile-first, written `@include mq(lg) { … }`. **The app shell (§9) applies below `lg`.**

### 7.3 Spacing (4px base)

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160` → `$sp-1 … $sp-14`.
Section rhythm: `padding-block: clamp(3.5rem, 8vw, 7.5rem)`.

### 7.4 Radii

```scss
$r-sm: 8px;  $r-md: 14px;  $r-lg: 20px;  $r-xl: 28px;  $r-sheet: 24px;  $r-pill: 999px;
```
Cards `$r-lg` · buttons `$r-pill` · media `$r-xl` · bottom sheets `$r-sheet` (top corners only).

### 7.5 Motion

```scss
$ease-out:   cubic-bezier(.22, 1, .36, 1);      // reveals
$ease-inout: cubic-bezier(.65, 0, .35, 1);      // state changes
$ease-back:  cubic-bezier(.34, 1.56, .64, 1);   // badges, counters
$ease-sheet: cubic-bezier(.32, .72, 0, 1);      // iOS-style sheet
$dur-fast: .18s;  $dur-base: .32s;  $dur-slow: .6s;
```

**Rules:** nothing exceeds 0.9s. Reveal distance 24–40px. Stagger 0.08s. Scroll animations run **once** (`toggleActions: 'play none none none'`). All wrapped in `gsap.matchMedia()` behind `(prefers-reduced-motion: no-preference)`.

### 7.6 Z-index ladder

```scss
$z-base:1; $z-sticky:100; $z-header:1000; $z-tabbar:1050;
$z-drawer:1100; $z-sheet:1150; $z-lightbox:1200; $z-toast:1300;
```

---

## 8. Homepage Structure

Sections alternate white / `$c-mist`, with two full-bleed navy bands (Process, CTA) breaking the rhythm. Each entry notes the reference it draws from.

### 8.0 Utility Top Bar *(desktop only, navy, 40px, hides on scroll down)*
Left: phone + email. Right: office hours, socials, language toggle. **Hidden below `lg`** — it moves into the mobile drawer. *(All 7 references have this bar; 6 of them leave it cluttering mobile.)*

### 8.1 Header / Navigation
Logo left · nav centre · **"Free Consultation"** pill right. Transparent over hero → solid white + `$shadow-sm` after 80px (ScrollTrigger class toggle), `backdrop-filter: blur(12px)` when solid. Sticky, `$z-header`.
Nav: Home · About · Destinations · Services · Process · Success Stories · Blog · Contact.
**Mobile:** see §9.2.

### 8.2 Hero — *"the promise"*
60/40 split desktop; stacked mobile. Min-height `88vh` desktop / `100dvh` minus shell on mobile.

- **Background:** real campus/counselling photograph + `$g-scrim` + a large low-opacity logo arc bleeding off the right edge. Slow 8s scale 1.06 → 1.
- **Eyebrow:** `TRUSTED BY 6,000+ BANGLADESHI STUDENTS`
- **H1:** "Your Future Starts **Here**" — gold emphasis word with a hand-drawn SVG underline that draws itself on load.
- **Sub:** one sentence, max 22 words.
- **Social proof row** *(from Enonix)*: 5-avatar stack + "6,000+ students placed" + ★ 4.9/5 rating.
- **CTAs:** gold `Book Free Consultation` · ghost-white `Check Your Eligibility →`
- **Tick-list USPs** *(from Evisa)*: 100% visa guidance · Certified counsellors · No hidden fees.
- **Floating glass stat pills** *(from Enonix)*: "98% Visa Success", "17+ Partner Universities" — gentle infinite float.
- **Right column:** compact 4-field inquiry card — Name · Phone · Destination · Study Level → "Get Free Assessment". Highest-value element on the page; must be visible without scrolling on desktop.

### 8.3 Floating Feature Cards *(from Immidox)*
Three white cards overlapping the hero's bottom edge by ~40%: **Check Eligibility** · **Browse Programs** · **Book Consultation**. Icon + title + one line + arrow. Bridges hero to body and puts three routes above the fold.

### 8.4 Partner / Trust Bar
Continuous Swiper marquee (`freeMode`, `loop`, `autoplay.delay: 0`, `speed: 4000`) of 12–18 partner university logos, greyscale → colour on hover. Label: *"Official representative of"*. Hairline borders top and bottom. *(6/7 references.)*

### 8.5 About — *"who we are"*
Two columns.
- **Left:** image collage — one large portrait + one offset smaller photo, `$r-xl`, gold arc shape behind, **circular "12+ Years" badge** *(from Immidox)*.
- **Right:** eyebrow `ABOUT BD INTERNATIONAL` · H2 "Guiding Bangladeshi Students to **World-Class Education**" · two paragraphs · 4-item tick list · **labelled progress bars** *(from Imigrat 1)*: Visa Success 98% · On-time Applications 95% · Student Satisfaction 97% · text link "More about us →".

**GSAP:** images parallax at differing speeds; bars fill on scroll-in.

### 8.6 Stats Band
Four counters on a gold card overlapping the boundary between §8.5 and §8.7 (negative margin), reading as a bridge.

| **12+** Years | **6.5K+** Students Placed | **98%** Visa Success | **17+** Partner Universities |
|---|---|---|---|

**Odometer treatment** *(from Enonix)*: each digit is a vertical reel that scrolls to its value with a 0.06s per-digit stagger.
**Critical:** the final value ships in the HTML and JS only animates it. *(KD International's counters render `0` when scripts fail — a bug worth not repeating.)*

### 8.7 Study Destinations
Eyebrow `WHERE YOU CAN STUDY` · H2 "Choose Your **Destination**".

**Region tabs** *(from Evisa)*: All · Australia & NZ · UK & Europe · North America · Asia — filtering a Swiper of country cards (`slidesPerView: 1.15 / 2.2 / 3.4`, custom arrows outside the track, progress bar instead of dots).

```
┌─────────────────────┐
│  [ country photo ]  │  ← zooms 1.08 on hover
│  🇦🇺  Australia      │
│  120+ universities  │
│  Intakes: Feb / Jul │
│  Explore →          │
└─────────────────────┘
```
Australia · UK · Canada · USA · Malaysia · Germany. Gradient scrim bottom-up for legible white text.

### 8.8 Services — *"what we do for you"*
Eyebrow `OUR SERVICES` · H2 "End-to-End **Support**" · 6 cards, 3×2 desktop / 2 tablet / horizontal snap-rail on mobile.

1. University Selection & Admission · 2. Scholarship Guidance · 3. Visa & Documentation · 4. IELTS / PTE Preparation · 5. Accommodation Assistance · 6. Pre-Departure & Airport Pickup

Teal SVG icon in a tinted square → title → 2-line description → "Learn more" sliding in on hover. Card lifts `-6px` with `$shadow-lg`.

> **Deliberate departure from KD International**, who buried 10 services in collapsed accordions — hiding the value proposition and dropping the keywords out of first render. Six visible cards beat ten hidden ones.

### 8.9 Eligibility Checker — **our differentiator** *(pattern from Enonix's quiz)*
Full-width navy band, `$g-primary`, faint world-map watermark.

H2 "Are You Eligible? **Find Out in 60 Seconds**" then a 4-step quiz, one question per card with a progress indicator (`01/04`):
1. Which country do you want to study in?
2. What's your highest completed qualification?
3. Do you have an IELTS / PTE score?
4. When do you want to start?

**Result card:** a plain-language readout — likely destinations, indicative intake, documents to prepare — plus name/phone capture to "Get your full assessment by WhatsApp".

**Rules:** all client-side, no page reload; GSAP slide between steps; **honest output** — it estimates and routes to a counsellor, it never promises an outcome. Result state is deep-linkable via hash so users can share it.

*None of the seven references has a working version of this. It is the strongest lead-capture asset available to us.*

### 8.10 Process — *"how it works"*
5 steps, vertical timeline alternating left/right of a centre rule on desktop; **horizontal snap-rail on mobile**.

`1 Free Consultation → 2 University & Course Selection → 3 Application & Offer → 4 Visa Processing → 5 Fly & Settle`

**GSAP:** the centre rule's height is scrubbed to scroll progress (`scrub: 0.6`); each numbered node scales `0 → 1` with `$ease-back` and its card slides in from its side as the line reaches it. The page's signature animation. *(All 7 references have a step section; none animates it well.)*

### 8.11 Why Choose Us
Left: 2×2 feature grid (Certified Counsellors · Transparent Fees · 24/7 Support · Post-Arrival Care). Right: a **Fancybox** gallery — one large image plus a 2×2 thumbnail grid with a `+8` overlay on the last tile. Grouped lightbox, captions, keyboard nav.

### 8.12 Success Stories / Testimonials
`$c-mist`. Swiper, `slidesPerView: 1 / 2 / 3`, `centeredSlides` desktop, autoplay 6s, pause on interaction.

Card: student photo (56px circle) · name · university + country · ★ row · quote (≤40 words) · small university logo bottom-right.
Mixed in: 2–3 **video testimonial** cards with a play badge → **Fancybox** video lightbox. *(Play-button pattern from Imigrat 4/5.)*
If we have a Google/Facebook review score, badge it — Evisa's Trustpilot cards are the most credible proof device in the reference set.

### 8.13 Blog / Insights
H2 "Latest **Guidance**" + "View all →". Three cards: 16:9 image, category pill, date, title (2-line clamp), excerpt (2-line clamp), reading time. Image zooms on hover; title goes teal.
**Sort newest-first, consistently.** *(KD lists Aug 2024, May 2024, Nov 2024 in that order — reads as unmaintained.)*

### 8.14 FAQ
Two-column accordion, 8 questions, first open by default. Native `<details>/<summary>` enhanced with a GSAP height tween; icon rotates 45° (plus → cross). Answers may contain **nested tick-lists** *(from Evisa)*, not just prose. Add `FAQPage` JSON-LD.

### 8.15 CTA Band
Full-bleed navy with the gold arc motif and a **cut-out counsellor photo breaking the top edge** *(from Imigrat 5)*. H2 "Ready to Start Your **Journey**?" · one line · gold `Book Free Consultation` + ghost `WhatsApp Us`. Short — this is a decision point, not a reading passage.

### 8.16 Contact & Offices
Left: office cards (Dhaka HQ + branches) — address, phone, email, hours, "Get directions". Right: contact form — Name · Email · Phone · **destination chips** *(from Evisa)* · Message · consent checkbox. Inline validation, teal focus rings, errors tied via `aria-describedby`.
Below: map **lazy-loaded on click** (static image placeholder → real iframe) to protect LCP.

### 8.17 Footer
Navy, four columns: brand blurb + socials · Quick Links · Destinations · Contact + newsletter. Bottom bar: copyright · Privacy · Terms · "Made by Sklentr". Gold hairline top border.
**Mobile:** columns collapse into accordions; extra bottom padding to clear the tab bar (§9.3).

### 8.18 Floating Actions *(desktop)*
Bottom-right: WhatsApp bubble (pulse ring, appears after 2s) and back-to-top with a circular scroll-progress ring. **On mobile these are replaced by the tab bar + FAB (§9.3).**

---

## 9. App-Style Mobile Experience

**This is the section that separates us from all seven references — every one of them ships a squeezed desktop layout on phones.** Below `lg` (1024px), the site adopts a native-app shell. Given the audience is Bangladeshi students on mid-range Android phones over mobile data, this is also where the commercial return is.

### 9.1 Principles

| Principle | Meaning |
|---|---|
| **Thumb-first** | Every primary action sits in the bottom third. Nothing critical in the top corners. |
| **One thing per screen** | Sections are self-contained cards, not dense multi-column blocks. |
| **Horizontal beats vertical** | Card groups become swipeable rails, not 6-deep vertical stacks. |
| **Sheets, not pages** | Filters, forms and details open as bottom sheets over the current context. |
| **Instant feedback** | Every tap gets a visible response inside 100ms. |
| **Native gestures** | Swipe, drag-to-dismiss, snap-scroll — behaviour users already know. |

### 9.2 Top App Bar
Height 56px, sticky, white with `$shadow-sm` once scrolled.
`[☰]  [BD logo]  ······  [🔍]  [☎]`
- Hides on scroll-down, reappears on scroll-up (GSAP + scroll-direction detection). Always instantly reachable.
- **Drawer** (from the left, 88% width): spring slide-in, dark scrim, staggered link reveal (0.04s), drag-to-close, language toggle + socials + phone/email at the bottom. Body scroll locked while open.

### 9.3 Bottom Tab Bar — the app signature
Fixed, 64px + `env(safe-area-inset-bottom)`, `backdrop-filter: blur(20px)`, hairline top border, `$z-tabbar`.

```
┌──────────────────────────────────────────────┐
│   🏠        🌍       ╭────╮      ★       ☎    │
│  Home   Destinations │ ✓  │  Stories  Contact │
│                      ╰────╯                   │
│                   Check Eligibility           │
└──────────────────────────────────────────────┘
```
- **Centre FAB** (gold, 56px, raised −18px with `$shadow-gold`) opens the **Eligibility Checker** (§8.9) as a full-height sheet. The single most valuable action gets the most valuable pixel.
- Tabs scroll-spy to the matching section; active tab's icon fills and label goes teal.
- **Tab bar hides on scroll-down, returns on scroll-up** so it never eats reading space.
- 48×48px minimum targets, `:active { transform: scale(.94) }` for tap feedback.

### 9.4 Bottom Sheets
Replace modals entirely below `lg`. Built on Fancybox with custom styling.
- Rounded top corners (`$r-sheet`), 40×4px grey drag handle, `$shadow-sheet`.
- **Snap points:** peek (40vh) → full (92dvh). Drag down past 25% dismisses.
- Slides up with `$ease-sheet` over 0.32s; scrim fades to `rgba(11,18,32,.5)`.
- Body scroll locked; sheet content scrolls internally with `overscroll-behavior: contain`.
- **Used for:** eligibility quiz · destination filters · contact form · program details · video testimonials · office directions.

### 9.5 Section adaptations

| Desktop | Mobile |
|---|---|
| Hero 60/40 split | Stacked. H1 → proof row → 2 CTAs → inquiry card collapsed to a single **"Get Free Assessment"** button opening a sheet |
| 3 floating cards | Horizontal snap-rail, 1.15 cards visible (peek indicates more) |
| Region tabs + destination grid | **Story-style circular flag chips** in a scroll rail at the top, filtering a vertical card list below |
| 6-card service grid | 2-col compact grid, or snap-rail — decided in build after testing |
| 5-step vertical timeline | Horizontal snap-rail, one step per screen, dot indicator beneath |
| Testimonial 3-up | 1-up snap carousel, 88vw cards with peek |
| 2-col FAQ | Single-column accordion, all closed by default |
| Footer 4 columns | Accordion groups |
| Floating WhatsApp + back-to-top | Merged into tab bar; WhatsApp becomes a secondary FAB above the bar |

### 9.6 Micro-interactions & feel

- **Tap feedback:** `:active { transform: scale(.97); }` at `$dur-fast` on every card, button and tab.
- **Scroll snapping:** `scroll-snap-type: x mandatory` on rails, `scroll-snap-align: center` on children, `-webkit-overflow-scrolling: touch`.
- **No hover-dependent content** — anything behind a hover on desktop is always visible on mobile.
- **Skeleton loaders** (shimmer) for image-heavy rails instead of layout jumps.
- **Success states** animate: a tick draws itself, then the sheet auto-dismisses after 1.2s.
- **Sticky mid-page CTA:** after the user passes §8.8, a slim gold bar can rise above the tab bar with "Free consultation →". *Optional — cut it if testing shows it annoys.*

### 9.7 Technical requirements

| Concern | Requirement |
|---|---|
| Viewport units | **`dvh` not `vh`** — avoids the mobile-browser URL-bar jump. Fallback `vh` first. |
| Safe areas | `padding-bottom: env(safe-area-inset-bottom)` on tab bar, sheets, footer |
| Meta | `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` |
| Theme colour | `<meta name="theme-color" content="#0F2A5C">` — tints the Android status bar |
| Tap highlight | `-webkit-tap-highlight-color: transparent` + a real `:active` state |
| Text size | `-webkit-text-size-adjust: 100%` |
| Inputs | `font-size: 16px` minimum — anything smaller triggers iOS auto-zoom |
| Input types | `type="tel"` / `inputmode="numeric"` / `autocomplete` on every field — correct keyboard first time |
| Scroll chaining | `overscroll-behavior: contain` on sheets and rails |
| Animation | Transform + opacity only. Never animate `width`/`height`/`top` on mobile |
| Images | `srcset` with 400/800/1200w; AVIF → WebP → JPG |

### 9.8 PWA layer *(low cost, high perceived quality)*
`site.webmanifest` with `display: standalone`, `theme_color: #0F2A5C`, maskable icons. Users can add BD International to their home screen and it opens chromeless, like an app. No service worker in v1 — offline caching is phase 2.

### 9.9 Mobile performance targets

Tested throttled to **Slow 4G / 4× CPU**, the realistic condition for this audience:

| Metric | Target |
|---|---|
| LCP | **< 2.5s** |
| CLS | < 0.05 |
| INP | **< 200ms** |
| Total transfer (mobile) | **< 900KB** |
| Lighthouse Mobile Performance | **≥ 90** |

---

## 10. Component Inventory

| Component | Variants | Notes |
|---|---|---|
| Button | primary (gold) · secondary (navy) · ghost · text-link · **FAB** | Pill; optional icon-right; loading state |
| Card | service · destination · testimonial · blog · office · stat · **glass** | Shared `$r-lg` + hover-lift |
| Badge / Pill | category · gold "featured" · country flag · **years-experience circle** | |
| Chip | destination filter · visa type · region tab | Selected state = teal fill |
| Accordion | FAQ · mobile footer | `<details>` based |
| Form field | text · tel · email · select · textarea · checkbox · chip-group | Floating labels, error/success states |
| Section header | eyebrow + two-tone H2 + optional lead | Reused 10× — build once |
| Slider shell | arrows · progress bar · pagination · **snap-rail** | Swiper override partial |
| Progress bar | labelled percentage | Fills on scroll-in |
| Stat | odometer counter | Digit reels |
| **Bottom sheet** | quiz · filter · form · media | Mobile only |
| **Tab bar** | 4 tabs + centre FAB | Mobile only |
| Skeleton | card · rail · image | Shimmer keyframe |
| Icon | 24px stroke SVGs, one sprite | `currentColor` |
| Modal / Lightbox | image group · video · form | Fancybox |

---

## 11. Motion Specification (GSAP)

| Trigger | Animation | Params |
|---|---|---|
| Page load | Hero sequence | Timeline ~1.1s, staggered |
| Scroll into view | Fade + `y: 32 → 0` | `once: true`, stagger 0.08, `$ease-out` |
| Section headings | Word/line mask reveal | H1/H2 only, never body |
| Stats | Odometer digit reels | Per-digit stagger 0.06, 1.6s |
| Progress bars | Width 0 → value | 1.2s, `$ease-out` |
| Process timeline | Line height scrubbed | `scrub: 0.6` |
| About images | Parallax `yPercent` | `scrub: true` |
| Hero background | Scale 1.06 → 1 | 8s, once |
| Header / tab bar | Show-hide on scroll direction | Class toggle, no tween |
| Quiz steps | Slide + fade between cards | 0.32s, `$ease-out` |
| Bottom sheet | Translate Y + scrim fade | 0.32s, `$ease-sheet` |
| Drawer | Spring slide + link stagger | 0.4s, stagger 0.04 |
| Cards | Hover lift / tap scale | **CSS only**, not GSAP |

**Guardrails:** everything inside `gsap.matchMedia()`; reduced-motion users get opacity-only fades and instant sheets. `will-change` applied during a tween and cleared after. `ScrollTrigger.refresh()` on font-load and image-load to prevent trigger drift.

---

## 12. Accessibility Checklist

- Semantic landmarks: `header` / `nav` / `main` / `section` (each `aria-labelledby`) / `footer`.
- Logical heading order; exactly one `h1`.
- Visible focus ring: `2px solid $c-accent` + 2px offset. Never `outline: none` without a replacement.
- "Skip to content" as first focusable element.
- **Tab bar** = `<nav aria-label="Primary">` with real buttons and `aria-current="true"` on the active tab.
- **Bottom sheets** trap focus, close on `Esc`, return focus to the trigger, `role="dialog"` + `aria-modal="true"`.
- Swiper `a11y` module on; arrows are real `<button>`s; autoplay pauses on focus.
- Meaningful `alt` on all content images; decorative shapes `aria-hidden`.
- Forms: every input labelled; errors announced via `role="alert"`.
- Tap targets ≥ 44×44px (48px in the tab bar).
- Full keyboard pass **and** a TalkBack/VoiceOver pass before sign-off.

---

## 13. Performance Budget

| Metric | Desktop | Mobile (Slow 4G) |
|---|---|---|
| LCP | < 2.0s | < 2.5s |
| CLS | < 0.05 | < 0.05 |
| INP | < 200ms | < 200ms |
| Total weight | < 1.2MB | **< 900KB** |
| CSS | < 60KB min | — |
| JS | < 180KB min | — |
| Fonts | < 120KB | — |
| Lighthouse | ≥ 92 | ≥ 90 |

**Tactics:** AVIF/WebP with `<picture>` fallbacks · explicit `width`/`height` on every image · `loading="lazy"` + `decoding="async"` below the fold · hero eager + preloaded · defer all JS · import only the Swiper/GSAP modules used · map lazy-loaded on click.

> For scale: KD International ships **~930KB of HTML on the homepage alone** because its optimiser base64-inlines every image, and Enonix ships a hero that renders blank until scroll scripts run. We do neither.

---

## 14. Out of Scope for v1 (backlog)

1. **Program Finder** — filterable course database. KD International's version (487 programs / 17 universities / 10 cities from a JSON file) is the strongest single feature across every site reviewed. Phase-2 page.
2. Bangla localisation + RTL-safe groundwork. *(Evisa ships EN/AR/Bangla — the market expects it.)*
3. Blog index + single-post templates.
4. CRM/CMS integration for forms and posts.
5. Service worker / offline caching.
6. Student portal / application tracking.

---

## 15. Asset Checklist (needed before build)

- [ ] Final logo SVGs — 5 variants + favicon/PWA icon set
- [ ] Brand sign-off on palette (§5) and font pairing (§6.1)
- [ ] Hero photograph — 2400px wide, real students preferred over stock
- [ ] 6 destination photos (16:10) + flag SVGs
- [ ] 12–18 partner university logos (SVG / transparent PNG)
- [ ] 6–8 testimonial photos + written quotes + **written consent**
- [ ] 2–3 testimonial videos (or YouTube links)
- [ ] Cut-out counsellor photo for the CTA band (§8.15)
- [ ] Team/office photos for About + gallery (min. 9)
- [ ] Copy: hero, about, 6 services, 5 process steps, 8 FAQs
- [ ] **Eligibility quiz logic** — questions, options, and honest result rules (§8.9)
- [ ] Verified stats *(must be defensible — don't publish 98% unless it's true)*
- [ ] Office addresses, phones, emails, hours
- [ ] Social URLs + WhatsApp business number
- [ ] Analytics / Pixel IDs
- [ ] Privacy Policy + Terms copy

---

## 16. Build Sequence

| Phase | Work |
|---|---|
| 1 | SCSS foundation — tokens, reset, typography, utilities, container, breakpoints |
| 2 | **Mobile shell first** — top app bar, drawer, tab bar, sheet component |
| 3 | Header + footer + desktop nav |
| 4 | Hero (static, no motion) |
| 5 | Sections 8.3 → 8.8 markup + styles |
| 6 | Eligibility checker (§8.9) — logic + sheet |
| 7 | Sections 8.10 → 8.17 markup + styles |
| 8 | Swiper instances + Fancybox wiring + snap-rails |
| 9 | GSAP timelines + ScrollTrigger |
| 10 | Form validation + submit |
| 11 | Responsive QA — 360 / 390 / 768 / 1024 / 1440 / 1920 **on a real Android device** |
| 12 | A11y pass, Lighthouse (mobile + desktop), cross-browser, SEO meta + JSON-LD (`Organization`, `FAQPage`, `BreadcrumbList`) |

---

## 17. Open Questions

1. Confirm the legal/trading name and tagline — is "BD International" the full name?
2. Which destination countries, in what priority order?
3. Are the stats (12+ years, 6.5K students, 98% visa success) real BD International figures or carried over from reference sites?
4. Bangla in v1 or genuinely phase 2? *(Evisa ships it; the market may expect it.)*
5. Where do form submissions go — email, Google Sheet, or a CRM?
6. Do we have real testimonials with consent, or do we need a placeholder treatment for launch?
7. **Eligibility checker:** who defines the qualifying rules — do you have counsellor input available, or should v1 be a lead-capture questionnaire that always routes to a human?
8. Are these seven references chosen for **layout ideas** or is there a specific one you want the visual language anchored to? My read is that **Evisa's airiness + Imigrat Home 5's structure** is the strongest combination for this brand — confirm or redirect.
