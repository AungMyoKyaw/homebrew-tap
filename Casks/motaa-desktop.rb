cask "motaa-desktop" do
  arch arm: "arm64", intel: "x64"

  version "0.2.0"
  sha256 arm:   "3d6e66aac412f4d4b8e61780b61dd217d8e90553f00c2dbfd68cd8252452b870",
         intel: "81d60bdaf6c725efa5a3256e40a90727ca1bb7e44327f8f98810f52f9bcac150"

  url "https://github.com/AungMyoKyaw/motaa-desktop/releases/download/v#{version}/motaa-desktop-v#{version}-macos-#{arch}.zip"
  name "MOTAA Desktop"
  desc "Offline-first Myanmar astrology desktop workspace built with Rust and GPUI"
  homepage "https://aungmyokyaw.github.io/motaa-desktop/"

  livecheck do
    url :url
    regex(/^v?(\d+(?:\.\d+)+)$/i)
  end

  depends_on macos: :ventura

  app "MOTAA Desktop.app"

  postflight_steps do
    run "/usr/bin/xattr",
        args:         ["-dr", "com.apple.quarantine", "{{appdir}}/MOTAA Desktop.app"],
        must_succeed: false
  end

  zap trash: [
    "~/Library/Application Support/MOTAA Desktop GPUI",
    "~/Library/Preferences/com.motaa.desktop.plist",
    "~/Library/Saved Application State/com.motaa.desktop.savedState",
  ]
end
