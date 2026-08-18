import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("homepage exposes every package with an install command", () => {
  const packageNames = ["reminder", "corenote", "git-ingest", "gitfolio", "caffeinate", "dhamma-echo"];

  for (const name of packageNames) {
    assert.match(html, new RegExp('data-package="' + name + '"'));
    assert.match(html, new RegExp('data-copy-command="[^"]*' + name));
  }
});

test("homepage versions match the tap source files", () => {
  const sources = {
    reminder: readFileSource("Formula/reminder.rb"),
    corenote: readFileSource("Formula/corenote.rb"),
    "git-ingest": readFileSource("Casks/git-ingest.rb"),
    gitfolio: readFileSource("Casks/gitfolio.rb"),
    caffeinate: readFileSource("Casks/caffeinate.rb"),
    "dhamma-echo": readFileSource("Casks/dhamma-echo.rb")
  };

  for (const [name, source] of Object.entries(sources)) {
    const versionMatch = source.match(/version\s+["']([^"']+)["']/) || source.match(/releases\/download\/v([^/]+)/);
    assert.ok(versionMatch, "version missing for " + name);
    assert.match(html, new RegExp('data-package="' + name + '"[^>]*data-version="' + versionMatch[1] + '"'));
  }
});

test("copy controls are keyboard-accessible and resilient", () => {
  assert.doesNotMatch(html, /\bonclick\s*=/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /navigator\.clipboard/);
  assert.match(html, /catch\s*\(/);
  assert.match(html, /:focus-visible/);
});

test("homepage avoids the audited visual anti-patterns", () => {
  assert.doesNotMatch(html, /background-clip\s*:\s*text/i);
  assert.doesNotMatch(html, /cubic-bezier\([^)]*1\.56/);
  assert.doesNotMatch(html, /Space Grotesk|Syne/);
  assert.match(html, /prefers-reduced-motion/);
});

test("README describes both formulas and all four casks", () => {
  assert.match(readme, /corenote/);
  for (const name of ["reminder", "corenote", "git-ingest", "gitfolio", "caffeinate", "dhamma-echo"]) {
    assert.match(readme, new RegExp("\\b" + name + "\\b"));
  }
});

function readFileSource(path) {
  const source = readFileSync(new URL("../" + path, import.meta.url), "utf8");
  return source;
}
