cask "dhamma-echo" do
  arch arm: "aarch64", intel: "x64"

  version "0.5.7"
  sha256 arm:   "cc20e0acb8442408b821f47f2d9a91ec637b3619fcd0135d58164556b0d56dbc",
         intel: "c26a91bf82776dcd360988ffa57dfcd86aafeb876849591d9e9c34e9d8b81222"

  url "https://github.com/AungMyoKyaw/dhamma-echo/releases/download/v#{version}/Dhamma.Echo_#{version}_#{arch}.dmg"
  name "Dhamma Echo"
  desc "Quiet desktop library for Dhamma talks"
  homepage "https://github.com/AungMyoKyaw/dhamma-echo"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :monterey

  app "Dhamma Echo.app"

  postflight do
    system_command "xattr",
                   args:         ["-d", "com.apple.quarantine", "#{appdir}/Dhamma Echo.app"],
                   must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/com.aungmyokyaw.dhammaecho",
    "~/Library/Caches/com.aungmyokyaw.dhammaecho",
    "~/Library/Preferences/com.aungmyokyaw.dhammaecho.plist",
    "~/Library/Saved Application State/com.aungmyokyaw.dhammaecho.savedState",
    "~/Library/WebKit/com.aungmyokyaw.dhammaecho",
  ]
end
