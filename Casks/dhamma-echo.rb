cask "dhamma-echo" do
  arch arm: "aarch64", intel: "x64"

  version "0.5.9"
  sha256 arm:   "6cf3ce14809c8e9c0eefc5e5a7a88dc922939ad5810c7cd83ddcae09d7e5132b",
         intel: "11e786adefae0579e8d3026f8baff041bc010d85d3f27eaf543442b202855351"

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
