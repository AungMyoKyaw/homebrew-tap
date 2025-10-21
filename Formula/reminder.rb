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
    # Clear package manager cache to avoid manifest compilation issues
    system "rm", "-rf", "#{ENV["HOME"]}/Library/Caches/org.swift.swiftpm/manifests"

    # Build using Xcode project with available SDK and validation bypass
    system "xcodebuild", "-project", "apple-reminders-cli.xcodeproj",
           "-scheme", "apple-reminders-cli",
           "-configuration", "Release",
           "-derivedDataPath", "DerivedData",
           "-skipPackagePluginValidation",
           "-skipMacroValidation",
           "clean", "build"

    # Find the built executable in local DerivedData directory
    executable_path = "DerivedData/Build/Products/Release/reminder"

    # Verify executable exists
    unless File.exist?(executable_path)
      # Try finding with glob pattern
      executable_path = Dir.glob("DerivedData/Build/Products/Release/reminder").first
    end

    # Install the executable
    bin.install executable_path
  end

  test do
    # Test that the executable runs and shows help
    system "#{bin}/reminder", "--version"
  end
end
