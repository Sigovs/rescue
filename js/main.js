/* ============================================================
   SPORTS CAR RESCUE — MAIN
   ------------------------------------------------------------
   1. Partial loader  — fetches partials/*.html into placeholders
   2. Scroll reveal   — fades [data-reveal] in on enter
   3. Footer year     — stamps [data-year] with current year
   Loaded with <script type="module" src="js/main.js"> (defer-like).
   ============================================================ */

/* ---------- 1. PARTIAL LOADER ----------
   Markup:  <div data-partial="header"></div>
   Fetches partials/header.html and swaps it in.
   Runs over the network, so open via a local server (not file://). */
async function loadPartials() {
  const slots = document.querySelectorAll("[data-partial]");
  await Promise.all(
    [...slots].map(async (slot) => {
      const name = slot.dataset.partial;
      try {
        const res = await fetch(`partials/${name}.html`);
        if (!res.ok) throw new Error(`${res.status}`);
        slot.outerHTML = await res.text();
      } catch (err) {
        console.warn(`[partials] could not load "${name}":`, err.message);
      }
    })
  );
}

/* ---------- 2. SCROLL REVEAL ---------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- 3. FOOTER YEAR ---------- */
function stampYear() {
  const now = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = now;
  });
}

/* ---------- BOOT ---------- */
async function boot() {
  await loadPartials(); // inject header/footer first…
  initReveal();         // …then wire reveal over the full DOM
  stampYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
