/* Manifest-driven Markdown documentation renderer. */
(function () {
  const article = document.querySelector("#article");
  const nav = document.querySelector("#page-nav");
  const filter = document.querySelector("#page-filter");
  const navigation = document.querySelector("#navigation");
  const root = new URL("./", location.href);
  const mobile = matchMedia("(max-width: 991.98px)");
  const main = document.querySelector("#main-content");
  const sidebar = document.querySelector("#sidebar");
  const workspace = document.querySelector("#workspace");
  const wide = matchMedia("(min-width: 1280px)");
  const outline = document.querySelector("#outline");
  const mobileToc = document.querySelector("#mobile-toc");
  const outlineLinks = document.querySelector("#outline-links");
  const mobileLinks = document.querySelector("#mobile-toc-links");
  const breadcrumbs = document.querySelector("#breadcrumbs");
  function updateOutline() {
    const hasSections = outlineLinks.childElementCount > 0;
    outline.hidden = !wide.matches || !hasSections;
    mobileToc.hidden = wide.matches || !hasSections;
  }
  wide.addEventListener("change", updateOutline);
  function updateLayout() {
    const desktop = !mobile.matches;
    for (const cls of ["dvh-100","overflow-hidden"]) document.body.classList.toggle(cls, desktop);
    workspace.classList.toggle("overflow-hidden", desktop);
    sidebar.classList.toggle("overflow-auto", desktop);
    sidebar.classList.toggle("border-end", desktop);
    sidebar.classList.toggle("border-bottom", !desktop);
    main.classList.toggle("overflow-auto", desktop);
    navigation.open = desktop;
  }
  mobile.addEventListener("change", updateLayout);
  updateLayout();
  const cache = new Map();
  let groups = [], pages = [], current = "", version = 0;
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
    const query = filter.value.trim().toLowerCase();
    nav.replaceChildren();
    for (const group of groups) {
      const matches = group.pages.filter(p => (group.group + " " + p.title).toLowerCase().includes(query));
      if (!matches.length) continue;
      const details = element("details", "pb-1");
      details.open = !!query || matches.some(p => p.slug === current) || group.group === "Documentation";
      details.append(element("summary", "fw-semibold text-break py-2 fg-2", group.group));
      const list = element("ul", "list-unstyled m-0 ms-2 ps-2");
      for (const page of matches) {
        const item = element("li");
        const active = page.slug === current;
        const a = element("a", "d-block text-decoration-none rounded-5 py-1 px-3 text-break " + (active ? "bg-2 fg-primary fw-semibold" : "fg-2"), page.title);
        a.href = pageUrl(page.slug);
        if (active) a.setAttribute("aria-current", "page");
        item.append(a); list.append(item);
      }
      details.append(list); nav.append(details);
    }
    if (!nav.childElementCount) nav.append(element("p", "fg-3 fs-sm", "No matching pages."));
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
    const used = new Set(["main-content","article","navigation","page-nav","page-filter","outline","mobile-toc","breadcrumbs","reading-column","outline-links","mobile-toc-links"]);
    const headings = Array.from(article.querySelectorAll("h2,h3,h4,h5,h6"));
    for (const heading of article.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
      const base = heading.textContent.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu,"").replace(/\s+/g,"-") || "section";
      let id = base, i = 2; while (used.has(id)) id = base + "-" + i++;
      used.add(id); heading.id = id;
      heading.classList.add("text-break", "fw-semibold", "mt-4", "mb-3");
      if (heading.tagName === "H1") { heading.classList.remove("mt-4"); heading.classList.add("fg-body","fs-2xl","mb-4"); }
      else if (heading.tagName === "H2") heading.classList.add("fs-xl","border-bottom","pb-2");
      else heading.classList.add("fs-lg");
    }
    for (const table of article.querySelectorAll("table")) {
      table.classList.add("table","table-bordered","fs-sm","align-middle");
      const wrapper = element("div","overflow-auto my-3");
      table.before(wrapper); wrapper.append(table);
    }
    for (const pre of article.querySelectorAll("pre")) pre.classList.add("bg-1","border","rounded-6","p-4","overflow-auto");
    for (const img of article.querySelectorAll("img")) { img.classList.add("img-fluid"); img.loading = "lazy"; }
    for (const quote of article.querySelectorAll("blockquote")) quote.classList.add("bg-1","border-start","p-3","rounded-5");
    outlineLinks.replaceChildren(); mobileLinks.replaceChildren();
    for (const heading of headings) {
      const a = element("a", "d-block text-decoration-none py-1 text-break fg-2" + (heading.tagName==="H2"?"":" ms-3"), heading.textContent);
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
    const page = pages.find(p => p.slug === slug) || pages[0];
    if (!page) return;
    const token = ++version; current = page.slug; renderNav();
    const group = groups.find(g=>g.pages.includes(page));
    breadcrumbs.replaceChildren();
    const home = element("a","text-decoration-none","Docs"); home.href=pageUrl("home");
    breadcrumbs.append(home);
    if(page.slug!=="home") breadcrumbs.append(document.createTextNode(" / "+group.group+" / "+page.title));
    outlineLinks.replaceChildren(); mobileLinks.replaceChildren(); updateOutline();
    article.replaceChildren(element("p","fg-3","Loading…"));
    try {
      const source = await markdown(page.file);
      if (token !== version) return;
      article.innerHTML = DOMPurify.sanitize(marked.parse(source,{gfm:true}));
      formatArticle(); internalLinks(page);
      document.title = page.title + " — " + groups.find(g => g.pages.includes(page)).group + " | NamTheDev docs";
      if (hash) {
        try { document.getElementById(decodeURIComponent(hash.replace(/^#/,"")))?.scrollIntoView(); } catch {}
      } else {
        main.scrollTop = 0;
        window.scrollTo(0,0);
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
    if (url.origin !== root.origin || url.pathname !== root.pathname || !url.searchParams.has("page") || !pages.some(p=>p.slug===url.searchParams.get("page"))) return;
    if (url.href===location.href) return;
    event.preventDefault(); history.pushState({}, "", url.href);
    if (mobile.matches) navigation.open = false;
    route();
  });
  filter.addEventListener("input",renderNav);
  addEventListener("popstate",route);
  fetch(new URL("manifest.json",root),{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("Manifest unavailable");return r.json()}).then(data=>{
    groups = data; pages = groups.flatMap(g=>g.pages); route();
  }).catch(error=>{
    article.replaceChildren(element("p","fg-danger","Unable to load documentation index."));
    console.error(error);
  });
})();
