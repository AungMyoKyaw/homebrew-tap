cask "block-clock" do
  arch arm: "arm64", intel: "x64"

  version "0.2.4"
  sha256 arm:   "20c2df160270b4684f8d7554eb5245dd9077c1828d921e5fdfbb1c3090c4c20c",
         intel: "4bb85599b0915e6e51c71badb0e5fc3951d3da1ca5dc57521421578e60aeff6e"

  url "https://github.com/AungMyoKyaw/block-clock/releases/download/v#{version}/block-clock-macos-#{arch}.zip"
  name "Block Clock"
  desc "Native GPUI desktop clock visualizing the day as 1,440 minute blocks"
  homepage "https://aungmyokyaw.github.io/block-clock/"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :ventura

  app "Block Clock.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/Block Clock.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/block-clock",
    "~/Library/Preferences/com.blockclock.app.plist",
    "~/Library/Saved Application State/com.blockclock.app.savedState",
  ]
end
