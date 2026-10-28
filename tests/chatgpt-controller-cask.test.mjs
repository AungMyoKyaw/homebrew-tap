import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const script = path.resolve(import.meta.dirname, "../scripts/update-chatgpt-controller-cask.mjs");

test("ChatGPT Controller cask generator produces a verified ARM64 release pin", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "homebrew-controller-"));
  try {
    const sha = "f".repeat(64);
    const result = spawnSync(process.execPath, [script, directory, "v0.1.0", sha], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const caskPath = path.join(directory, "Casks/chatgpt-controller.rb");
    const cask = readFileSync(caskPath, "utf8");
    assert.match(cask, /version "0\.1\.0"/);
    assert.ok(cask.includes(`sha256 "${sha}"`));
    assert.ok(cask.includes("ChatGPT-Controller-v#{version}-macos-arm64.zip"));
    assert.match(cask, /depends_on arch: :arm64/);
    assert.match(cask, /postflight_steps do/);
    assert.match(cask, /run "\/usr\/bin\/xattr"/);
    assert.ok(cask.includes('["-dr", "com.apple.quarantine", "{{appdir}}/ChatGPT Controller.app"]'));
    assert.match(cask, /must_succeed: false/);
    const ruby = spawnSync("ruby", ["-c", caskPath], { encoding: "utf8" });
    assert.equal(ruby.status, 0, ruby.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("ChatGPT Controller cask generator rejects invalid metadata", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "homebrew-controller-"));
  try {
    const invalidHash = spawnSync(process.execPath, [script, directory, "v0.1.0", "invalid"]);
    assert.notEqual(invalidHash.status, 0);
    const invalidVersion = spawnSync(process.execPath, [script, directory, "latest", "f".repeat(64)]);
    assert.notEqual(invalidVersion.status, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
