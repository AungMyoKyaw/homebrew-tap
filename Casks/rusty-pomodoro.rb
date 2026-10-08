cask "rusty-pomodoro" do
  arch arm: "arm64", intel: "x86_64"

  version "1.0.0"
  sha256 arm:   "169e9d41d63410347f95cd60dd6cd645f947236b8edfd217b45f434b2347db05",
         intel: "2b0b23270f15e7162e1b66646ecc43c6725da24ec71b9577945e55c4a3c40f8f"

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
