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
      # 💥 CRITICAL FIX: Change directory to the source folder inside the extracted archive.
      # The name is typically the repo name followed by the version/tag.
      cd "apple-reminders-cli-3.0.0" do
        # Now, swift build can find the Package.swift file
        system "swift", "build", "--disable-sandbox", "--configuration", "release"

        # The executable path is relative to the current working directory (which is now the source dir)
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
