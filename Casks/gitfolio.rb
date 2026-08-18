cask "gitfolio" do
  arch arm: "arm64", intel: "x64"

  version "1.0.2"
  sha256 arm:   "145e8739a0e309788bcdcfe5c6e9a92e23ac14cbecd2360b9c314ff0ac0e38a9",
         intel: "72f70b30b90b3c41fd7fc92c3e1b722262862b439bbaeaab9c7770e864bfd7de"

  url "https://github.com/AungMyoKyaw/GitFolio/releases/download/v#{version}/GitFolio-#{version}-mac-#{arch}.dmg"
  name "GitFolio"
  desc "Git contribution portfolio exporter"
  homepage "https://github.com/AungMyoKyaw/GitFolio"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :catalina

  app "GitFolio.app"

  postflight do
    system_command "xattr",
                   args:         ["-d", "com.apple.quarantine", "#{appdir}/GitFolio.app"],
                   must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/GitFolio",
    "~/Library/Caches/com.gitfolio.app",
    "~/Library/Preferences/com.gitfolio.app.plist",
    "~/Library/Saved Application State/com.gitfolio.app.savedState",
  ]
end
