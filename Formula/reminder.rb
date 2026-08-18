# frozen_string_literal: true

class Reminder < Formula
  desc "Powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/releases/download/v3.0.4/reminder-3.0.4.zip"
  sha256 "960b2cc708b2cb0eac357fbc8360e45282ab0a80d9924093526d2c6d66513b9f"
  license "MIT"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "main"

  depends_on :macos

  def install
    # Extract and install the pre-compiled binary
    bin.install "reminder"

    # Remove quarantine attribute to allow immediate execution
    # This is safe for formulae from trusted taps
    quarantine_path = "#{bin}/reminder"
    if File.exist?(quarantine_path)
      system "xattr", "-d", "com.apple.quarantine", quarantine_path
    end
  rescue RuntimeError => e
    # Quarantine attribute may not exist on all systems, which is acceptable
    opoo "Could not remove quarantine attribute: #{e.message}" if verbose?
  end

  test do
    assert_match "3.0.4", shell_output("#{bin}/reminder --version")
    # Test that the binary is executable and shows expected help text
    assert_match "reminder", shell_output("#{bin}/reminder --help")
  end
end
