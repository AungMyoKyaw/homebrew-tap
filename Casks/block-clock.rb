cask "block-clock" do
  arch arm: "arm64", intel: "x64"

  version "0.2.2"
  sha256 arm:   "971a905c80f3ce02050b5dfa259b4ed6ed2e6d58c03a794c2ec423cf1a4ce585",
         intel: "7e92f96e429c43ad19e268fba36eb82c98a32c2856a857173f558bc68db79446"

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
