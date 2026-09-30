cask "receipts" do
  arch arm: "aarch64", intel: "x64"

  version "0.1.0"
  sha256 arm:   "0d9ae8cbc5d3f91636ca102a143983ec59f72503b6c6d196412b3a74ab70f573",
         intel: "4ba29923de66302a49707e536c1e58a92509fae6d22da30612b403f34ba837b6"

  url "https://github.com/AungMyoKyaw/receipts/releases/download/v#{version}/Receipts_#{version}_#{arch}.dmg"
  name "Receipts"
  desc "Local-first menu-bar time tracker"
  homepage "https://aungmyokyaw.github.io/receipts/"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :ventura

  app "Receipts.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-d", "com.apple.quarantine", "{{appdir}}/Receipts.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/com.aungmyokyaw.receipts",
    "~/Library/Caches/com.aungmyokyaw.receipts",
    "~/Library/Logs/com.aungmyokyaw.receipts",
    "~/Library/Preferences/com.aungmyokyaw.receipts.plist",
    "~/Library/Saved Application State/com.aungmyokyaw.receipts.savedState",
    "~/Library/WebKit/com.aungmyokyaw.receipts",
  ]

  caveats <<~EOS
    Receipts requires macOS 13.3 or later.
    Builds are ad-hoc signed, not Apple Developer ID signed or notarized.
    If macOS blocks the first launch, choose Open Anyway for Receipts in
    System Settings > Privacy & Security.
    Regular uninstall keeps your sessions; --zap removes the local database.
  EOS
end
