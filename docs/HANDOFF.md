# Sports Car Rescue — Project Handoff & Working Log

> Read this first when reopening the project. It captures the full state,
> every decision made, and what to do next — so work continues without
> losing the thread. (CLAUDE.md holds the binding rules; this is the story.)

Last updated: 2026-06-19. Repo: https://github.com/Sigovs/rescue

---

## 1. What this is
A static marketing/portfolio site (vanilla HTML/CSS/JS, **no build step**) for
**Sports Car Rescue** — a barn-find classic-car buyer/rescuer. The client buys
collector cars, project cars, barn finds and vintage parts, sells restored
ones, and helps with estates/collections.

## 2. ART DIRECTION (non-negotiable — see CLAUDE.md)
Must feel like a **collector's field journal / automotive archive / barn-find
investigation notebook** — "automotive archaeology." NOT SaaS, NOT a startup
landing, NOT an agency template, NOT a modern dealership site.

- Use: asymmetry, layered/overlapping imagery, paper textures, aged documents,
  handwritten notes, imperfect spacing, visual storytelling.
- Ban: centered marketing hero + 2-button CTA as a *generic* pattern, feature
  cards, symmetric 3-up grids, rounded modern UI, clean tech-company look.
- **Tie-breaker:** if a choice feels "cleaner / more modern," REJECT it and pick
  the more authentic, collector-focused option. When unsure, lean rougher.

