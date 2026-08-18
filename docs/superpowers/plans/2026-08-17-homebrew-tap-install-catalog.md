# Homebrew Tap Install Catalog Implementation Plan

> For agentic workers: implement this plan task-by-task with verification checkpoints.

**Goal:** Replace the dashboard-like homepage with an accessible install catalog and synchronize the README inventory.

**Architecture:** Keep the project static and framework-free. Make index.html the complete page surface with shared CSS tokens, semantic package rows, and a small progressive-enhancement script for copy feedback and derived counts. Keep the existing reminder.html and corenote.html detail links.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, Node built-in test runner.

---

### Task 1: Add regression tests before changing the page

**Files:**

- Create: tests/index-html.test.mjs

- [ ] Write tests for six package rows, accessible copy buttons, no inline onclick handlers, no gradient text, no elastic easing, reduced-motion support, and README coverage for corenote.

- [ ] Run node --test tests/index-html.test.mjs.

Expected result before implementation: the suite fails because the current page has bento-only markup, inline onclick handlers, gradient text, elastic easing, no reduced-motion media query, and the README omits corenote.

### Task 2: Replace index.html with the install-first catalog

**Files:**

- Modify: index.html

- [ ] Replace the current 837-line bento layout with semantic header, hero/install panel, package sections, about panel, and footer.

- [ ] Preserve all six package names, versions, descriptions, tags, commands, and existing detail-page links.

- [ ] Use system-first typography, solid surfaces, restrained radii, solid accents, and short ease-out transitions.

- [ ] Add responsive rules for 320px, 768px, and 1440px widths, visible focus states, selectable wrapping commands, and prefers-reduced-motion.

- [ ] Implement copy buttons with a shared data-copy-command handler, Clipboard API success, textarea fallback, failure feedback, and aria-live announcements.

### Task 3: Synchronize README inventory

**Files:**

- Modify: README.md

- [ ] Add corenote to the formula list and add its install command.

- [ ] Keep the existing four cask entries and installation examples.

### Task 4: Run verification and refine

**Files:**

- Modify: index.html
- Modify: README.md
- Test: tests/index-html.test.mjs

- [ ] Run node --test tests/index-html.test.mjs and require zero failures.

- [ ] Run node --check tests/index-html.test.mjs.

- [ ] Run node --check against the inline script extracted from index.html.

- [ ] Run Impeccable's detector against index.html and remove any newly introduced findings.

- [ ] Parse index.html with a local DOM-capable or structural check and confirm six package commands and no horizontal-overflow patterns.

- [ ] Review the final diff, ensure no user changes were overwritten, and report any browser-runtime verification limitation.
