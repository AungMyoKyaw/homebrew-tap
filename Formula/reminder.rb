class Reminder < Formula
  desc "A powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/archive/refs/tags/v3.0.0.tar.gz"
  sha256 "e0f6e56075d13eca7ff1debb2166af474ae0ae18574418dc432a7222a22ea6f3"
  license "MIT"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "main"

  depends_on :xcode => ["13.0", :build]
  depends_on :macos

  def install
    # Clear any cached package data that might cause sandbox issues
    system "rm", "-rf", "#{Dir.home}/Library/Caches/org.swift.swiftpm" if OS.mac?

    # Build using xcodebuild with proper sandbox handling
    build_dir = buildpath/"build"

    system "xcodebuild", "-project", "apple-reminders-cli.xcodeproj",
           "-scheme", "apple-reminders-cli",
           "-configuration", "Release",
           "-derivedDataPath", build_dir,
           "ONLY_ACTIVE_ARCH=NO",
           "build"

    # Install the compiled executable
    bin.install build_dir/"Build/Products/Release/reminder"
  end

  test do
    assert_match "Version: 3.0.0", shell_output("#{bin}/reminder --version")
    # Test that the binary is executable and shows expected help text
    assert_match "reminder", shell_output("#{bin}/reminder --help")
  end
end
