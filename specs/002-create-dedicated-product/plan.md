# Implementation Plan: Reminder Product Page

**Branch**: `002-create-dedicated-product` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-create-dedicated-product/spec.md`

## Summary

Create a new static HTML product page (`reminder.html`) for the reminder Homebrew formula, sharing the existing bento-grid design system from `index.html` and `corenote.html`. Update `index.html` to add a navigation card/link to the new product page. The page must be responsive, accessible, and self-contained.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)
**Primary Dependencies**: None (pure static files)
**Storage**: N/A
**Testing**: Manual browser testing + Lighthouse audit
**Target Platform**: GitHub Pages (all modern browsers)
**Project Type**: Static website
**Performance Goals**: First Contentful Paint < 1.5s, no render-blocking resources
**Constraints**: Must work without a build step; must match existing visual design exactly
**Scale/Scope**: Single new HTML file + minor modifications to `index.html`

## Constitution Check

*No constitution violations. The feature is a minimal static page addition that reuses existing design patterns.*

## Project Structure

### Documentation (this feature)

```text
specs/002-create-dedicated-product/
├── spec.md              # Feature specification
├── plan.md              # This file
├── tasks.md             # Task breakdown
└── checklists/
    └── ux.md            # UX quality checklist
```

### Source Code (repository root)

```text
/
├── index.html           # Updated: add reminder navigation card
├── corenote.html        # Existing: corenote product detail page
├── reminder.html        # New: reminder product detail page
├── Formula/
│   ├── corenote.rb
│   └── reminder.rb
└── README.md
```

**Structure Decision**: The repository root serves as the GitHub Pages document root. Adding `reminder.html` at the root makes it accessible at `/reminder.html`.

## Design Decisions

1. **Single File Approach**: `reminder.html` will be a self-contained HTML file with inline CSS (copied from `index.html`/`corenote.html`) and inline JavaScript. This matches the existing architecture and avoids HTTP requests for stylesheets.
2. **Shared CSS Custom Properties**: The same `:root` variables, fonts, and animations from `index.html` and `corenote.html` will be duplicated into `reminder.html` to ensure pixel-perfect consistency.
3. **Bento-Grid Layout**: The product page will use the same 6-column bento-grid but adapted for product storytelling (hero, install command, features, metadata, back navigation).
4. **Index.html Update**: Add a clickable reminder card that links to `reminder.html` alongside the existing corenote card.
5. **Formula-Driven Content**: Page content (description, version, system requirements) is sourced directly from `Formula/reminder.rb`.

## Complexity Tracking

> No complexity violations.
