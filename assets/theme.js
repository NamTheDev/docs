/* Native theme signal; the shared config defines both palettes. */
(function () {
  const key = "namthedev-docs-theme";
  const button = document.querySelector("#theme-toggle");
  const meta = document.querySelector('meta[name="color-scheme"]');
  let theme = "dark";
  try { if (localStorage.getItem(key) === "light") theme = "light"; } catch {}
  function apply(next) {
    theme = next;
    document.documentElement.dataset.bsTheme = theme;
    meta.content = theme;
    button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(theme === "light"));
  }
  apply(theme);
  button.addEventListener("click", () => {
    apply(theme === "dark" ? "light" : "dark");
    try { localStorage.setItem(key, theme); } catch {}
  });
})();
