cask "caffeinate" do
  version "3.0.0"
  sha256 "d461aee402ef873ebe7943ec3ce61de7ab0a13e769a8fae23404d4a0855f1c82"

  url "https://github.com/AungMyoKyaw/caffeinate-app/releases/download/v#{version}/Caffeinate_#{version}_universal.dmg"
  name "Caffeinate"
  desc "Keep the computer awake during long tasks"
  homepage "https://github.com/AungMyoKyaw/caffeinate-app"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :monterey

  app "Caffeinate.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-d", "com.apple.quarantine", "{{appdir}}/Caffeinate.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/Caffeinate",
    "~/Library/Caches/ai.learningflow.caffeinate",
    "~/Library/Preferences/ai.learningflow.caffeinate.plist",
    "~/Library/Saved Application State/ai.learningflow.caffeinate.savedState",
  ]
end
