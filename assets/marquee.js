/* Continuously loop the existing header links without maintaining a second list. */
function initHeaderMarquee() {
  const nav = document.querySelector(".header-links");
  if (!nav || nav.querySelector(".marquee-track")) return;

  const track = document.createElement("div");
  track.className = "marquee-track d-flex align-items-center";
  const group = document.createElement("div");
  group.className = "marquee-group d-flex flex-shrink-0 align-items-center";
  while (nav.firstChild) group.append(nav.firstChild);

  const duplicate = group.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("a, button, [tabindex]").forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });

  track.append(group, duplicate);
  nav.append(track);
  nav.classList.add("marquee-enabled");

  // Native scroll keeps trackpad, touch and keyboard scrolling available.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hover = window.matchMedia("(hover: hover)");
  let loopWidth = 0, manualUntil = 0, activePointer = null;
  let previous = 0, remainder = 0, automaticPosition = nav.scrollLeft;
  const resumeDelay = 1500;
  const pauseManual = () => { manualUntil = performance.now() + resumeDelay; };
  const updateWidth = () => {
    loopWidth = Math.round(group.getBoundingClientRect().width);
    nav.classList.toggle("marquee-overflow", loopWidth > nav.clientWidth);
  };
  updateWidth();
  const observer = new ResizeObserver(updateWidth);
  observer.observe(group);
  observer.observe(nav);

  nav.addEventListener("pointerleave", event => {
    if (event.pointerType === "touch" || !hover.matches) return;
    // Resume immediately on mouse exit, even after manual scrolling.
    manualUntil = 0;
    automaticPosition = nav.scrollLeft;
  });
  nav.addEventListener("wheel", event => {
    if (event.ctrlKey || event.metaKey) return;
    // Capture wheel input over the ticker without scrolling the page.
    event.preventDefault();
    if (nav.scrollWidth <= nav.clientWidth ||
        !event.deltaX || Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
    pauseManual();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? nav.clientWidth : 1;
    nav.scrollLeft += event.deltaX * unit;
  }, { passive: false });
  nav.addEventListener("scroll", () => {
    // Native touch momentum and keyboard scrolling extend the manual pause.
    if (Math.abs(nav.scrollLeft - automaticPosition) > .5) pauseManual();
  }, { passive: true });
  nav.addEventListener("pointerdown", event => {
    activePointer = event.pointerId;
    pauseManual();
  });
  const releasePointer = event => {
    if (event.pointerId !== activePointer) return;
    activePointer = null;
    pauseManual();
  };
  window.addEventListener("pointerup", releasePointer);
  window.addEventListener("pointercancel", releasePointer);

  // Resume the same native scroll position after interaction; loop at one group.
  const advance = now => {
    const elapsed = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    const paused = reducedMotion.matches || loopWidth <= nav.clientWidth ||
      activePointer !== null || now < manualUntil || (hover.matches && nav.matches(":hover")) ||
      nav.querySelector(":focus-visible") !== null;
    if (!paused) {
      const distance = elapsed * .045 + remainder;
      const step = Math.floor(distance);
      remainder = distance - step;
      if (step) {
        nav.scrollLeft = (nav.scrollLeft + step) % loopWidth;
        automaticPosition = nav.scrollLeft;
      }
    } else remainder = 0;
    requestAnimationFrame(advance);
  };
  requestAnimationFrame(advance);
}

initHeaderMarquee();
