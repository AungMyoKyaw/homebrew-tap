cask "block-clock" do
  arch arm: "arm64", intel: "x64"

  version "0.2.6"
  sha256 arm:   "4b9016271286fd4aa57c54c7b92e9a665aa024b5fa2fec6a3a7d40c693327af4",
         intel: "27d39bae4b879935614c30320c43e5dd0d2872ff5f547118438ece3ac176b929"

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
