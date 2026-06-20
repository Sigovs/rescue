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

/* ---------- 3. SLIDE-IN MENU DRAWER ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");
  if (!toggle || !menu) return;

  const panel = menu.querySelector(".site-menu__panel");
  const closeBtn = menu.querySelector(".site-menu__close");

  const open = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  };
  const close = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggle.focus();
  };

  toggle.addEventListener("click", () =>
    menu.classList.contains("is-open") ? close() : open()
  );
  if (closeBtn) closeBtn.addEventListener("click", close);

  // click on backdrop (anything outside the panel) closes
  menu.addEventListener("click", (e) => {
    if (!panel.contains(e.target)) close();
  });
  // any index link closes the drawer (same-page anchors)
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  // Escape closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) close();
  });
}

/* ---------- 4. FOOTER YEAR ---------- */
function stampYear() {
  const now = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = now;
  });
}

/* ---------- BOOT ---------- */
async function boot() {
  await loadPartials(); // inject header/footer first…
  initNav();            // wire the slide-in menu (needs injected header)
  initReveal();         // …then wire reveal over the full DOM
  stampYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
