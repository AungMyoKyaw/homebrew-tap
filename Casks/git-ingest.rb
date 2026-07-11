cask "git-ingest" do
  arch arm: "arm64", intel: "x64"

  version "0.2.6"
  sha256 arm:   "ed2e2bdafd39fe09290c875b3020fbf23a12ea445e2369e9180c7d0bdf5020c2",
         intel: "af1e71a77acc23fe5934be887f98b559c3a9be43ed3dde148ec0581cf61fce3c"

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
