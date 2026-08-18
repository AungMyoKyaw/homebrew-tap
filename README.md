# AungMyoKyaw / homebrew-tap

> **Live site:** [aungmyokyaw.github.io/homebrew-tap](https://aungmyokyaw.github.io/homebrew-tap/)

A personal Homebrew tap for six small macOS tools (2 formulae, 4 casks). All MIT licensed, all installed and updated through Homebrew.

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
| caffeinate | v2.1.0 | Keep your Mac awake during long builds, downloads, renders, and remote sessions |
| dhamma-echo | v0.5.5 | A quiet desktop library for Dhamma talks. Listen offline, mindfully |

```bash
brew install --cask AungMyoKyaw/homebrew-tap/git-ingest
brew install --cask AungMyoKyaw/homebrew-tap/gitfolio
brew install --cask AungMyoKyaw/homebrew-tap/caffeinate
brew install --cask AungMyoKyaw/homebrew-tap/dhamma-echo
```

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

## License

The formulas in this tap reference software under their respective licenses. The `reminder` formula references software licensed under the MIT License.

## Maintainer

[@AungMyoKyaw](https://github.com/AungMyoKyaw)

## Links

- [Apple Reminders CLI Repository](https://github.com/AungMyoKyaw/apple-reminders-cli)
- [Homebrew Documentation](https://docs.brew.sh/)