## 3. Stack & file structure
```
index.html              # the page (currently: hero + 8 stub section anchors)
CLAUDE.md               # binding rules (art direction + conventions)
css/  (load order matters; same order in index.html & styleguide)
  tokens.css            # SINGLE SOURCE OF TRUTH — colors, fonts, type ramp,
                        # spacing, grid/elevation/layer tokens, --header-h
  base.css              # reset, page chrome (aged-paper + film grain), defaults
  typography.css        # named .type-* classes (strict descending ramp)
  grid.css              # 12 / 8 / 4 grid (.container/.grid/.col-span-*)
  components.css        # buttons (3 only), image-layer system, site header/footer,
                        # slide-in menu drawer
  layouts.css           # section templates (.tmpl-hero/-split/-editorial/
                        # -collection/-cta/-contact)
  hero.css              # hero-specific composition (loaded last)
js/main.js              # ES module: loads partials, slide-in nav, scroll-reveal,
                        # footer year
partials/header.html    # header bar + slide-in menu drawer (injected via fetch)
partials/footer.html    # footer (injected via fetch)
docs/styleguide.html    # living design-system page (review fonts/spacing/buttons)
docs/HANDOFF.md         # this file
assets/img/hero/        # collage PNGs (user-supplied, transparent)
assets/img/bg/          # generated background textures
assets/img/refs/        # mood refs + brief PDF
```
**Run locally (partials load via fetch — needs a server, not file://):**
`cd "Sports Car Rescue " && python3 -m http.server 8123` -> http://localhost:8123/

## 4. Design system (built & documented — see docs/styleguide.html)
Rule: sections use ONLY the system. No new typography, spacing, buttons, or
layout patterns — reuse. The styleguide is the one page to review it all.

- **Fonts** (change in tokens.css `--font-*`, whole site follows):
  - `--font-display` Oswald (headlines/signage, uppercase)
  - `--font-script` **Shadows Into Light Two** (handwritten captions; 400 only)
  - `--font-doc` Special Elite (typewriter eyebrows/labels/buttons)
  - `--font-body` Spectral (serif body)
- **Type ramp** (strict descending, desktop max px): display-xl 96 · display-lg 76
  · display-md 60 · h1 52 · h2 40 · h3 30 · h4 24 · lead 22 · body-lg 19 ·
  body 18 · body-sm 15 · caption 13 · eyebrow 12. Classes: `.type-display-xl` …
  `.type-eyebrow`, `.type-script`, `.type-button`.
- **Spacing** scale (px): 4 8 12 16 24 32 48 64 96 128 (`--space-1`…`--space-10`).
  Section vertical rhythm stays 64–128; never off-scale.
- **Grid:** 12 desktop / 8 tablet (<=1024) / 4 mobile (<=640). Content stays
  grid-aligned; only collage imagery breaks the grid on purpose.
- **Buttons — exactly THREE, do not add more:** `.btn--primary`,
  `.btn--secondary`, `.btn-link`. Height 52px, typewriter label, hover lift /
  focus ring / active press.
- **Color (semantic vars):** `--paper --paper-light --paper-raised --paper-dark
  --ink --ink-soft --accent (rust) --accent-hover --accent-2 (brass) --border
  --shadow`. Never hard-code colors. Added per user: `--accent-3` = sage/patina
  **#6E715D**, `--surface-stone` = warm taupe **#5D544B**.
- **Image-layer system:** `.polaroid .document .tag .speedo .badge .tape`, plus
  `.is-interactive` hover lift. Built to later become interactive/slide-in
  "buttons." Consistent elevation tokens (`--elev-flat/-raised/-photo`,
  `--layer-1/-2/-3/-tape`).

## 5. HERO — current state (APPROVED "premium look", don't regress)
Left: content on aged paper — eyebrow "We find value where others see junk." ->
display-xl "Before you sell it, scrap it, or clean it out," + script
"let's talk." -> rule -> body -> buttons (Primary "Tell us what you found" /
Secondary "See cars we've rescued").
Right: collage stage (`.hero__stage`) layered:
- **3 polaroids** fanned generously — `--1` back-left (-8deg), `--2` back-right (6deg),
  `--3` front-centre largest (-2deg). Tape + captions are baked into the PNGs.
- **Certificate** (`title.png`) top-right, rotate -6deg, behind, bleeds off-right,
  **STATIC (no hover)**, **no shadow** (user removed it).
- **Speedometer** (`speedometr.png`) top-right edge, aggressive "sitting on a
  desk" multi-layer shadow.
- **Parts tag** (`partstag.png`) lower-right at certificate z-level (behind
  photos), pushed right (`right:-10%`) so it pokes out.
- **Background:** `assets/img/bg/hero-paper.png` (generated aged-paper texture),
  full-bleed cover on the hero.

Behaviors:
- **Polaroids hover** = smooth 520ms ease-out lift (translateY -14px), slight
  straighten, scale 1.04, deeper shadow, and jump to front (`z-index:layer-tape`).
  Pleasant "picking up the photo" feel.
- Certificate: no hover. Speedometer & tag: hover lift.
- **Fold:** whole hero fits in the first screen — `.hero` min-height
  `calc(100svh - var(--header-h))`, content vertically centred, air at bottom.
  Collage sized so it fits common laptop heights (verified 1366x768 & taller).

Sizing that makes it premium (DON'T shrink to vh again): `.hero__poly` width
`clamp(15rem,22vw,23rem)`, `--3` `clamp(17rem,25vw,26rem)`, stage min-height
`clamp(26rem,38vw,40rem)`.

## 6. Navigation (built, works locally)
Brief mandates **8 sections** (use exact client wording):
Home · Cars We Are Looking For · Cars We Buy · Cars We've Purchased ·
Vehicles For Sale · Estate & Collection Assistance · About Us · Contact Us.
Slugs: `#home #cars-were-looking-for #cars-we-buy #cars-weve-purchased
#vehicles-for-sale #estate-collection-assistance #about-us #contact-us`.

**Hybrid nav:** header bar shows a few inline links (Cars We Buy · Vehicles For
Sale · Purchased · Contact) + CTA + hamburger. Hamburger opens a **slide-in
drawer from the right** (`.site-menu`) — a numbered archival index of all 8.
Closes via close-button / backdrop / Esc. Inline nav hides <1180px; CTA hides
<760px. JS: `initNav()` in js/main.js (runs after partials inject).

## 7. Mobile (PARKED — don't touch until asked)
Agreed plan, not yet implemented: hero on mobile = ONE static photo
(polaroid #3), no fan, no interactivity; hide the other polaroids and any
interactive collage objects. Current behavior: collage stacks below the text
(no overlap) — acceptable for now.

## 8. Assets — conventions
User prepares collage PNGs (transparent background). Files in `assets/img/hero/`.
Clean filenames (no spaces / no `#`). Verified transparent via canvas alpha
check when in doubt. Backgrounds generated via fal-ai and saved to
`assets/img/bg/`. Still expected from user: a wooden texture for the right zone
(optional), badge "327" PNG.

## 9. NEXT STEPS
1. (optional) Add **badge "327"** PNG to finish the hero collage.
2. Build the **8 sections** for real, using the layout templates + image-layer
   system, in the archival style. Suggested order: start with the business core
   — "Cars We Buy" or "Cars We Are Looking For" — then "Cars We've Purchased" as
   a `.tmpl-collection` gallery wall.
3. Implement the parked **mobile hero** when ready.
4. Decide: keep Primary button rust (current system) vs the dark-green seen in
   the reference mock (flagged, deferred).

## 10. Decisions log (quick reference)
- Design system built BEFORE sections; documented in styleguide.
- Strict descending type ramp (fixed an earlier inversion where H1 > display).
- Exactly 3 button styles; no Primary-Dark/Hero-Primary/etc.
- Script font switched Caveat -> Shadows Into Light Two.
- Palette additions: sage #6E715D, stone #5D544B.
- Hero must fit above the fold with bottom air; collage kept generous (not vh-shrunk).
- Certificate static + shadowless; speedometer heavy desk shadow; tag behind photos poking right.
- Polaroid hover made smooth/pleasant.
- Nav = hybrid inline + right slide-in drawer with full 8-section index.
