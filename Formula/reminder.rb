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
      # 💥 CRITICAL FIX: Use the 'cd' command with the 'libexec' directory.
      # Homebrew extracts the tarball into a nested folder. We use Dir.glob to find
      # the correct source directory, which is essential for `swift build` to find Package.swift.
      # The '--strip-components 1' trick is often required for Git-generated tarballs,
      # but in the formula, we use 'cd' to step into the directory.

      # We assume the extracted folder is the only directory in the staging area:
      source_dir = Dir.glob("apple-reminders-cli-*").first

      if source_dir.nil?
        # Fallback in case Homebrew stripped the directory name
        # If the contents are already at the root, no 'cd' is needed.
        # But since we have a nested structure, this suggests the source is buried.
        odie "Could not find the source directory after extraction. Please report this issue to the formula maintainer (yourself)."
      end

      # Navigate into the source directory
      cd source_dir do
        # Now, swift build can find the Package.swift file
        system "swift", "build", "--disable-sandbox", "--configuration", "release"

        # The executable path is relative to the current working directory (source_dir)
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
