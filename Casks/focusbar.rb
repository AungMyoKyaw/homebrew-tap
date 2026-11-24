cask "focusbar" do
  version "1.0.0"
  sha256 "fc78d23105d2557f77156e2023ebbd278f3be6870a1778f8801a2d757acd9f9a"

  url "https://github.com/AungMyoKyaw/FocusBar/releases/download/v#{version}/FocusBar.app.zip"
  name "FocusBar"
  desc "Menu bar Pomodoro timer with gamification and Apple Reminders integration"
  homepage "https://github.com/AungMyoKyaw/FocusBar"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :sonoma

  app "FocusBar.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/FocusBar.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/FocusBar",
    "~/Library/Caches/aungmyokyaw.com.FocusBar",
    "~/Library/Preferences/aungmyokyaw.com.FocusBar.plist",
    "~/Library/Saved Application State/aungmyokyaw.com.FocusBar.savedState",
  ]
end
