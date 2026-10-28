#!/usr/bin/env node
// Usage: node scripts/update-homebrew-cask.mjs <checkout-of-homebrew-tap> <vX.Y.Z> <sha256>
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [tapDir, tag, sha256] = process.argv.slice(2);
assert(tapDir, "Missing Homebrew tap checkout path");
assert(/^v\d+\.\d+\.\d+(?:-[\da-z.-]+)?$/i.test(tag ?? ""), "Invalid version tag");
assert(/^[0-9a-f]{64}$/i.test(sha256 ?? ""), "Invalid SHA-256 digest");
const version = tag.slice(1);
const cask = `cask "chatgpt-controller" do
  version "${version}"
  sha256 "${sha256.toLowerCase()}"

  url "https://github.com/AungMyoKyaw/chatgpt-controller-desktop/releases/download/v#{version}/ChatGPT-Controller-v#{version}-macos-arm64.zip"
  name "ChatGPT Controller"
  desc "Local API controller for a user-authenticated ChatGPT browser"
  homepage "https://github.com/AungMyoKyaw/chatgpt-controller-desktop"

  livecheck do
    url :url
    regex(/^v?(\\d+(?:\\.\\d+)+)$/i)
  end

  depends_on :macos
  depends_on arch: :arm64

  app "ChatGPT Controller.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/ChatGPT Controller.app"],
        must_succeed: false
  end

  caveats <<~EOS
    Google Chrome and Playwright CLI (@playwright/cli) are required.
    This build is ad-hoc signed, not Apple Developer ID signed or notarized.
    The cask attempts to remove quarantine recursively during installation.
    If macOS still blocks launch, use System Settings > Privacy & Security.
  EOS

  zap trash: [
    "~/.config/chatgpt-browser-controller",
    "~/.playwright-cli/chatgpt-controller-profile",
  ]
end
`;
const filename = path.join(tapDir, "Casks", "chatgpt-controller.rb");
mkdirSync(path.dirname(filename), { recursive: true });
writeFileSync(filename, cask, "utf8");
console.log(`Updated ${filename} for ${tag}`);
