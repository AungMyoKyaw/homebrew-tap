import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "/Users/aungmyokyaw/my-home/projects/life/homebrew-tap";
const META = JSON.parse(readFileSync(join(ROOT, "scripts/site-meta.json"), "utf8"));
const TAP = META.tap as string;
const REPO_URL = META.repoUrl as string;

const MACOS_VERSIONS: Record<string, string> = {
  big_sur: "macOS 11+",
  monterey: "macOS 12+",
  ventura: "macOS 13+",
  sonoma: "macOS 14+",
  sequoia: "macOS 15+",
};

interface ParsedPackage {
  id: string;
  kind: "cask" | "formula";
  name: string;
  version: string;
  desc: string;
  homepage: string;
  website?: string;
  license?: string;
  arch: string;
  macos: string;
  caveats?: string;
  notes?: string;
  keywords: string[];
  installCmd: string;
  docsPage?: string;
  tech?: string;
  lead?: string;
  examples?: { cmd: string; comment: string }[];
  capabilities?: string[];
  troubleshooting?: string;
}

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function loadSvg(name: string, adaptive = true): string {
  const path = join(ROOT, "design/icons", `${name}.svg`);
  if (!existsSync(path)) {
    return `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="4" width="24" height="24" rx="6" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  let svg = readFileSync(path, "utf8")
    .replace(/<\?xml[^>]*\?>\s*/i, "")
    .replace(/<title>.*?<\/title>\s*/i, "")
    .replace(/\s+xmlns:xlink="[^"]*"/i, "")
    .replace("<svg ", '<svg aria-hidden="true" ');

  if (adaptive) {
    svg = svg
      .replaceAll('stroke="#18181b"', 'stroke="currentColor"')
      .replaceAll('fill="#18181b"', 'fill="currentColor"')
      .replaceAll('fill="#d97706"', 'fill="var(--accent)"')
      .replaceAll('stroke="#d97706"', 'stroke="var(--accent)"');
  }
  return svg.trim();
}

function parseFormula(filePath: string): ParsedPackage {
  const src = readFileSync(filePath, "utf8");
  const id = basename(filePath, ".rb");
  const meta = META.packages[id] || {};
  const versionMatch =
    src.match(/version\s+["']([^"']+)["']/) ||
    src.match(/releases\/download\/v([^/]+)/);
  const descMatch = src.match(/desc\s+["']([^"']+)["']/);
  const homeMatch = src.match(/homepage\s+["']([^"']+)["']/);
  const licenseMatch = src.match(/license\s+["']([^"']+)["']/);

  return {
    id,
    kind: "formula",
    name: id,
    version: versionMatch ? versionMatch[1] : "0.0.0",
    desc: meta.summary || (descMatch ? descMatch[1] : ""),
    homepage: homeMatch ? homeMatch[1] : REPO_URL,
    license: licenseMatch ? licenseMatch[1] : meta.license || "MIT",
    arch: licenseMatch ? licenseMatch[1] : "MIT",
    macos: meta.tech || "macOS",
    keywords: meta.keywords || [],
    installCmd: `brew install ${TAP}/${id}`,
    docsPage: meta.docsPage,
    tech: meta.tech,
    lead: meta.lead,
    examples: meta.examples,
    capabilities: meta.capabilities,
    troubleshooting: meta.troubleshooting,
  };
}

function parseCask(filePath: string): ParsedPackage {
  const src = readFileSync(filePath, "utf8");
  const id = basename(filePath, ".rb");
  const meta = META.packages[id] || {};
  const versionMatch = src.match(/version\s+["']([^"']+)["']/);
  const nameMatch = src.match(/name\s+["']([^"']+)["']/);
  const descMatch = src.match(/desc\s+["']([^"']+)["']/);
  const homeMatch = src.match(/homepage\s+["']([^"']+)["']/);
  const caveatsMatch = src.match(/caveats\s+<<~EOS\n([\s\S]*?)\n\s*EOS/);

  let arch = "Universal";
  if (/arch\s+arm:.*intel:/m.test(src)) {
    arch = "arm64 · x64";
  } else if (/depends_on\s+arch:\s*:arm64/.test(src) || /aarch64|arm64/.test(src)) {
    arch = "arm64";
  }

  let macos = "macOS";
  const macosMatch = src.match(/depends_on\s+macos:\s*(?:["']>=\s*)?:([a-z_]+)/);
  if (macosMatch && MACOS_VERSIONS[macosMatch[1]]) {
    macos = MACOS_VERSIONS[macosMatch[1]];
  } else if (/macOS\s+13\.3/.test(src)) {
    macos = "macOS 13.3+";
  } else if (/macOS\s+11/.test(src)) {
    macos = "macOS 11+";
  }

  const caveats = caveatsMatch
    ? caveatsMatch[1]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n")
    : undefined;

  return {
    id,
    kind: "cask",
    name: nameMatch ? nameMatch[1] : id,
    version: versionMatch ? versionMatch[1] : "0.0.0",
    desc: meta.summary || (descMatch ? descMatch[1] : ""),
    homepage: homeMatch ? homeMatch[1] : REPO_URL,
    website: meta.website,
    license: meta.license,
    arch,
    macos,
    caveats,
    notes: meta.notes,
    keywords: meta.keywords || [],
    installCmd: `brew install --cask ${TAP}/${id}`,
  };
}

function sortByOrder<T extends { id: string }>(items: T[], order: string[]): T[] {
  return [...items].sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.id.localeCompare(b.id);
  });
}

const formulae = sortByOrder(
  readdirSync(join(ROOT, "Formula"))
    .filter((f) => f.endsWith(".rb"))
    .map((f) => parseFormula(join(ROOT, "Formula", f))),
  META.formulaOrder
);

const casks = sortByOrder(
  readdirSync(join(ROOT, "Casks"))
    .filter((f) => f.endsWith(".rb"))
    .map((f) => parseCask(join(ROOT, "Casks", f))),
  META.caskOrder
);

// Copy tap-mark.svg to repo root favicon.svg
writeFileSync(join(ROOT, "favicon.svg"), readFileSync(join(ROOT, "design/icons/tap-mark.svg"), "utf8"));

const tapMarkSvg = loadSvg("tap-mark", false);
const totalCount = casks.length + formulae.length;

function renderCaskCard(pkg: ParsedPackage): string {
  const searchTokens = [pkg.id, pkg.name, pkg.desc, pkg.arch, pkg.macos, ...pkg.keywords].join(" ");
  const detailText = pkg.caveats || pkg.notes;
  const primaryLink = pkg.website || pkg.homepage;
  const primaryLabel = pkg.website ? "Site ↗" : "GitHub ↗";

  return `        <article class="pkg-card" data-package="${escapeHtml(pkg.id)}" data-version="${escapeHtml(pkg.version)}" data-kind="cask" data-search="${escapeHtml(searchTokens)}">
          <div class="pkg-top">
            <div class="pkg-id">
              <div class="pkg-glyph">${loadSvg(pkg.id)}</div>
              <div class="pkg-title-block">
                <h3 class="pkg-name">${escapeHtml(pkg.name)}</h3>
                <div class="pkg-badges">
                  <span class="badge badge-ver">v${escapeHtml(pkg.version)}</span>
                  <span class="badge badge-meta">${escapeHtml(pkg.arch)} · ${escapeHtml(pkg.macos)}</span>
                  ${pkg.license ? `<span class="badge badge-meta">${escapeHtml(pkg.license)}</span>` : ""}
                </div>
              </div>
            </div>
            <div class="pkg-links">
              <a class="pkg-link" href="${escapeHtml(primaryLink)}" target="_blank" rel="noopener noreferrer">${primaryLabel}</a>
            </div>
          </div>
          <p class="pkg-desc">${escapeHtml(pkg.desc)}</p>
          <div class="cmd-bar">
            <code class="cmd-code"><span class="cmd-prompt">$</span><span>${escapeHtml(pkg.installCmd)}</span></code>
            <button type="button" class="copy-btn" data-copy-command="${escapeHtml(pkg.installCmd)}" aria-label="Copy install command for ${escapeHtml(pkg.name)}">Copy</button>
          </div>${
            detailText
              ? `
          <details class="pkg-details">
            <summary>Install &amp; signing notes</summary>
            <div class="pkg-details-body">${escapeHtml(detailText)}</div>
          </details>`
              : ""
          }
        </article>`;
}

function renderFormulaRow(pkg: ParsedPackage): string {
  const searchTokens = [pkg.id, pkg.name, pkg.desc, pkg.arch, pkg.macos, ...pkg.keywords].join(" ");
  return `        <article class="formula-row" data-package="${escapeHtml(pkg.id)}" data-version="${escapeHtml(pkg.version)}" data-kind="formula" data-search="${escapeHtml(searchTokens)}">
          <div class="formula-main">
            <div class="pkg-glyph">${loadSvg(pkg.id)}</div>
            <div class="pkg-title-block">
              <div class="formula-name-line">
                <h3 class="formula-name">${escapeHtml(pkg.name)}</h3>
                <span class="badge badge-ver">v${escapeHtml(pkg.version)}</span>
                <span class="badge badge-meta">${escapeHtml(pkg.arch)} · ${escapeHtml(pkg.macos)}</span>
              </div>
              <p class="pkg-desc">${escapeHtml(pkg.desc)}</p>
            </div>
          </div>
          <div class="cmd-bar formula-cmd">
            <code class="cmd-code"><span class="cmd-prompt">$</span><span>${escapeHtml(pkg.installCmd)}</span></code>
            <button type="button" class="copy-btn" data-copy-command="${escapeHtml(pkg.installCmd)}" aria-label="Copy install command for ${escapeHtml(pkg.name)}">Copy</button>
          </div>
          ${pkg.docsPage ? `<a class="docs-link" href="./${escapeHtml(pkg.docsPage)}">Docs →</a>` : `<a class="docs-link" href="${escapeHtml(pkg.homepage)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`}
        </article>`;
}

const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(TAP)} — macOS Homebrew Tap</title>
  <meta name="description" content="Personal Homebrew tap distributing ${casks.length} macOS desktop casks and ${formulae.length} CLI formulae. SHA256-pinned releases with one-click install commands.">
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="stylesheet" href="./styles/site.css">
</head>
<body>
  <header class="topbar">
    <div class="wrap topbar-inner">
      <a class="brand" href="./">
        <span class="brand-mark">${tapMarkSvg}</span>
        <span>AungMyoKyaw / homebrew-tap</span>
      </a>
      <nav class="nav" aria-label="Primary">
        <a href="#casks">Casks</a>
        <a href="#formulae">Formulae</a>
        <a href="#install">Install</a>
        <a href="${escapeHtml(REPO_URL)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <button type="button" id="theme-toggle" class="theme-btn" aria-label="Toggle color theme">◐ Dark</button>
      </nav>
    </div>
  </header>

  <main class="wrap">
    <section class="hero" id="install">
      <span class="eyebrow">Personal Homebrew Tap · macOS</span>
      <h1>Native macOS tools, installed via Homebrew.</h1>
      <p class="hero-sub">${casks.length} desktop casks and ${formulae.length} CLI formulae. SHA256-pinned releases, automatic quarantine cleanup, zero telemetry.</p>
      <div class="cmd-bar cmd-bar-lg">
        <code class="cmd-code"><span class="cmd-prompt">$</span><span>brew tap ${escapeHtml(TAP)}</span></code>
        <button type="button" class="copy-btn copy-btn-primary" data-copy-command="brew tap ${escapeHtml(TAP)}" aria-label="Copy brew tap command">Copy command</button>
      </div>
    </section>

    <div class="controls" role="region" aria-label="Filter packages">
      <div class="filter-group" role="group" aria-label="Package type filter">
        <button type="button" class="filter-pill" data-filter="all" aria-pressed="true">All (${totalCount})</button>
        <button type="button" class="filter-pill" data-filter="cask" aria-pressed="false">Casks (${casks.length})</button>
        <button type="button" class="filter-pill" data-filter="formula" aria-pressed="false">Formulae (${formulae.length})</button>
      </div>
      <div class="search-wrap">
        <label class="sr-only" for="package-search">Filter packages</label>
        <input id="package-search" class="search-input" type="search" placeholder="Filter packages by name or keyword..." autocomplete="off">
        <span class="search-kbd" aria-hidden="true">⌘K</span>
      </div>
    </div>

    <section class="catalog-section" id="casks" aria-labelledby="casks-heading">
      <div class="section-head">
        <h2 id="casks-heading">Desktop Apps — Casks</h2>
        <span class="section-meta">${casks.length} packages · brew install --cask</span>
      </div>
      <div class="cask-grid">
${casks.map(renderCaskCard).join("\n")}
      </div>
    </section>

    <section class="catalog-section" id="formulae" aria-labelledby="formulae-heading">
      <div class="section-head">
        <h2 id="formulae-heading">CLI Tools — Formulae</h2>
        <span class="section-meta">${formulae.length} packages · brew install</span>
      </div>
      <div class="formula-list">
${formulae.map(renderFormulaRow).join("\n")}
      </div>
    </section>

    <div id="empty-state" class="empty-state" hidden>
      No packages match your filter. Clear the search query or switch back to <strong>All</strong>.
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>Update All</h3>
          <p><code>brew update &amp;&amp; brew upgrade</code><br>Add <code>--cask</code> when upgrading desktop apps.</p>
        </div>
        <div class="footer-col">
          <h3>Signing &amp; Quarantine</h3>
          <p>All binaries are SHA256-pinned. Ad-hoc signed casks clear <code>com.apple.quarantine</code> automatically in postflight.</p>
        </div>
        <div class="footer-col">
          <h3>Uninstall &amp; Zap</h3>
          <p>Use <code>brew uninstall --cask --zap &lt;pkg&gt;</code> to remove local preferences and SQLite data.</p>
        </div>
      </div>
      <div class="footer-meta">
        <span>Maintained by <a href="https://github.com/AungMyoKyaw" target="_blank" rel="noopener noreferrer">@AungMyoKyaw</a> · Generated from Formula/*.rb &amp; Casks/*.rb</span>
        <span><a href="${escapeHtml(REPO_URL)}" target="_blank" rel="noopener noreferrer">Source repository ↗</a></span>
      </div>
    </div>
  </footer>

  <div id="copy-status" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  <script src="./scripts/site.js" defer></script>
</body>
</html>
`;

writeFileSync(join(ROOT, "index.html"), indexHtml);

function renderFormulaDetailPage(pkg: ParsedPackage): string {
  const examples = pkg.examples || [];
  const capabilities = pkg.capabilities || [];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pkg.name)} v${escapeHtml(pkg.version)} — ${escapeHtml(TAP)}</title>
  <meta name="description" content="${escapeHtml(pkg.lead || pkg.desc)}">
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="stylesheet" href="./styles/site.css">
</head>
<body>
  <header class="topbar">
    <div class="wrap-narrow topbar-inner">
      <div class="crumb">
        <a href="./">← homebrew-tap</a> / formulae / <strong>${escapeHtml(pkg.name)}</strong>
      </div>
      <nav class="nav" aria-label="Formula links">
        <a href="${escapeHtml(pkg.homepage)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <button type="button" id="theme-toggle" class="theme-btn" aria-label="Toggle color theme">◐ Dark</button>
      </nav>
    </div>
  </header>

  <main class="wrap-narrow" data-package="${escapeHtml(pkg.id)}" data-version="${escapeHtml(pkg.version)}">
    <div class="detail-header">
      <div class="pkg-glyph detail-glyph">${loadSvg(pkg.id)}</div>
      <h1 class="detail-title">${escapeHtml(pkg.name)}</h1>
      <span class="badge badge-ver">v${escapeHtml(pkg.version)}</span>
      <span class="badge badge-meta">${escapeHtml(pkg.license || "MIT")} · ${escapeHtml(pkg.tech || "macOS")}</span>
    </div>

    <p class="hero-sub">${escapeHtml(pkg.lead || pkg.desc)}</p>

    <div class="cmd-bar cmd-bar-lg">
      <code class="cmd-code"><span class="cmd-prompt">$</span><span>${escapeHtml(pkg.installCmd)}</span></code>
      <button type="button" class="copy-btn copy-btn-primary" data-copy-command="${escapeHtml(pkg.installCmd)}" aria-label="Copy install command for ${escapeHtml(pkg.name)}">Copy command</button>
    </div>

    <section class="catalog-section" style="margin-top: 32px;" aria-labelledby="quickstart-heading">
      <div class="section-head">
        <h2 id="quickstart-heading">Quick Start</h2>
        <span class="section-meta">macOS Terminal</span>
      </div>
      <div class="terminal-panel">
${examples
  .map(
    (ex) =>
      `        <div class="term-line"><span><span class="cmd-prompt">$</span> ${escapeHtml(ex.cmd)}</span><span class="term-comment"># ${escapeHtml(ex.comment)}</span></div>`
  )
  .join("\n")}
      </div>
    </section>

    <div class="detail-cards">
      <section class="detail-card">
        <h3>Capabilities</h3>
        <ul>
${capabilities.map((c) => `          <li>${escapeHtml(c)}</li>`).join("\n")}
        </ul>
      </section>
      <section class="detail-card">
        <h3>Permissions &amp; Troubleshooting</h3>
        <pre>${escapeHtml(pkg.troubleshooting || "")}</pre>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="wrap-narrow footer-meta">
      <span><a href="./">← Back to all ${totalCount} packages</a></span>
      <span><a href="${escapeHtml(pkg.homepage)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pkg.name)} repository ↗</a></span>
    </div>
  </footer>

  <div id="copy-status" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  <script src="./scripts/site.js" defer></script>
</body>
</html>
`;
}

for (const f of formulae) {
  if (f.docsPage) {
    writeFileSync(join(ROOT, f.docsPage), renderFormulaDetailPage(f));
  }
}

console.log(
  `Generated index.html (${casks.length} casks, ${formulae.length} formulae), ${formulae
    .map((f) => f.docsPage)
    .filter(Boolean)
    .join(", ")}, and favicon.svg`
);
