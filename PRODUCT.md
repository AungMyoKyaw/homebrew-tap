# Product

## Register

brand

## Users

Developers and power users on macOS who already use Homebrew and want dependable native desktop apps and CLI utilities. They scan, copy the exact `brew install` command, and move on.

## Product Purpose

Personal Homebrew tap distributing macOS tools (currently 8 desktop casks and 2 CLI formulae). The site (`index.html`, `reminder.html`, `corenote.html`) is generated directly from `Formula/*.rb` and `Casks/*.rb` via `bun scripts/build-site.ts` so versions and packages never drift.

## Brand Personality

Warm Technical · Homebrew-native · Honest. Dual-theme parity (Warm Paper Light `#F7F5F0` and Obsidian Dark `#0E1012`) with Homebrew amber (`#D97706` / `#F59E0B`) accent and bespoke geometric VectorCraft icons.

## Visual Master

- FigCraft master: `design/homebrew-tap.figcraft` (generated via `design/build-figcraft.ts`)
- VectorCraft icons: `design/icons/*.vectorcraft` and `*.svg` (generated via `design/build-icons.ts`)

## Design Principles

1. Zero decorative JS bloat — plain static HTML/CSS/JS generated from the tap source files.
2. Split catalog hierarchy: 2-column architectural grid for desktop casks with expandable signing/quarantine notes; full-width spec rows for CLI formulae linking to dedicated docs pages.
3. One-click copy on every install command with `aria-live="polite"` feedback and clipboard fallback.
4. Accessible by default: WCAG 2.1 AA contrast in both light and dark modes, `:focus-visible` rings, keyboard shortcuts (`⌘K`), and `prefers-reduced-motion` support.
