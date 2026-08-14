cask "caffeinate" do
  version "2.0.0"
  sha256 "5e7490b848ac54b58f7e2405e435d7380fd9035836303a2e145921b1c87b968e"

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
