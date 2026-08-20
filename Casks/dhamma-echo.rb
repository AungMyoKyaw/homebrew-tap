cask "dhamma-echo" do
  arch arm: "aarch64", intel: "x64"

  version "0.5.6"
  sha256 arm:   "0dd8067127d0a3bee0fcb39c0ea36dda030e297fc88518a96855b44a23d8ec6c",
         intel: "617a8b1bac1b31a7306fcd433405483e43999699eebb352e9d9f09e489b49b2d"

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
