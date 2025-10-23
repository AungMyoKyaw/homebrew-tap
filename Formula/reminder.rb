class Reminder < Formula
  desc "Powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/releases/download/v3.0.1/reminder-v3.0.1.zip"
  sha256 "e0f6e56075d13eca7ff1debb2166af474ae0ae18574418dc432a7222a22ea6f3"
  license "MIT"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "main"

  depends_on :macos

  def install
    # Extract and install the pre-compiled binary
    bin.install "reminder"
  end

  test do
    assert_match "3.0.1", shell_output("#{bin}/reminder --version")
    # Test that the binary is executable and shows expected help text
    assert_match "reminder", shell_output("#{bin}/reminder --help")
  end
end
