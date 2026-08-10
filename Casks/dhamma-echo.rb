cask "dhamma-echo" do
  arch arm: "aarch64", intel: "x64"

  version "0.4.1"
  sha256 arm:   "3ed010596cfb1c678733a2b5d4af22d24067291264bef23413b5ddcb4f74e0b0",
         intel: "d4ee52f8a6c26dcbb7c168239c8929d75ebf655f703dd1939ba8fe757c350ac7"

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
