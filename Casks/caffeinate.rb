cask "caffeinate" do
  version "2.1.0"
  sha256 "a6c60354f8d58fc3b67e5fd025055b34000341ec1d92def35ad17f1a74f1d34c"

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
