cask "chatgpt-controller" do
  version "0.3.0-rc.5"
  sha256 "271ca30f88c569a640cc00653baaee91426275cee99b061f4ad0ad93b75c074c"

  url "https://github.com/AungMyoKyaw/chatgpt-controller-desktop/releases/download/v#{version}/ChatGPT-Controller-v#{version}-macos-arm64.zip"
  name "ChatGPT Controller"
  desc "Native local API controller with embedded ChatGPT sign-in"
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
    No external Chrome or Playwright CLI installation is required.
    This build is ad-hoc signed, not Apple Developer ID signed or notarized.
    The cask attempts to remove quarantine recursively during installation.
    If macOS still blocks launch, use System Settings > Privacy & Security.
  EOS

  zap trash: [
    "~/.config/chatgpt-browser-controller",
    "~/.playwright-cli/chatgpt-controller-profile",
  ]
end
