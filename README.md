# AungMyoKyaw's Homebrew Tap

> **Visit the website:** [https://aungmyokyaw.github.io/homebrew-tap/](https://aungmyokyaw.github.io/homebrew-tap/)

Personal Homebrew tap for CLI tools and utilities.

## Prerequisites

- [Homebrew](https://brew.sh/) installed on your system
- macOS (Apple Silicon or Intel)

## How to Install

Add this tap to your Homebrew installation:

```bash
brew tap AungMyoKyaw/homebrew-tap
```

Install the Apple Reminders CLI:

```bash
brew install AungMyoKyaw/homebrew-tap/reminder
```

## Available Formulas

| Formula | Description | Version |
|---------|-------------|---------|
| `reminder` | A powerful Swift command-line interface for Apple Reminders with full EventKit integration | v3.0.4 |

### reminder

A native macOS command-line tool for interacting with Apple Reminders. Built with Swift and EventKit for seamless integration with the macOS ecosystem.

**Features:**
- Full EventKit integration
- Native Swift performance
- Terminal-first design

## Usage

After installing `reminder`, you can use it from the command line:

```bash
# Show help
reminder --help

# Show version
reminder --version

# Create a new reminder
reminder add "Buy groceries"

# List all reminders
reminder list
```

For more usage information, see the [apple-reminders-cli repository](https://github.com/AungMyoKyaw/apple-reminders-cli).

## Troubleshooting

### Permission Issues

If you encounter permission issues after installation:

```bash
# Ensure the binary is executable
chmod +x "$(brew --prefix)/bin/reminder"
```

### Quarantine Attribute

The formula automatically removes the macOS quarantine attribute during installation. If you still see security warnings:

```bash
# Manually remove quarantine
xattr -d com.apple.quarantine "$(brew --prefix)/bin/reminder"
```

### EventKit Permissions

On first run, macOS will prompt you to grant Terminal (or your terminal emulator) access to reminders. Click "Allow" to enable the CLI to work with your reminders.

## Updating

To update to the latest version:

```bash
brew update
brew upgrade AungMyoKyaw/homebrew-tap/reminder
```

## Uninstalling

To uninstall:

```bash
brew uninstall AungMyoKyaw/homebrew-tap/reminder
```

To remove the tap entirely:

```bash
brew untap AungMyoKyaw/homebrew-tap
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This tap distributes pre-compiled binaries from the official [apple-reminders-cli releases](https://github.com/AungMyoKyaw/apple-reminders-cli/releases). All binaries are:

- Built from open-source code
- Signed and notarized (when applicable)
- SHA256 verified during installation

If you discover a security vulnerability, please report it by creating an issue in the respective repository.

## License

The formulas in this tap reference software under their respective licenses. The `reminder` formula references software licensed under the MIT License.

## Maintainer

- [@AungMyoKyaw](https://github.com/AungMyoKyaw)

## Links

- [Apple Reminders CLI Repository](https://github.com/AungMyoKyaw/apple-reminders-cli)
- [Homebrew Documentation](https://docs.brew.sh/)
