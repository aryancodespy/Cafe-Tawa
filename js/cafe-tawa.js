/* Cafe Tawa — navigation, accessible menu tabs, automatic guest reviews */
(() => {
  "use strict";

  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  const closeNavigation = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (toggle && navigation) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      navigation.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open && window.innerWidth <= 820);
    });
    navigation.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNavigation));
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeNavigation(); });
    document.addEventListener("click", e => {
      if (!navigation.contains(e.target) && !toggle.contains(e.target)) closeNavigation();
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 1150) closeNavigation(); }, {passive: true});
  }

  const tablist = document.querySelector('[role="tablist"][data-menu-tabs]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));
    function setTab(index, focus = false) {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (panels[i]) panels[i].hidden = !active;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => setTab(i));
      tab.addEventListener("keydown", event => {
        let next;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (i + 1) % tabs.length;
        else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        setTab(next, true);
      });
    });
    setTab(0);
  }

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  document.querySelectorAll("[data-review-carousel]").forEach(carousel => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = [...(track?.querySelectorAll("[data-review-slide]") || [])];
    const dotsContainer = carousel.querySelector("[data-carousel-dots]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    if (!track || slides.length < 2 || !dotsContainer || !prev || !next) return;
    let current = 0, interval = null, pausedByPointer = false, pausedByFocus = false;
    const reduce = () => Boolean(reducedMotion?.matches);
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "review-carousel__dot";
      dot.setAttribute("aria-label", "Show review " + (i + 1));
      dot.addEventListener("click", () => go(i, true));
      dotsContainer.append(dot);
      return dot;
    });
    function show(index, manual = false) {
      current = (index + slides.length) % slides.length;
      track.style.transform = "translate3d(-" + (current * 100) + "%,0,0)";
      slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== current)));
      dots.forEach((dot, i) => {
        if (i === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (manual && status) status.textContent = "Review " + (current + 1) + " of " + slides.length;
    }
    function stop() {
      if (interval !== null) clearInterval(interval);
      interval = null;
    }
    function start() {
      stop();
      if (reduce() || pausedByPointer || pausedByFocus || document.hidden) return;
      interval = setInterval(() => show(current + 1), 5800);
    }
    function go(index, manual = false) {
      show(index, manual);
      start();
    }
    prev.addEventListener("click", () => go(current - 1, true));
    next.addEventListener("click", () => go(current + 1, true));
    carousel.addEventListener("mouseenter", () => { pausedByPointer = true; stop(); });
    carousel.addEventListener("mouseleave", () => { pausedByPointer = false; start(); });
    carousel.addEventListener("focusin", () => { pausedByFocus = true; stop(); });
    carousel.addEventListener("focusout", event => {
      if (!carousel.contains(event.relatedTarget)) {
        pausedByFocus = false;
        start();
      }
    });
    carousel.addEventListener("keydown", event => {
      if (event.target.closest("button")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); go(current - 1, true); }
      if (event.key === "ArrowRight") { event.preventDefault(); go(current + 1, true); }
    });
    document.addEventListener("visibilitychange", start);
    reducedMotion?.addEventListener?.("change", start);
    show(0);
    start();
  });

  document.querySelectorAll("[data-year]").forEach(node => {
    node.textContent = String(new Date().getFullYear());
  });
})();
