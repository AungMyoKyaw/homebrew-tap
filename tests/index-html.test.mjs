import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import test from "node:test";

const rootDir = new URL("../", import.meta.url);
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles/site.css", import.meta.url), "utf8");
const js = await readFile(new URL("../scripts/site.js", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

function discoverSources(dir) {
  return readdirSync(new URL("../" + dir + "/", import.meta.url))
    .filter((f) => f.endsWith(".rb"))
    .map((f) => ({
      name: basename(f, ".rb"),
      source: readFileSync(new URL("../" + dir + "/" + f, import.meta.url), "utf8"),
    }));
}

const formulas = discoverSources("Formula");
const casks = discoverSources("Casks");
const allPackages = [...formulas, ...casks];

test("homepage exposes every formula and cask with an install command", () => {
  assert.ok(allPackages.length >= 10, "expected at least 10 packages");
  for (const pkg of allPackages) {
    assert.match(html, new RegExp('data-package="' + pkg.name + '"'));
    assert.match(html, new RegExp('data-copy-command="[^"]*' + pkg.name));
  }
});

test("homepage versions match every tap source file", () => {
  for (const pkg of allPackages) {
    const versionMatch =
      pkg.source.match(/version\s+["']([^"']+)["']/) ||
      pkg.source.match(/releases\/download\/v([^/]+)/);
    assert.ok(versionMatch, "version missing for " + pkg.name);
    assert.match(
      html,
      new RegExp('data-package="' + pkg.name + '"[^>]*data-version="' + versionMatch[1] + '"')
    );
  }
});

test("formula detail pages exist and match formula versions", async () => {
  for (const pkg of formulas) {
    const page = await readFile(new URL(`../${pkg.name}.html`, import.meta.url), "utf8");
    const versionMatch =
      pkg.source.match(/version\s+["']([^"']+)["']/) ||
      pkg.source.match(/releases\/download\/v([^/]+)/);
    assert.match(page, new RegExp(`data-package="${pkg.name}"[^>]*data-version="${versionMatch[1]}"`));
    assert.match(page, new RegExp(`data-copy-command="brew install [^"]*${pkg.name}"`));
  }
});

test("copy controls are keyboard-accessible and resilient", () => {
  assert.doesNotMatch(html, /\bonclick\s*=/i);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /navigator\.clipboard/);
  assert.match(js, /catch\s*[({]/);
  assert.match(css, /:focus-visible/);
});

test("site supports dual theme and reduced motion without visual anti-patterns", () => {
  assert.doesNotMatch(css, /background-clip\s*:\s*text/i);
  assert.doesNotMatch(css, /cubic-bezier\([^)]*1\.56/);
  assert.doesNotMatch(css, /Space Grotesk|Syne/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(html, /id="theme-toggle"/);
});

test("README lists every formula and cask", () => {
  for (const pkg of allPackages) {
    assert.match(readme, new RegExp("\\b" + pkg.name + "\\b"));
  }
});
