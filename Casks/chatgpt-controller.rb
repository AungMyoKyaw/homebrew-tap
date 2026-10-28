cask "chatgpt-controller" do
  version "0.1.0"
  sha256 "a93329ba3125f776500a7aeb40bf0c1703ca322ff8c7aa4598db4e85b9582525"

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

  caveats <<~EOS
    Google Chrome and Playwright CLI (@playwright/cli) are required.
    This build is ad-hoc signed, not Apple Developer ID signed or notarized.
    If macOS blocks the first launch, approve it in System Settings > Privacy & Security.
  EOS

  zap trash: [
    "~/.config/chatgpt-browser-controller",
    "~/.playwright-cli/chatgpt-controller-profile",
  ]
end
