cask "focusbar" do
  version "2.0.2"
  sha256 "3e92cfb46cf1e18a43ae2870bbc2ea8508175cd3e1c21c17e94c75f204faf428"

  url "https://github.com/AungMyoKyaw/FocusBar/releases/download/v#{version}/FocusBar.app.zip"
  name "FocusBar"
  desc "Menu bar Pomodoro timer with gamification and Apple Reminders integration"
  homepage "https://aungmyokyaw.github.io/FocusBar/"

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
