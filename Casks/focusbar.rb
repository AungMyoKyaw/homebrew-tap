cask "focusbar" do
  version "1.2.0"
  sha256 "81cafcab1d878fdb176d8c30a7f004b2cf487e7cf960a17ca31b50f8e9035c5a"

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
