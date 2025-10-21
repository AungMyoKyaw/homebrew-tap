# Apple Reminders CLI Formula
class Reminder < Formula
  desc "A powerful Swift command-line interface for Apple Reminders with full EventKit integration"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli.git",
    branch: "master",
    revision: "b32dbb24835b1639127ad41d9a39161707723ccf"
  version "1.0.0"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "master"

  depends_on :macos
  depends_on xcode: ["14.0", :build]

  def install
    # Fix the executable name to be consistent
    inreplace "apple-reminders-cli.xcodeproj/project.pbxproj",
      "apple-reminders-cli", "reminder"

    # Build using Xcode project
    system "xcodebuild", "-project", "apple-reminders-cli.xcodeproj",
           "-scheme", "apple-reminders-cli",
           "-configuration", "Release",
           "-derivedDataPath", "DerivedData",
           "ONLY_ACTIVE_ARCH=NO",
           "build"

    # Find the built executable
    executable_path = "DerivedData/Build/Products/Release/apple-reminders-cli"

    # Install the executable with the correct name
    bin.install executable_path => "reminder"
  end

  test do
    # Test that the executable runs and shows help
    system "#{bin}/reminder", "--version"
  end
end