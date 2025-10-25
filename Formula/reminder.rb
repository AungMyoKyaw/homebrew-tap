class Reminder < Formula
  desc "Powerful, feature-rich command-line interface for Apple Reminders"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli/releases/download/v3.0.2/reminder-v3.0.2.zip"
  sha256 "c08c44f3dddea3fb57522df16357ac700009067b7b45d67de7e7c948649aa692"
  license "MIT"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "main"

  depends_on :macos

  def install
    # Extract and install the pre-compiled binary
    bin.install "reminder"
  end

  test do
    assert_match "3.0.2", shell_output("#{bin}/reminder --version")
    # Test that the binary is executable and shows expected help text
    assert_match "reminder", shell_output("#{bin}/reminder --help")
  end
end
