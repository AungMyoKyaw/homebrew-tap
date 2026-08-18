cask "git-ingest" do
  arch arm: "arm64", intel: "x64"

  version "0.2.7"
  sha256 arm:   "856b998fc24e132768c6e9d7c866a5fa97ee6a767899a29454b367040107c01a",
         intel: "1469e09bb6e3472959542c168c5bdfd0c213067128ac1c9082f15d204d773e0a"

  url "https://github.com/AungMyoKyaw/git-ingest-desktop/releases/download/v#{version}/Git-Ingest-#{version}-#{arch}.dmg"
  name "Git-Ingest"
  desc "Secure Electron desktop app for Git-Ingest"
  homepage "https://github.com/AungMyoKyaw/git-ingest-desktop"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :catalina

  app "Git-Ingest.app"

  postflight do
    system_command "xattr",
                   args:         ["-d", "com.apple.quarantine", "#{appdir}/Git-Ingest.app"],
                   must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/Git-Ingest",
    "~/Library/Caches/com.aungmyokyaw.git-ingest",
    "~/Library/Logs/Git-Ingest",
    "~/Library/Preferences/com.aungmyokyaw.git-ingest.plist",
    "~/Library/Saved Application State/com.aungmyokyaw.git-ingest.savedState",
  ]
end
