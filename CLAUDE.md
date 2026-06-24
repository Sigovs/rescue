# Sports Car Rescue

A static marketing/portfolio site for a barn-find classic-car rescuer.
Vanilla **HTML / CSS / JS — no build step, no framework.**

---

## ⛔ DESIGN DIRECTION — read before touching any markup or CSS

This site must feel like a **collector's field journal / automotive archive /
barn-find investigation notebook** — curated by a lifelong car collector,
NOT designed by a software company. Theme word: **"automotive archaeology."**

**Emotional goal:** the visitor feels they're speaking with a passionate
collector who rescues automotive history.

### Do NOT use (hard bans)
- Default LLM / "Claude" design language
- SaaS or startup landing-page layouts
- Centered marketing pages, centered hero + two-button CTA
- Rounded modern UI, clean tech-company look, agency templates
- Generic "website sections", symmetrical layouts
- Anything that reads as a "modern dealership website"

### DO use
- Asymmetrical composition; imperfect, intentionally off spacing
- Layered, overlapping imagery (polaroids, documents, badges, tags)
- Paper textures, aged documents, handwritten notes, film grain
- Visual storytelling — every section = part of an ongoing search for
  forgotten collector cars
- Card grids ARE allowed when they serve a comprehensive "lists everyone"
  catalogue (à la the client-liked Gullwing sell page) — but style them
  archival (paper, tags, typewriter labels), never as SaaS/dealer tiles

**Inspiration:** editorial magazine spreads, museum exhibits, archival
photography, collector notebooks, old vehicle title documents, automotive
memorabilia.

> Before building a section, ask: *"Does this look like a curator's archive
> page, or a SaaS landing?"* If the latter — redo it.

### Tie-breaker
If a design decision feels **"cleaner" or "more modern", reject it** and
choose the more **authentic, collector-focused** solution instead. When in
doubt, lean toward rougher, more hand-made, more archival.

---

## Structure

```
index.html          # loads tokens.css → base.css; partial slots + sections
css/
  tokens.css        # design system — single source of truth (colors, fonts,
                    # spacing, --tilt-*, shadows). Never hard-code these.
  base.css          # reset, typography, film-grain overlay, .container,
                    # .section, .btn, .polaroid, [data-reveal]
js/
  main.js           # ES module: loads partials, scroll-reveal, footer year
partials/
  header.html       # injected into <div data-partial="header">
  footer.html       # injected into <div data-partial="footer">
assets/img/refs/    # mood/reference images + brief (sports car rescue.pdf)
docs/               # (empty)
```

## Conventions
- **Tokens first.** Never hard-code a color, font, space, radius or shadow in
  a section — reference a `var(--…)` from `css/tokens.css`.
- **Partials load via `fetch`**, so preview over a local server, not `file://`:
  `python3 -m http.server 8123` → http://localhost:8123/
- Reveal-on-scroll: add `data-reveal` to any element.
- Respect `prefers-reduced-motion` (tokens + base already zero out motion/tilt).
- Keep new section CSS in its own file under `css/` and link it after `base.css`.
