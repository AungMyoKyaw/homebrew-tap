# AungMyoKyaw / homebrew-tap

> **Live site:** [aungmyokyaw.github.io/homebrew-tap](https://aungmyokyaw.github.io/homebrew-tap/)

A personal Homebrew tap for nine macOS tools (2 formulae, 7 casks), installed and updated through Homebrew. ChatGPT Controller, Receipts and Rusty Pomodoro use AGPL-3.0-or-later.

## Prerequisites

- [Homebrew](https://brew.sh/) installed on your system
- macOS on Apple Silicon or Intel

## Install

```bash
brew tap AungMyoKyaw/homebrew-tap
brew install <package>
```

## Formulae

| Package | Version | What it does |
| --- | --- | --- |
| [reminder](./reminder.html) | v3.0.4 | Command-line interface for Apple Reminders, full EventKit integration |
| [corenote](./corenote.html) | v0.1.0 | CLI frontend to Apple Notes via direct SQLite access |

```bash
brew install AungMyoKyaw/homebrew-tap/reminder
brew install AungMyoKyaw/homebrew-tap/corenote
```

### reminder

A native macOS command-line tool for interacting with Apple Reminders. Built with Swift and EventKit for seamless integration with macOS.

Features include:

- Full EventKit integration
- Native Swift performance
- Terminal-first design

## Usage

```bash
reminder --help
reminder --version
reminder add "Buy groceries"
reminder list
```

See the [apple-reminders-cli repository](https://github.com/AungMyoKyaw/apple-reminders-cli) for more details.

## Troubleshooting

If the installed binary is not executable, run:

```bash
chmod +x "$(brew --prefix)/bin/reminder"
```

The formula removes the macOS quarantine attribute during installation. If a security warning remains:

```bash
xattr -d com.apple.quarantine "$(brew --prefix)/bin/reminder"
```

On first run, macOS may prompt you to grant Terminal access to Reminders. Choose **Allow** so the CLI can work with your reminders.

## Casks

| Package | Version | What it does |
| --- | --- | --- |
| git-ingest | v0.2.7 | Secure Electron desktop app that bundles any repo for LLM context |
| gitfolio | v1.0.2 | Git contribution portfolio exporter for macOS |
| caffeinate | v3.0.0 | Keep your Mac awake during long builds, downloads, renders, and remote sessions |
| dhamma-echo | v0.5.10 | A quiet desktop library for Dhamma talks. Listen offline, mindfully |
| receipts | v0.1.0 | Local-first menu-bar time tracker with sessions, a weekly calendar and statistics |
| rusty-pomodoro | v1.0.1 | Focus timer with sessions, breaks, themes, and statistics |
| [chatgpt-controller](https://aungmyokyaw.github.io/chatgpt-controller-desktop/) | v0.1.0 | Local ChatGPT browser controller with an authenticated localhost API (Apple Silicon) |

```bash
brew install --cask AungMyoKyaw/homebrew-tap/git-ingest
brew install --cask AungMyoKyaw/homebrew-tap/gitfolio
brew install --cask AungMyoKyaw/homebrew-tap/caffeinate
brew install --cask AungMyoKyaw/homebrew-tap/dhamma-echo
brew install --cask AungMyoKyaw/homebrew-tap/receipts
brew install --cask AungMyoKyaw/homebrew-tap/rusty-pomodoro
brew install --cask AungMyoKyaw/homebrew-tap/chatgpt-controller
```

### chatgpt-controller

[ChatGPT Controller](https://aungmyokyaw.github.io/chatgpt-controller-desktop/) v0.1.0 is available for Apple Silicon Macs. Install with `brew install --cask AungMyoKyaw/homebrew-tap/chatgpt-controller` or download the verified ZIP from [GitHub Releases](https://github.com/AungMyoKyaw/chatgpt-controller-desktop/releases/tag/v0.1.0). Google Chrome and Playwright CLI are required separately. The app is ad-hoc signed but not notarized. The cask recursively removes quarantine from the installed app during postflight (nonfatal if the attribute is already absent). If macOS still blocks launch, approve it in Privacy & Security. Existing installations should run brew reinstall --cask AungMyoKyaw/homebrew-tap/chatgpt-controller to apply the hook.

### rusty-pomodoro

Rusty Pomodoro requires macOS 11 or later. The cask selects the Apple Silicon or Intel v1.0.1 app bundle and verifies its SHA256 checksum. The app is ad-hoc signed, not Apple Developer ID signed or notarized; the cask removes quarantine during install. `brew uninstall --cask --zap AungMyoKyaw/homebrew-tap/rusty-pomodoro` also removes local settings and history.

### receipts

[Receipts](https://aungmyokyaw.github.io/receipts/) requires macOS 13.3 or later. The cask selects the Apple Silicon or Intel DMG and verifies its SHA256 checksum. No Bun, Rust or Xcode installation is needed.

Builds are ad-hoc signed, not Apple Developer ID signed or notarized. The cask recursively removes the quarantine attribute from the installed app. Existing installations need the updated tap and a reinstall:

```bash
brew update
brew reinstall --cask aungmyokyaw/tap/receipts
```

If macOS still blocks the first launch, use **System Settings → Privacy & Security → Open Anyway** for Receipts.

Regular uninstall keeps sessions. `brew uninstall --cask --zap AungMyoKyaw/homebrew-tap/receipts` also removes the local database and saved sessions.

## Updating

```bash
brew update
brew upgrade AungMyoKyaw/homebrew-tap/<name>
```

Use `--cask` after `brew upgrade` for casks.

## Uninstalling

```bash
brew uninstall AungMyoKyaw/homebrew-tap/<name>
brew untap AungMyoKyaw/homebrew-tap
```

## Contributing

Contributions are welcome. Please open a pull request with a focused change and include relevant validation steps.

## Security

This tap distributes binaries from each package's upstream releases. Installer checksums are pinned in the corresponding formula or cask. Signing and notarization depend on the package; Receipts and Rusty Pomodoro are ad-hoc signed and not notarized. Binaries are:

- Built from open-source code
- Signed and notarized when applicable
- SHA256 verified during installation

If you discover a security vulnerability, please report it by creating an issue in the respective repository.

## License

The formulas and casks reference software under their respective licenses. The `reminder` formula references MIT-licensed software. The `receipts` and `rusty-pomodoro` casks reference software licensed under AGPL-3.0-or-later.

## Maintainer

[@AungMyoKyaw](https://github.com/AungMyoKyaw)

## Links

- [Apple Reminders CLI Repository](https://github.com/AungMyoKyaw/apple-reminders-cli)
- [Homebrew Documentation](https://docs.brew.sh/)
