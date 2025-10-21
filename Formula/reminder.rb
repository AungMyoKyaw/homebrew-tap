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
    # Build using Xcode project
    system "xcodebuild", "-project", "apple-reminders-cli.xcodeproj",
           "-scheme", "apple-reminders-cli",
           "-configuration", "Release",
           "clean", "build"

    # Find the built executable in Xcode's DerivedData directory
    executable_path = Dir.glob("#{ENV["HOME"]}/Library/Developer/Xcode/DerivedData/apple-reminders-cli-*/Build/Products/Release/reminder")
                      .find { |path| File.executable?(path) }

    # Fallback to local DerivedData if not found in user directory
    if executable_path.nil?
      executable_path = "DerivedData/Build/Products/Release/reminder"
    end

    # Install the executable
    bin.install executable_path
  end

  test do
    # Test that the executable runs and shows help
    system "#{bin}/reminder", "--version"
  end
end
