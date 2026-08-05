cask "dhamma-echo" do
  arch arm: "aarch64", intel: "x64"

  version "0.2.0"
  sha256 arm:   "5e352921f295c7289a6d0eda5a367cf7c008cf3bf61e20e5951e1415f4099eff",
         intel: "b815ed01f72de3cfecbf64228e3c03bb6f56dcd850fbe31919ef6386758683b4"

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
