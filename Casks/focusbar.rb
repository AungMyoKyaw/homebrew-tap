cask "focusbar" do
  version "2.0.1"
  sha256 "2116cf2d48dd1c4e4bb2827e88c7a255382e0e7b2a595c5e21aef8bdc40d483b"

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
