cask "chatgpt-controller" do
  version "0.2.0"
  sha256 "baff49413f6df28f1ba89d5e62374bb57ec8556d9ee4e7c54f7cad60402eafac"

  url "https://github.com/AungMyoKyaw/chatgpt-controller-desktop/releases/download/v#{version}/ChatGPT-Controller-v#{version}-macos-arm64.zip"
  name "ChatGPT Controller"
  desc "Local API controller for a user-authenticated ChatGPT browser"
  homepage "https://github.com/AungMyoKyaw/chatgpt-controller-desktop"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
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
