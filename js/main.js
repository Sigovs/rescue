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
        const res = await fetch(`partials/${name}.html`, { cache: "no-cache" });
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

/* ---------- 5. INVENTORY CAROUSEL ----------
   Drag-to-scroll + side arrows + snap. Markup: [data-inv-viewport]. */
function initInventory() {
  document.querySelectorAll("[data-inv-viewport]").forEach((vp) => {
    const shell = vp.closest(".inv__carousel");
    const prev = shell?.querySelector(".inv__arrow--prev");
    const next = shell?.querySelector(".inv__arrow--next");
    const track = vp.querySelector(".inv__track");

    const step = () => {
      const card = vp.querySelector(".inv-card");
      const gap = track ? parseFloat(getComputedStyle(track).columnGap) || 0 : 0;
      return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
    };

    const update = () => {
      if (!prev || !next) return;
      prev.disabled = vp.scrollLeft <= 2;
      next.disabled = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2;
    };

    next?.addEventListener("click", () => vp.scrollBy({ left: step(), behavior: "smooth" }));
    prev?.addEventListener("click", () => vp.scrollBy({ left: -step(), behavior: "smooth" }));
    vp.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    /* drag to scroll (mouse / pen); native touch scroll handles touch */
    let down = false, startX = 0, startLeft = 0, moved = false;
    vp.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      down = true; moved = false;
      startX = e.clientX; startLeft = vp.scrollLeft;
      vp.classList.add("is-dragging");
      vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      vp.classList.remove("is-dragging");
      update();
    };
    vp.addEventListener("pointerup", end);
    vp.addEventListener("pointercancel", end);
    /* swallow the click that follows a real drag so cards don't navigate */
    vp.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

/* ---------- 6. DRAG-SCROLL (generic) ----------
   Pointer drag-to-scroll any horizontal strip: [data-drag-scroll]. */
function initDragScroll() {
  document.querySelectorAll("[data-drag-scroll]").forEach((el) => {
    let down = false, startX = 0, startLeft = 0, moved = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return;
      down = true; moved = false;
      startX = e.clientX; startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startLeft - dx;
    });
    const end = () => { if (!down) return; down = false; el.classList.remove("is-dragging"); };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

/* ---------- BOOT ---------- */
async function boot() {
  await loadPartials(); // inject header/footer first…
  initNav();            // wire the slide-in menu (needs injected header)
  initReveal();         // …then wire reveal over the full DOM
  initInventory();      // inventory carousel drag + arrows
  initDragScroll();     // generic drag strips (Instagram feed)
  stampYear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
