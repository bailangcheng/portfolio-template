---
version: "0.1"
name: "<Your Name> — Portfolio"
description: "Starter direction: warm paper, Manrope + Noto (ja/zh), large light headings, asymmetric columns below a card-like first view. Replace this line with your own accepted direction."
upstream: "docs/design-source/（静的稿・Figma・参考スクリーンショット）"

colors:
  paper: "#f3f3f1"          # page background (html and body)
  ink: "#1c1d1c"            # primary text
  muted: "#666862"          # secondary text
  rule: "#cdcec7"           # dividers
  link-line: "#999a92"      # .text-link resting underline
  surface: "#eeefeb"        # first-view card
  surface-line: "#e4e5df"
  media: "#e8e8e4"          # image placeholder / frames
  footer: "#141519"
  footer-ink: "#f4f4ee"
  footer-muted: "#bec0c5"
  footer-line: "#767980"
  accent: "#2855be"         # the only accent: first-view glow, 3D scene. Never on work images
  accent-soft: "#8596d8"
  accent-pale: "#c3cdea"
  chip-bg: "#f9f9f4eb"
  chip-ink: "#32342f"
  danger: "#b3261e"         # form errors only
  focus: "#175bd1"
  selection: "#bdcbee"

typography:
  latin: "Manrope 400/500/600"
  mono: "DM Mono 400 (numbering / meta, 11px, +0.035em)"
  cjk: { ja: "Noto Sans JP 400/500", zh: "Noto Sans SC 400/500" }   # only the page's own language is loaded
  tracking:                     # latin → ja/zh
    hero: "-0.06em → -0.02em"
    display: "-0.055em → -0.015em"
    title: "-0.05em → -0.01em"
  prose-line-height: "1.85 → 1.95"
  scale:                         # mobile (≤800) → desktop (≥801)
    hero:        { size: "clamp(43px,9vw,68px) → clamp(45px,6.4vw,98px)", lh: 1.075 }
    page:        { size: "43px → clamp(44px,5.8vw,86px)", lh: 1.12 }
    section:     { size: "clamp(30px,3.9vw,60px)", lh: 1.12 }
    title:       { size: "30px → clamp(29px,3.3vw,50px)", lh: 1.15 }
    heading:     { size: "26px → 36px", lh: "1.2 → 1.15" }
    footer-cta:  { size: "48px → clamp(45px,6vw,91px)", lh: 1.1 }
    lead:        { size: "16px → 18px", lh: 1.7 }
    prose:       { size: "15px → 16px", lh: "var(prose-line-height)" }
    body:        { size: "15px", lh: 1.65 }
    ui/nav/meta/micro: { size: "14 / 12 / 11 / 10px", lh: 1.65 }
  weights: "headings 400 (never bold) / body 400 / labels 500"

layout:
  pad: "clamp(22px, 3.2vw, 58px)"
  breakpoints: { sm: "431px", md: "801px (the one main switch)", 2xl: "1550px" }
  section-y: "65px → 105px → 130px (≥1550)"
  columns: "intro/about 1.35 : 1 (gap 8vw) · work rows 0.77 : 1.45 alternating · case sections 0.65 : 1.4"

rounded:
  hero: "24px (20px ≤800)"
  media: "21px"
  figure: "18px"
  footer: "28px top (22px ≤800)"

motion:
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  hover: "450ms"
  reveal: "fade + rise 24px (media 36px), power3.out 0.9s / 1.2s, stagger 0.08"
  hero-lines: "rise from mask, power4.out 1.2s, stagger 0.1"
  pointer-follow: "0.08s"
---

# Overview

The starting direction is a quiet paper-like portfolio: warm paper surfaces, Manrope, large light headings (400), generous whitespace, and asymmetric columns that begin **below** a card-like first view. The work is the colour; the interface is not.

- Exact values: the YAML above ↔ `src/app/globals.css` (tokens + component classes). **Change both in the same commit.**
- This file is the executable version of whatever the upstream design is (`docs/design-source/`). If the upstream changes, update this file first, then the CSS.
- When you change a layout, measure it against the accepted study at the same viewport (computed style and box), not by eye.

# Colors

- Two surfaces carry the site: `paper` for pages and `surface` for the first-view card. The footer is the one dark surface.
- `accent` is the **only** accent colour (first-view glow, 3D scene, focus family). Do not introduce a second accent without adding it here first.
- **Never filter, tint or overlay original work images.** The only exception is the dark gradient under text on an `image` first view, which sits beside the image, not on the work itself.
- ⚠️ Naming trap: a colour token and a font-size token with the same name collide in Tailwind v4 (`--color-hero` + `--text-hero` → `text-hero` resolves to the *colour*; a real site shipped a 15 px near-white mobile h1 this way). That is why the card colour is `surface`. `npm run lint` (`scripts/check-tokens.mjs`) blocks this.

# Typography

