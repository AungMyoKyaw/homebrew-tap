import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cask = await readFile(new URL("../Casks/receipts.rb", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

const version = "0.1.0";
const checksums = {
  arm: "0d9ae8cbc5d3f91636ca102a143983ec59f72503b6c6d196412b3a74ab70f573",
  intel: "4ba29923de66302a49707e536c1e58a92509fae6d22da30612b403f34ba837b6"
};

test("Receipts cask pins verified release assets for both architectures", () => {
  assert.match(cask, new RegExp(`version "${version}"`));
  assert.match(cask, /arch arm: "aarch64", intel: "x64"/);
  for (const [architecture, checksum] of Object.entries(checksums)) {
    assert.match(cask, new RegExp(`${architecture}:\\s+"${checksum}"`));
  }
  assert.match(cask, /Receipts_#\{version\}_#\{arch\}\.dmg/);
  assert.doesNotMatch(cask, /:no_check/);
});

test("Receipts removes quarantine after installation and normal uninstall preserves data", () => {
  assert.match(cask, /depends_on macos: :ventura/);
  assert.match(cask, /macOS 13\.3/);
  assert.match(cask, /app "Receipts\.app"/);
  assert.match(cask, /postflight_steps do\s+run "\/usr\/bin\/xattr",\s+args:\s+\["-d", "com\.apple\.quarantine", "\{\{appdir\}\}\/Receipts\.app"\],\s+must_succeed: false\s+end/);
  assert.match(cask, /zap trash:/);
  assert.match(cask, /not Apple Developer ID signed or notarized/);
  assert.doesNotMatch(cask, /uninstall delete/);
});

test("Receipts catalog and documentation agree with the cask and license", () => {
  assert.match(html, new RegExp(`data-package="receipts"[^>]*data-version="${version}"`));
  assert.match(html, /Copy receipts install command/);
  assert.match(readme, new RegExp(`\\| receipts \\| v${version} \\|`));
  assert.match(html, /AGPL-3\.0-or-later/);
  assert.match(readme, /AGPL-3\.0-or-later/);
  assert.doesNotMatch(readme, /All MIT licensed/);
  assert.match(html, /data-count="total">7</);
  assert.match(html, /data-count="casks">5</);
});
