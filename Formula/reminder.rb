# frozen_string_literal: true

class Reminder < Formula
  desc "A powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/archive/refs/tags/v3.0.0.tar.gz"
  sha256 "3168596090e32d24de0d2b6f976e2ceb967210e60183d69413f6cf347658ec01"
  license "MIT"
  version "3.0.0"

  on_macos do
    # 💥 Correction: Replace the special dependency :swift with the explicit
    # requirement for Xcode, which bundles the Swift toolchain.
    # The '13.0' version is based on your project's stated requirements.
    depends_on :xcode => ["13.0", :build]

    # The tool uses macOS-only frameworks (EventKit), so it must be on macOS.
    depends_on :macos

    def install
      # Use the XCode-bundled 'swift build' command to compile the project.
      # Homebrew automatically sets the correct environment variables for the build.
      system "swift", "build", "--disable-sandbox", "--configuration", "release"

      # Install the compiled executable, renaming it to 'reminder'.
      bin.install ".build/release/apple-reminders-cli" => "reminder"
    end
  end

  test do
    assert_match "Version: 3.0.0", shell_output("#{bin}/reminder --version")

    # Test for the expected permissions error (Homebrew's test sandbox lacks EventKit access)
    expected_error = "Error: No access to Reminders"
    output = shell_output("#{bin}/reminder lists 2>&1", 1)
    assert_match expected_error, output
  end
end
