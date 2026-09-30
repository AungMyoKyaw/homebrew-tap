import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
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
  assert.match(cask, /postflight_steps do\s+run "\/usr\/bin\/xattr",\s+args:\s+\["-dr", "com\.apple\.quarantine", "\{\{appdir\}\}\/Receipts\.app"\],\s+must_succeed: true\s+end/);
  assert.match(cask, /zap trash:/);
  assert.match(cask, /not Apple Developer ID signed or notarized/);
  assert.doesNotMatch(cask, /uninstall delete/);
});

test("Receipts postflight removes nested quarantine without clearing other attributes", {
  skip: process.platform !== "darwin"
}, async () => {
  const appdir = await mkdtemp(join(tmpdir(), "receipts-postflight-"));
  try {
    const app = join(appdir, "Receipts.app");
    const contents = join(app, "Contents");
    const executable = join(contents, "MacOS", "receipts");
    await mkdir(join(contents, "MacOS"), { recursive: true });
    await writeFile(executable, "test executable");
    for (const path of [app, contents, executable]) {
      execFileSync("/usr/bin/xattr", ["-w", "com.apple.quarantine", "0081;00000000;Test;", path]);
    }
    execFileSync("/usr/bin/xattr", ["-w", "com.receipts.test", "keep", executable]);

    const step = cask.match(/postflight_steps do\s+run "([^"]+)",\s+args:\s+(\[[^\n]+\])/);
    assert.ok(step, "postflight must declare an executable and literal arguments");
    const args = JSON.parse(step[2]).map(arg => arg.replaceAll("{{appdir}}", appdir));
    execFileSync(step[1], args);

    const attributes = execFileSync("/usr/bin/xattr", ["-lr", app], { encoding: "utf8" });
    assert.doesNotMatch(attributes, /com\.apple\.quarantine/);
    assert.match(attributes, /com\.receipts\.test: keep/);
    assert.doesNotThrow(() => execFileSync(step[1], args), "postflight must be safe to rerun");
  } finally {
    await rm(appdir, { recursive: true, force: true });
  }
});

test("Receipts catalog and documentation agree with the cask and license", () => {
  assert.match(html, new RegExp(`data-package="receipts"[^>]*data-version="${version}"`));
  assert.match(html, /Copy receipts install command/);
  assert.match(readme, new RegExp(`\\| receipts \\| v${version} \\|`));
  assert.match(html, /AGPL-3\.0-or-later/);
  assert.match(readme, /AGPL-3\.0-or-later/);
  assert.match(readme, /brew update\s+brew reinstall --cask aungmyokyaw\/tap\/receipts/);
  assert.doesNotMatch(readme, /preserves normal macOS quarantine checks/);
  assert.doesNotMatch(readme, /All MIT licensed/);
  assert.match(html, /data-count="total">7</);
  assert.match(html, /data-count="casks">5</);
});
