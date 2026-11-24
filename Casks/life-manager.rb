cask "life-manager" do
  version "0.1.0"
  sha256 "def3330bf31cfa2635db66f8534a082017d93c9a820a5de0d137ef570439fcf9"

  url "https://github.com/AungMyoKyaw/life-manager/releases/download/v#{version}/LifeManager.dmg"
  name "Life Manager"
  desc "Local-first productivity app for tasks, calendar, focus, habits, and goals"
  homepage "https://github.com/AungMyoKyaw/life-manager"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on arch: :arm64
  depends_on macos: :ventura

  app "Life Manager.app"
  binary "#{appdir}/Life Manager.app/Contents/MacOS/life"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/Life Manager.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/LifeManager",
    "~/Library/Preferences/local.lifemanager.desktop.plist",
    "~/Library/Saved Application State/local.lifemanager.desktop.savedState",
  ]
end
