# frozen_string_literal: true

class Reminder < Formula
  # ... (Formula metadata remains the same) ...
  desc "A powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/archive/refs/tags/v3.0.0.tar.gz"
  sha256 "3168596090e32d24de0d2b6f976e2ceb967210e60183d69413f6cf347658ec01"
  license "MIT"
  version "3.0.0"

  on_macos do
    depends_on :xcode => ["13.0", :build]
    depends_on :macos

    def install
      # 💥 FINAL FIX: Safely find and change into the extracted source directory.
      # Homebrew places the extracted archive (e.g., apple-reminders-cli-3.0.0)
      # inside a staging directory. We must navigate into that nested folder.

      # Use Dir.glob to find the one and only directory created upon extraction.
      source_dir = Dir.glob("apple-reminders-cli-*").first

      if source_dir.nil?
        # This custom message is now correctly executed via `odie` if the directory isn't found.
        odie "Could not find the source directory after extraction. Please report this issue to the formula maintainer (yourself)."
      end

      # Change directory into the source directory before building (where Package.swift is located)
      cd source_dir do
        # Build the project
        system "swift", "build", "--disable-sandbox", "--configuration", "release"

        # Install the compiled executable
        bin.install ".build/release/apple-reminders-cli" => "reminder"
      end
    end
  end

  # ... (Test block remains the same) ...
  test do
    assert_match "Version: 3.0.0", shell_output("#{bin}/reminder --version")

    # Test for the expected permissions error (Homebrew's test sandbox lacks EventKit access)
    expected_error = "Error: No access to Reminders"
    output = shell_output("#{bin}/reminder lists 2>&1", 1)
    assert_match expected_error, output
  end
end