- Manrope for Latin in every language; DM Mono only for numbering and meta (`.mono`).
- Japanese and Chinese get **one** CJK family each (Noto Sans JP / Noto Sans SC), loaded only on pages of that language (`[locale]/layout.tsx`). Manrope is listed first, so Latin inside Japanese text still uses Manrope.
- Headings are **400**: light and large, never bold (W-06). Labels and nav may use 500.
- Tracking comes from CSS variables that switch by `:lang()`. Latin headings are tightened (-0.06em); CJK headings are almost untouched (-0.02em) because tight tracking makes kana and hanzi collide. Never hard-code a negative `tracking-[…]` on text that can be CJK.
- Japanese headings use `word-break: auto-phrase` (break at phrase boundaries where supported). `line-break: strict` applies to ja and zh.
- Fonts load through `<link>` (never `next/font/google`: Turbopack returns 500, B-02). If you change a font, change the `<link>`, the CSP `font-src`/`style-src` if the host changes, and this file.

# Layout

- **First view:** a rounded card (`surface`) at `min-height: calc(100svh - 128px)` on desktop; mobile is `clamp(480px, 100svh - 130px, 600px)` so tall phones do not show a half-empty card. Headline lines sit at the bottom-left; name + tagline under them; location and a scroll cue on the last line.
- Asymmetric columns start **below** the first view (see `layout.columns`).
- One main breakpoint at 801 px. Below it, columns stack and the header wraps. **No hamburger menu**: the nav has three items plus the language switcher.
- Do not hide layout bugs with a global `overflow-x: hidden`. Check 390 px and 320 px: `document.documentElement.scrollWidth > innerWidth` must be `false`.

## First view variants (`site.hero.visual` in `src/content/site.ts`)

| kind | What | Use when |
| --- | --- | --- |
| `grid` (default) | Sparse cross grid (64 px tile, 10 px crosses, 0.75 px strokes). The crosses near the cursor take the accent colour; a small faint glow sits beneath. Touch: drifts slowly. | No hero asset yet, or the work should speak first |
| `image` | One representative image, full-bleed in the card, gentle parallax, white text over a bottom gradient | A single image carries your identity |
| `three` | A Three.js scene behind the text (see **3D**) with an optional `poster` image | The work is spatial, or the first view itself is a piece |

⚠️ The mask tile of `.hero-grid-glow` and the `::before` tile of `.cross-grid` must stay identical (64 px, same origin), or the coloured crosses drift off the grey ones.

# Components

| Component | File | Notes |
| --- | --- | --- |
| Header | `components/layout/SiteHeader.tsx`, `NavLinks.tsx`, `LocaleSwitcher.tsx` | Not sticky. Name links home (never an h1). Current page underlined. Language switcher JA / 中 / EN keeps the current path |
| Footer | `components/layout/SiteFooter.tsx` | Dark, rounded top. Big `mailto:` address, then SNS chips. Only confirmed addresses (`null` renders nothing) |
| Hero | `components/home/Hero.tsx` + `HeroPointer.tsx` | See **First view variants**. Headline lines are masked (`data-hero-line`) |
| Work row (TOP) | `components/works/WorkRow.tsx` | 0.77 : 1.45 alternating. Image and text both link to the case study |
| Work card (/works) | `components/works/WorkCard.tsx`, `WorksIndex.tsx` | Two columns ≥801. Filter buttons (`aria-pressed`) write `?category=` to the URL |
| Case study | `components/works/CaseStudy.tsx`, `app/[locale]/works/[slug]/page.tsx` | Fixed order 1–9 (title → key visual → summary → facts → brief → process → outcome → reflection → next). Facts rows with no value are not rendered |
| Figures | `CaseStudy.tsx` → `Figures` | 1 image = full width; 2+ = two columns. **Never cropped** (natural aspect), with optional captions |
| Contact form | `components/contact/ContactForm.tsx` | Underlined fields (`.field`), pill submit. Only when `site.contact.form` is true |
| Page intro | `components/ui/PageIntro.tsx` | The page's only `<h1>`, eyebrow, lead, meta row |
| Links | `components/ui/SmartLink.tsx` | `.text-link` (resting line + drawn line), `.link-line` (drawn on hover), `.link-arrow` (nudges in its direction) |

# Motion

GSAP + ScrollTrigger. Motion supports reading and never decorates for its own sake.

| Where | What | Implementation |
| --- | --- | --- |
| First view, load | Headline lines rise from their masks, then name/tagline/meta fade in | `HeroPointer` timeline, power4.out 1.2 s, stagger 0.1 |
| First view, pointer (fine, `grid`) | Coloured crosses and glow follow almost instantly (0.08 s — 1.4 s was rejected as laggy). Native cursor, no custom dot. On leave they ease back to the rest point (72 % / 62 %) | `gsap.quickTo` → `--mx`/`--my` |
| First view, idle / touch | The glow drifts slowly around its rest point (6 s yoyo) | |
| Scroll | `[data-reveal]` fades and rises 24 px (batched, stagger 0.08); `[data-reveal="media"]` rises 36 px | `MotionProvider` + `ScrollTrigger.batch`, once |
| Case key visual / `image` hero | Gentle parallax (±4 %) | `[data-parallax]`, scrub |
| Works filter | Shown cards fade and rise 16 px | `WorksIndex` |
| Hover | Work images zoom 1.035 (1.4 s); link lines draw from the left; arrows nudge; footer chips invert | CSS, `--ease-out`, 450 ms |

