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
      # 💥 ROBUST FIX: Handle various Homebrew extraction patterns
      # Homebrew may extract the archive differently depending on the tarball structure

      # Look for the source directory - try multiple patterns
      source_dir = Dir.glob("apple-reminders-cli-*").first

      if source_dir.nil?
        # Fallback: check if files are already at the root (some archives extract directly)
        if File.exist?("apple-reminders-cli.xcodeproj")
          source_dir = "."
        else
          odie "Could not find apple-reminders-cli source directory. Available contents: #{Dir.glob('*').join(', ')}"
        end
      end

      cd source_dir do
        # Verify we're in the right place
        unless File.exist?("apple-reminders-cli.xcodeproj")
          odie "Not in the correct source directory. Missing apple-reminders-cli.xcodeproj file."
        end

        # Build using xcodebuild which handles Swift Package Manager dependencies
        # Build to a specific output directory for predictability
        build_dir = buildpath/"build"

        system "xcodebuild", "-project", "apple-reminders-cli.xcodeproj",
               "-scheme", "apple-reminders-cli",
               "-configuration", "Release",
               "-derivedDataPath", build_dir,
               "build"

        # Find the built executable in our specified build directory
        built_executable = build_dir/"Build/Products/Release/reminder"

        unless built_executable.exist?
          odie "Build failed: could not find executable at #{built_executable}"
        end

        # Install the compiled executable to Homebrew's bin directory
        bin.install built_executable => "reminder"
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
