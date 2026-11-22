import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cask = await readFile(new URL("../Casks/dhamma-echo.rb", import.meta.url), "utf8");
const homepage = await readFile(new URL("../index.html", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

const version = "0.6.0";
const expectedChecksum = "f907da52ba9becd0141e458b3d6fb9d802f64ed0bf0ce40fc961794066dbc5bb";

test("Dhamma Echo cask tracks the published release assets", () => {
  assert.match(cask, new RegExp(`version "${version}"`));
  assert.match(cask, new RegExp(`sha256 "${expectedChecksum}"`));
  assert.match(cask, /Dhamma\.Echo_#\{version\}_aarch64\.dmg/);
});

test("Dhamma Echo documentation shows the cask version", () => {
  assert.match(readme, new RegExp(`\\| dhamma-echo \\| v${version} \\|`));
  assert.match(homepage, new RegExp(`data-package="dhamma-echo"[^>]*data-version="${version}"`));
  assert.match(homepage, new RegExp(`<span class="package-version">v${version}</span>`));
});
