# Apple Reminders CLI Formula
class Reminder < Formula
  desc "A powerful Swift command-line interface for Apple Reminders with full EventKit integration"
  homepage "https://github.com/AungMyoKyaw/apple-reminders-cli"
  url "https://github.com/AungMyoKyaw/apple-reminders-cli.git",
    branch: "master",
    revision: "b32dbb24835b1639127ad41d9a39161707723ccf"
  version "1.0.0"
  head "https://github.com/AungMyoKyaw/apple-reminders-cli.git", branch: "master"

  depends_on :macos

  def install
    # Use the install script from the repository instead of building directly
    # This avoids Swift Package Manager manifest compilation issues
    install_script = "#{buildpath}/install.sh"

    # Create a modified install script that installs to our prefix
    modified_install = "#{buildpath}/install_homebrew.sh"
    install_content = File.read(install_script)

    # Modify the script to install to Homebrew's prefix instead of /usr/local/bin
    modified_content = install_content.gsub(
      'INSTALL_DIR="/usr/local/bin"',
      "INSTALL_DIR=\"#{bin}\""
    ).gsub(
      /sudo mkdir -p "\$INSTALL_DIR"/,
      "mkdir -p \"$INSTALL_DIR\""
    ).gsub(
      'sudo cp "$EXECUTABLE" "$INSTALL_DIR/$INSTALL_NAME"',
      'cp "$EXECUTABLE" "$INSTALL_DIR/$INSTALL_NAME"'
    ).gsub(
      'sudo chmod +x "$INSTALL_DIR/$INSTALL_NAME"',
      'chmod +x "$INSTALL_DIR/$INSTALL_NAME"'
    )

    File.write(modified_install, modified_content)
    chmod 0755, modified_install

    # Run the modified install script
    system modified_install
  end

  test do
    # Test that the executable runs and shows help
    system "#{bin}/reminder", "--version"
  end
end
