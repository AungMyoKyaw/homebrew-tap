# frozen_string_literal: true

class Reminder < Formula
  desc "A powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  # URL pointing to the confirmed v3.0.0 source archive
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/archive/refs/tags/v3.0.0.tar.gz"
  # The confirmed SHA256 checksum for integrity verification
  sha256 "3168596090e32d24de0d2b6f976e2ceb967210e60183d69413f6cf347658ec01"
  license "MIT"
  version "3.0.0"

  on_macos do
    # Requires Xcode for the Swift compiler and EventKit framework access
    depends_on :xcode => ["13.0", :build]
    depends_on :swift
    # Explicitly restrict to macOS as the app relies on the EventKit framework
    depends_on :macos

    def install
      # The `swift build` command is used to compile the project from source,
      # including resolving the swift-argument-parser dependency (via SPM).
      system "swift", "build", "--disable-sandbox", "--configuration", "release"

      # Install the compiled executable from the build path to the Homebrew bin directory,
      # renaming it from its package name to the command name "reminder".
      bin.install ".build/release/apple-reminders-cli" => "reminder"
    end
  end

  # The test block verifies the installation
  test do
    # 1. Check if the binary runs and reports the correct version
    assert_match "Version: 3.0.0", shell_output("#{bin}/reminder --version")

    # 2. Test a functional command. Since Homebrew's test environment is sandboxed,
    # it cannot access EventKit. We assert that the tool handles this gracefully
    # by outputting the expected permissions error and exiting with a non-zero code.
    expected_error = "Error: No access to Reminders"
    # shell_output expects a non-zero exit code (1) in this case
    output = shell_output("#{bin}/reminder lists 2>&1", 1)
    assert_match expected_error, output
  end
end
