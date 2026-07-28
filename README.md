# Sports Car Rescue — website

A static marketing site for a private classic-/sports-car buyer. **Vanilla HTML /
CSS / JS — no build step, no framework, no dependencies.**

## Run it

Partials (header/footer) load over `fetch`, so it must be served over HTTP —
opening `index.html` from `file://` will leave the header/footer empty.

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000/
```

Any static server works (Live Server, `npx serve`, nginx, GitHub Pages, Netlify…).

## Structure

```
index.html          Single-page site (hero, What We Buy, About, Cars We Buy,
                    Lost Cars, Cars We've Rescued, Estate, Contact, Instagram)
car.html            Detail-page TEMPLATE for one rescued car (worked example:
                    1967 Porsche 911S) — hero, story, spec plate, gallery, CTA
css/
  tokens.css        Design system — single source of truth (colours, fonts,
                    spacing, radii, shadows). Never hard-code these; use var(--…).
  base.css          Reset, typography base, film-grain, .container, .btn, etc.
  <section>.css     One file per section/page (hero, buy, why, marques, lost,
                    rescued, contact, car, …). Linked after base in the <head>.
js/
  main.js           ES module: loads partials, scroll-reveal, nav drawer,
                    Lost-Cars "read more", subpage nav rewrite, footer year.
partials/
  header.html       Injected into <div data-partial="header">
  footer.html       Injected into <div data-partial="footer">
assets/img/         Images (hero, rescued, lost, marque logos, instagram, …)
```

Fonts load from Google Fonts (Oswald / Spectral / Special Elite / Shadows Into
Light Two). No other external requests.

## How the pages link

- The **Cars We've Rescued** grid on `index.html` links every card to
  `car.html` (the template). When real per-car pages exist, point each card's
  two links (`.rescued-card__media` and `.rescued-card__more`) at its own file.
- `car.html` is a subpage: it sets `<body data-subpage>`, and `js/main.js`
  rewrites the shared header/footer anchor links to `index.html#section` so nav
  travels back home. Duplicate `car.html` per car and change the content +
  the `<head>` SEO block (title, description, canonical, OG, JSON-LD).

## Still needs real data (placeholders in the markup)

- **Contact form** — `index.html`, `<form action="https://formspree.io/f/REPLACE_ME">`.
- **Instagram / social links** — several `href="#"` (footer social, IG band).
- **Per-car pages** — all rescued cards currently point at the one `car.html`
  template; `car.html`'s story, gallery and chassis number are sample content.
- Email is set to `sportscarrescue@gmail.com`; phone `904-874-4877`.

## Conventions

- **Tokens first** — reference `var(--…)` from `css/tokens.css`; no magic values.
- Add `data-reveal` to any element for scroll-reveal.
- `prefers-reduced-motion` is respected globally (base/motion).
- Keep new section CSS in its own `css/*.css` file, linked after `base.css`.
