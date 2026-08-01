cask "caffeinate" do
  version "1.0.0"
  sha256 "ed526390d24cb8a2b969a00f0d5dfbbf51e8661d9774d1b737a882639c2c23a8"

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

  postflight do
    system_command "xattr",
                   args:         ["-d", "com.apple.quarantine", "#{appdir}/Caffeinate.app"],
                   must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/Caffeinate",
    "~/Library/Caches/ai.learningflow.caffeinate",
    "~/Library/Preferences/ai.learningflow.caffeinate.plist",
    "~/Library/Saved Application State/ai.learningflow.caffeinate.savedState",
  ]
end