Rules:
- **`prefers-reduced-motion: reduce` → nothing moves** (`gsap.matchMedia`), and CSS shows every element immediately.
- **No invisible content:** the hidden initial state only exists under `html.js` (set by a head script before paint). If `MotionProvider` has not started within 3 s, `.reveal-fallback` forces everything visible.
- **Never let GSAP and a CSS `transition` animate the same property on the same element.** Reveals animate the wrapper; hover zoom lives on the inner `img`.
- When a GSAP tween starts from a CSS `translateY(%)`, set `y: 0` explicitly, or GSAP keeps the parsed px offset (measured: hero lines left 97 px low).
- New content blocks get `data-reveal`; image frames get `data-reveal="media"`. Cards that can be hidden by a filter do **not** get `data-reveal`.
- Off-limits: scroll hijacking, page-transition curtains, autoplaying media, custom cursors.
- Testing: in the embedded preview `requestAnimationFrame` may not run (0 fps). In development, `window.__gsap` / `window.__ST` are exposed so the ticker can be advanced by hand (`__gsap.ticker.tick()`). A blank screenshot is not a pass, and an invisible element is not a bug until you have read its computed style.

# 3D

Three.js is available for the first view (`hero.visual.kind = "three"`) and, if needed, inside a case study. It is optional; a 2D portfolio never loads it.

- **Lifecycle lives in `components/three/ThreeStage.tsx`; scenes only draw.** A scene is `scenes/<name>.ts` exporting a `SceneFactory` (`render / resize / dispose`), registered in the `scenes` map of `ThreeStage`.
- `three` is imported dynamically, so it downloads only on pages that render a stage.
- Colours come from the tokens (`palette.accent` etc. read from CSS variables). Do not hard-code colours in scenes.
- **Text stays HTML.** The canvas is decorative (`aria-hidden`); never render headings or copy into WebGL.
- Reduced motion → a single still frame. Offscreen or hidden tab → no rendering. DPR capped at 2. On unmount, all geometry/material/renderer resources are disposed and the context released.
- Without WebGL the stage renders nothing, and the `poster` (or the cross grid) remains. Never show a fake "loading 3D" state.
- Composition: keep the object clear of the headline (right side on desktop, top on mobile). The scene must read as a still image, because many visitors will only see one frame.
- Models go in `public/models/` and load with `three/addons` loaders from the same origin (CSP `connect-src 'self'` is enough). Keep each model small (glTF + Draco/Meshopt, ideally < 2 MB).
- Testing: in development, `window.__three.frame()` renders one frame by hand, then read it back with `gl.readPixels` (rAF can be 0 fps in the preview).

# Visual References

Record each reference as **Source / Extract / Reject**: where it came from, the rule you take from it, and what you deliberately do not take. References steer direction; they are never assets or templates to copy.

| Source | Extract | Reject |
| --- | --- | --- |
| <URL or screenshot in materials/03_references> | <e.g. "headings light and very large; one accent"> | <e.g. "their custom cursor"> |

# Assets & Imagery

- Work images: `src/assets/images/works/<slug>/` via **static import** (dimensions known → no layout shift; optimized by Next/Vercel; blur placeholder). `cover` = key visual, `01…` = outcome, `process-01…` = process. `npm run images -- <materials folder> <slug>` produces them.
- Profile: `src/assets/images/profile/`. Video: `public/media/` (H.264, `-movflags +faststart`, poster, `preload="metadata"`, **never autoplay with sound**). 3D models: `public/models/`.
- **Every file has a row in `docs/ASSET-SOURCES.md`** (source, processing, permission). Update it in the same commit as the asset.
- Export at ≤3200 px on the long edge, EXIF stripped, JPEG q90. Line art and UI screenshots stay PNG.
- Crops are driven by `focus` (object-position). Before trusting a crop, reproduce `object-fit: cover` at the real container ratio (e.g. with PIL).
- Concept images and in-progress screenshots are labelled as such. No play / download / buy buttons without a real target.
- Placeholders shipped with the starter: every image under `src/assets/images/`, `src/app/icon.svg`. Replace them all before launch (`npm run placeholders`).

# Do's and Don'ts

Do: keep copy in `src/content/` (all three languages at once), write real alt text for every content image, measure layouts, and keep one accent.

Don't: add colours, sizes, weights, radii or shadows that are not in this file; bold headings; put colour or grain on work images; show unconfirmed facts ("TBD", "coming soon"); add employers, clients or result numbers the source text does not contain; add a hamburger menu or a custom cursor.
