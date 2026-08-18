# AungMyoKyaw / homebrew-tap

> **Live site:** [aungmyokyaw.github.io/homebrew-tap](https://aungmyokyaw.github.io/homebrew-tap/)

A personal Homebrew tap for six small macOS tools (2 formulae, 4 casks). All MIT licensed, all installed and updated through Homebrew.

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

## Maintainer

[@AungMyoKyaw](https://github.com/AungMyoKyaw)