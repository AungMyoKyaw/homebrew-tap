cask "chatgpt-controller" do
  version "0.3.0"
  sha256 "347c5764b36c13312f0ed1666c7a4db10ae20d20dc46ca15b87f99632d1a02ec"

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
