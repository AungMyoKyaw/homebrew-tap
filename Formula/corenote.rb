class Corenote < Formula
  desc "CLI frontend to Apple Notes via direct SQLite access"
  homepage "https://github.com/AungMyoKyaw/corenote"
  url "https://github.com/AungMyoKyaw/corenote/releases/download/v0.1.0/corenote-0.1.0.zip"
  sha256 "ae9d8386adf4aabb2d80d6ad7ab09c2546bc62153020931b46a5a4a88533827a"
  license "MIT"
  head "https://github.com/AungMyoKyaw/corenote.git", branch: "master"

  depends_on :macos

  def install
    bin.install "corenote"

    begin
      system "xattr", "-d", "com.apple.quarantine", "#{bin}/corenote"
    rescue
    end
  end

  test do
    assert_match "0.1.0", shell_output("#{bin}/corenote --version")
    assert_match "corenote", shell_output("#{bin}/corenote --help")
  end
end
