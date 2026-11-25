/* Restore the native theme before first paint; wire the control after parsing. */
(function () {
  const key = "namthedev-docs-theme";
  const meta = document.querySelector('meta[name="color-scheme"]');
  let theme = "dark";
  try { if (localStorage.getItem(key) === "light") theme = "light"; } catch {}
  function apply(next) {
    theme = next;
    document.documentElement.dataset.bsTheme = theme;
    meta.content = theme;
    const button = document.querySelector("#theme-toggle");
    if (button) {
      button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
      button.setAttribute("aria-pressed", String(theme === "light"));
    }
  }
  apply(theme);
  document.addEventListener("DOMContentLoaded", () => {
    apply(theme);
    document.querySelector("#theme-toggle").addEventListener("click", () => {
      apply(theme === "dark" ? "light" : "dark");
      try { localStorage.setItem(key, theme); } catch {}
    });
  });
})();
