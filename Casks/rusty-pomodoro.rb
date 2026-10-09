cask "rusty-pomodoro" do
  arch arm: "arm64", intel: "x86_64"

  version "1.0.1"
  sha256 arm:   "fab10d9b31c77f5ae58eabdffb166dced4f875ec255f20aa0b0d1d44cf37aa40",
         intel: "861feac4b96e853a736c2ba8e6814fa1db5c4e4666b1f4bf805a2e7f018b4e2f"

  url "https://github.com/AungMyoKyaw/rusty-pomodoro/releases/download/v#{version}/rusty-pomodoro-v#{version}-macos-#{arch}.zip"
  name "Rusty Pomodoro"
  desc "Focused Pomodoro timer with sessions, breaks, themes, and statistics"
  homepage "https://github.com/AungMyoKyaw/rusty-pomodoro"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on :macos

  app "Rusty Pomodoro Slint.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/Rusty Pomodoro Slint.app"],
        must_succeed: true
  end

  zap trash: "~/Library/Application Support/tomito-rs"

  caveats <<~EOS
    Requires macOS 11 or later.
    The app is ad-hoc signed, not Apple Developer ID signed or notarized.
    The cask removes quarantine during installation. If macOS still blocks first launch,
    choose Open Anyway for Rusty Pomodoro in System Settings > Privacy & Security.
    `brew uninstall --cask --zap` also removes local settings and history.
  EOS
end
