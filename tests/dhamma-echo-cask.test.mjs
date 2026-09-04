import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cask = await readFile(new URL("../Casks/dhamma-echo.rb", import.meta.url), "utf8");
const homepage = await readFile(new URL("../index.html", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

const version = "0.5.10";
const expectedChecksums = {
  arm: "3bb1fd014556f0ca09b197143f2ae14e8f3dc7cc919c546b515091a315c86da4",
  intel: "232a6d067119b49ae048b0ce908a0a2769647c5483dc7a36271b9931527a0f34"
};

test("Dhamma Echo cask tracks the published release assets", () => {
  assert.match(cask, new RegExp(`version "${version}"`));
  for (const [architecture, checksum] of Object.entries(expectedChecksums)) {
    assert.match(cask, new RegExp(`${architecture}:\\s+"${checksum}"`));
  }
  assert.match(cask, /Dhamma\.Echo_#\{version\}_#\{arch\}\.dmg/);
});

test("Dhamma Echo documentation shows the cask version", () => {
  assert.match(readme, new RegExp(`\\| dhamma-echo \\| v${version} \\|`));
  assert.match(homepage, new RegExp(`data-package="dhamma-echo"[^>]*data-version="${version}"`));
  assert.match(homepage, new RegExp(`<span class="package-version">v${version}</span>`));
});
