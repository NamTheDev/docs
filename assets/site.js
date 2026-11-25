/* Manifest-driven Markdown documentation renderer. */
(function () {
  const article = document.querySelector("#article");
  const nav = document.querySelector("#page-nav");
  const root = new URL("./", location.href);
  const mobile = matchMedia("(max-width: 760px)");
  const main = document.querySelector("#main-content");
  const sidebar = document.querySelector("#sidebar");
  const wide = matchMedia("(min-width: 1181px)");
  const outline = document.querySelector("#outline");
  const mobileToc = document.querySelector("#mobile-toc");
  const outlineLinks = document.querySelector("#outline-links");
  const mobileLinks = document.querySelector("#mobile-toc-links");
  const menu = document.querySelector("#menu-toggle");
  const backdrop = document.querySelector("#sidebar-backdrop");
  let drawerOpen = false;
  function setDrawer(open, restoreFocus = false) {
    drawerOpen = mobile.matches && open;
    sidebar.classList.toggle("drawer-open", drawerOpen);
    backdrop.hidden = !drawerOpen;
    menu.setAttribute("aria-expanded", String(drawerOpen));
    if (drawerOpen) (nav.querySelector('[aria-current="page"]') || nav.querySelector("a"))?.focus();
    else if (restoreFocus && mobile.matches) menu.focus();
  }
  menu.addEventListener("click",()=>setDrawer(!drawerOpen,true));
  backdrop.addEventListener("click",()=>setDrawer(false,true));
  document.addEventListener("keydown",event=>{if(event.key==="Escape" && drawerOpen){event.preventDefault();setDrawer(false,true);}});
  function updateOutline() {
    const hasSections = outlineLinks.childElementCount > 0;
    outline.hidden = !wide.matches;
    outline.classList.toggle("invisible", !hasSections);
    mobileToc.hidden = wide.matches || !hasSections;
  }
  wide.addEventListener("change", updateOutline);
  function updateLayout() {
    menu.hidden = !mobile.matches;
    setDrawer(false);
    updateOutline();
  }
  mobile.addEventListener("change", updateLayout);
  updateLayout();
  const cache = new Map();
  let pages = [], current = "", version = 0;
  const element = (tag, classes, text) => {
    const node = document.createElement(tag);
    if (classes) node.className = classes;
    if (text != null) node.textContent = text;
    return node;
  };
  function pageUrl(slug, hash = "") {
    const url = new URL(root);
    url.searchParams.set("page", slug);
    url.hash = hash;
    return url.href;
  }
  function renderNav() {
    nav.replaceChildren();
    for (const page of pages) {
      const active = page.slug === current;
      const a = element("a", "page-link d-block text-decoration-none py-2 px-2 text-break fs-sm lh-sm fg-2"+(active?" fw-semibold":""), page.title);
      a.href = pageUrl(page.slug);
      if (active) a.setAttribute("aria-current", "page");
      nav.append(a);
    }
  }
  function resolvePage(slug) {
    return pages.find(p => p.slug === slug) || pages.find(p => Object.hasOwn(p.aliases || {},slug));
  }
  function internalLinks(page) {
    const source = new URL(page.file, root);
    for (const link of article.querySelectorAll("a[href]")) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
      const url = new URL(href, source);
      const target = pages.find(p => new URL(p.file, root).pathname === url.pathname);
      if (url.origin === root.origin && target) link.href = pageUrl(target.slug, url.hash);
      else link.href = url.href;
    }
  }
  function formatArticle() {
    const used = new Set(Array.from(document.querySelectorAll("[id]")).filter(node=>!article.contains(node)||node===article).map(node=>node.id));
    const headings = Array.from(article.querySelectorAll("h2,h3,h4,h5,h6"));
    for (const heading of article.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const base = heading.textContent.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu,"").replace(/\s+/g,"-") || "section";
      let id = base, i = 2; while (used.has(id)) id = base + "-" + i++;
      used.add(id); heading.id = id;
      heading.classList.add("text-break","fw-semibold","lh-sm");
      if (heading.tagName === "H1" || heading.tagName === "H2") heading.classList.add("border-bottom","pb-2");
    }
    for (const p of article.querySelectorAll("p")) p.classList.add("mb-4");
    for (const table of article.querySelectorAll("table")) {
      table.classList.add("table","table-bordered","fs-sm","align-middle");
      const wrapper = element("div","overflow-auto my-3");
      table.before(wrapper); wrapper.append(table);
    }
    for (const pre of article.querySelectorAll("pre")) pre.classList.add("bg-1","border","p-3","overflow-auto");
    for (const img of article.querySelectorAll("img")) { img.classList.add("img-fluid"); img.loading = "lazy"; }
    for (const quote of article.querySelectorAll("blockquote")) quote.classList.add("bg-1","border-start","p-3");
    outlineLinks.replaceChildren(); mobileLinks.replaceChildren();
    for (const heading of headings) {
      const a = element("a", "d-block text-decoration-none py-1 text-break fg-2 fs-sm" + (heading.tagName==="H2"?"":" ms-3"), heading.textContent);
      a.href = "#" + heading.id;
      outlineLinks.append(a); mobileLinks.append(a.cloneNode(true));
    }
    mobileToc.open = false;
    updateOutline();
  }
  async function markdown(file) {
    if (!cache.has(file)) {
      const response = await fetch(new URL(file,root),{cache:"no-cache"});
      if (!response.ok || (response.headers.get("content-type")||"").includes("text/html")) throw Error("Markdown unavailable");
      cache.set(file, await response.text());
    }
    return cache.get(file);
  }
  async function load(slug, hash = "") {
    const page = resolvePage(slug) || pages[0];
    const alias = page?.aliases?.[slug];
    if (alias) {
      // Preserve legacy page URLs by redirecting to the matching section.
      hash = hash || "#"+alias;
      history.replaceState({}, "", pageUrl(page.slug,hash));
    }
    if (!page) return;
    const token = ++version; current = page.slug; renderNav();
    outlineLinks.replaceChildren(); mobileLinks.replaceChildren(); updateOutline();
    article.replaceChildren(element("p","fg-3","Loading…"));
    try {
      const source = await markdown(page.file);
      if (token !== version) return;
      article.innerHTML = DOMPurify.sanitize(marked.parse(source,{gfm:true}));
      formatArticle(); internalLinks(page);
      document.title = page.title + " | NamTheDev docs";
      if (hash) {
        try { (document.getElementById(decodeURIComponent(hash.replace(/^#/,""))) || (alias && document.getElementById(alias)))?.scrollIntoView(); } catch {}
      } else {
        main.scrollTop = 0;
      }
    } catch (err) {
      if (token !== version) return;
      const message = element("p","fg-danger","Unable to load this document. ");
      const a = element("a",null,"Read on GitHub"); a.href = "https://github.com/NamTheDev/docs/blob/main/" + page.file;
      message.append(a); article.replaceChildren(message); console.error(err);
    }
  }
  function route() {
    const url = new URL(location.href);
    load(url.searchParams.get("page") || "home", url.hash);
  }
  document.addEventListener("click",event => {
    const a = event.target.closest("a[href]");
    if (!a || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || a.target) return;
    const url = new URL(a.href);
    if (url.origin !== root.origin || url.pathname !== root.pathname || !url.searchParams.has("page") || !resolvePage(url.searchParams.get("page"))) return;
    if (url.href===location.href) return;
    event.preventDefault(); history.pushState({}, "", url.href);
    if (mobile.matches) setDrawer(false);
    route();
  });
  addEventListener("popstate",route);
  fetch(new URL("manifest.json",root),{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("Manifest unavailable");return r.json()}).then(data=>{
    pages = data; route();
  }).catch(error=>{
    article.replaceChildren(element("p","fg-danger","Unable to load documentation index."));
    console.error(error);
  });
})();
