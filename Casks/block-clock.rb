cask "block-clock" do
  arch arm: "arm64", intel: "x64"

  version "0.2.5"
  sha256 arm:   "3cb3e906986dfbc750512442c085220c4c592f7cd414e02cc812b43b0813f72c",
         intel: "d12dcc5273aefc7f151ca27ddba58e17781b4eec280bb076903b83cf74dee10f"

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
