(() => {
  const root = document.documentElement;
  const statusEl = document.getElementById("copy-status");
  const themeBtn = document.getElementById("theme-toggle");

  // Theme management
  const STORAGE_KEY = "homebrew-tap-theme";
  function currentTheme() {
    const explicit = root.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme, persist = false) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // ignore storage errors
      }
    }
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀ Light" : "◐ Dark";
      themeBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    }
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") applyTheme(saved, false);
    else applyTheme(currentTheme(), false);
  } catch {
    applyTheme(currentTheme(), false);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  // Clipboard copy with resilient fallback
  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fall through to textarea fallback
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  document.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-copy-command]");
    if (!btn) return;
    const command = btn.getAttribute("data-copy-command");
    if (!command) return;

    const ok = await copyText(command);
    const original = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", original);

    if (ok) {
      btn.setAttribute("data-copied", "true");
      btn.textContent = "Copied ✓";
      if (statusEl) statusEl.textContent = `Copied: ${command}`;
    } else {
      btn.textContent = "Failed";
      if (statusEl) statusEl.textContent = "Unable to copy command to clipboard.";
    }

    clearTimeout(btn._copyTimer);
    btn._copyTimer = setTimeout(() => {
      btn.removeAttribute("data-copied");
      btn.textContent = original;
    }, 1800);
  });

  // Catalog filter & instant search (index.html only)
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const searchInput = document.getElementById("package-search");
  const packageCards = Array.from(document.querySelectorAll("[data-package]"));
  const caskSection = document.getElementById("casks");
  const formulaSection = document.getElementById("formulae");
  const emptyState = document.getElementById("empty-state");

  let activeFilter = "all";

  function applyFilter() {
    if (!packageCards.length) return;
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let visibleCasks = 0;
    let visibleFormulae = 0;

    for (const el of packageCards) {
      const kind = el.getAttribute("data-kind");
      const hay = (el.getAttribute("data-search") || "").toLowerCase();
      const matchesKind = activeFilter === "all" || activeFilter === kind;
      const matchesQuery = !query || hay.includes(query);
      const show = matchesKind && matchesQuery;
      el.hidden = !show;
      if (show) {
        if (kind === "cask") visibleCasks++;
        else visibleFormulae++;
      }
    }

    if (caskSection) caskSection.hidden = visibleCasks === 0;
    if (formulaSection) formulaSection.hidden = visibleFormulae === 0;
    if (emptyState) emptyState.hidden = visibleCasks + visibleFormulae > 0;
  }

  for (const btn of filterButtons) {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "all";
      for (const other of filterButtons) {
        other.setAttribute("aria-pressed", String(other === btn));
      }
      applyFilter();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (event.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        searchInput.blur();
        applyFilter();
      }
    });
  }
})();
