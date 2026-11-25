/* Native-scroll marquee; enough repeated groups to loop at any viewport width. */
(() => {
  const nav = document.querySelector(".header-links");
  if (!nav || nav.querySelector(".marquee-track")) return;

  const track = document.createElement("div");
  track.className = "marquee-track d-flex align-items-center flex-shrink-0";
  const group = document.createElement("div");
  group.className = "marquee-group d-flex align-items-center flex-shrink-0 gap-5 pe-5";
  while (nav.firstChild) group.append(nav.firstChild);
  track.append(group);
  nav.append(track);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const hover = matchMedia("(hover: hover)");
  let cycle = 0, pauseUntil = 0, pointer = null;
  let previous = 0, remainder = 0, expected = 0;
  const pause = () => { pauseUntil = performance.now() + 1500; };
  const setScroll = value => {
    nav.scrollLeft = value;
    expected = nav.scrollLeft;
  };

  function measure() {
    cycle = Math.round(group.getBoundingClientRect().width);
    if (cycle < 1 || !nav.clientWidth) return;
    // Keep at least one full cycle of scroll range even if the first group
    // is shorter than the viewport. Only the original is keyboard focusable.
    const count = Math.max(2, Math.ceil(nav.clientWidth / cycle) + 1);
    while (track.childElementCount < count) {
      const copy = group.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.querySelectorAll("a, button, [tabindex]").forEach(el=>el.tabIndex=-1);
      track.append(copy);
    }
    while (track.childElementCount > count) track.lastElementChild.remove();
    nav.classList.toggle("marquee-overflow", !reduced.matches || cycle > nav.clientWidth);
    if (!reduced.matches && nav.scrollLeft >= cycle) setScroll(nav.scrollLeft % cycle);
  }
  const observer = new ResizeObserver(measure);
  observer.observe(group);
  observer.observe(nav);
  reduced.addEventListener("change", measure);
  measure();

  nav.addEventListener("pointerleave", event => {
    if (event.pointerType !== "touch" && hover.matches) {
      pauseUntil = 0;
      expected = nav.scrollLeft;
    }
  });
  nav.addEventListener("wheel", event => {
    if (event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    if (!event.deltaX || Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;
    pause();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? nav.clientWidth : 1;
    setScroll(nav.scrollLeft + event.deltaX * unit);
  }, {passive:false});
  nav.addEventListener("scroll", () => {
    if (Math.abs(nav.scrollLeft - expected) > .5) pause();
  }, {passive:true});
  nav.addEventListener("pointerdown", event=>{pointer=event.pointerId; pause();});
  const release = event => {
    if (event.pointerId === pointer) {pointer=null; pause();}
  };
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);

  function advance(now) {
    const elapsed = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    const paused = reduced.matches || cycle < 1 || !nav.clientWidth ||
      pointer !== null || now < pauseUntil || (hover.matches && nav.matches(":hover")) ||
      nav.querySelector(":focus-visible") !== null;
    if (paused) remainder=0;
    else {
      const distance = elapsed * .045 + remainder;
      const step = Math.floor(distance);
      remainder = distance - step;
      if (step) setScroll((nav.scrollLeft + step) % cycle);
    }
    requestAnimationFrame(advance);
  }
  requestAnimationFrame(advance);
})();
