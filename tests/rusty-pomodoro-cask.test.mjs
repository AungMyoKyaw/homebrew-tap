import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cask = await readFile(new URL("../Casks/rusty-pomodoro.rb", import.meta.url), "utf8");
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("Rusty Pomodoro cask pins v1.0.1 release assets for both Mac architectures", () => {
  assert.match(cask, /version "1\.0\.1"/);
  assert.match(cask, /arch arm: "arm64", intel: "x86_64"/);
  assert.match(cask, /fab10d9b31c77f5ae58eabdffb166dced4f875ec255f20aa0b0d1d44cf37aa40/);
  assert.match(cask, /861feac4b96e853a736c2ba8e6814fa1db5c4e4666b1f4bf805a2e7f018b4e2f/);
  assert.match(cask, /rusty-pomodoro-v#\{version\}-macos-#\{arch\}\.zip/);
  assert.match(cask, /app "Rusty Pomodoro Slint\.app"/);
});

test("Rusty Pomodoro cask removes nested quarantine and documents ad-hoc signing", () => {
  assert.match(cask, /depends_on :macos/);
  assert.match(cask, /postflight_steps do\s+run "\/usr\/bin\/xattr",\s+args:\s+\["-dr", "com\.apple\.quarantine", "\{\{appdir\}\}\/Rusty Pomodoro Slint\.app"\],\s+must_succeed: true\s+end/);
  assert.match(cask, /ad-hoc signed, not Apple Developer ID signed or notarized/);
});

test("tap docs and catalog expose the cask installer", () => {
  assert.match(html, /data-package="rusty-pomodoro"[^>]*data-version="1\.0\.1"/);
  assert.match(html, /brew install &#45;&#45;cask AungMyoKyaw\/homebrew-tap\/rusty-pomodoro/);
  assert.match(readme, /\| rusty-pomodoro \| v1\.0\.1 \|/);
  assert.match(readme, /brew install --cask AungMyoKyaw\/homebrew-tap\/rusty-pomodoro/);
});
