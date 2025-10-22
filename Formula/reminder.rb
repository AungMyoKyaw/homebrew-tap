# frozen_string_literal: true

class Reminder < Formula
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
      # 💥 FINAL CONFIRMED FIX: Navigate into the source directory.

      # 1. Navigate into the top-level extracted directory (e.g., apple-reminders-cli-3.0.0)
      cd "apple-reminders-cli-3.0.0" do

        # 2. Navigate into the nested source directory (apple-reminders-cli)
        # This is the directory containing Package.swift, main.swift, and the build system.
        cd "apple-reminders-cli" do

          # Now, swift build can find Package.swift relative to the current directory.
          system "swift", "build", "--disable-sandbox", "--configuration", "release"

          # Install the compiled executable
          bin.install ".build/release/apple-reminders-cli" => "reminder"
        end
      end
    end
  end

  test do
    assert_match "Version: 3.0.0", shell_output("#{bin}/reminder --version")
    expected_error = "Error: No access to Reminders"
    output = shell_output("#{bin}/reminder lists 2>&1", 1)
    assert_match expected_error, output
  end
end
