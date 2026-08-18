# Tasks: Corenote Product Page

**Input**: Design documents from `/specs/001-corenote-product-page/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Setup

- [x] T001 [P] Create feature branch `001-corenote-product-page`

## Phase 2: Foundational

*No foundational infrastructure needed — this is a static HTML addition to an existing GitHub Pages site.*

**Checkpoint**: Foundation ready

## Phase 3: User Story 1 - View Corenote Product Details (Priority: P1) 🎯 MVP

**Goal**: Create `corenote.html` as a standalone product detail page with install command, metadata, and responsive bento-grid layout.

**Independent Test**: Open `corenote.html` in a browser; verify content renders, copy-to-clipboard works, and layout is responsive.

### Implementation for User Story 1

- [x] T002 [US1] Create `corenote.html` with shared design system (colors, fonts, animations from `index.html`)
- [x] T003 [US1] Add hero section with product name, description, and install command block
- [x] T004 [US1] Add copy-to-clipboard JavaScript with toast feedback
- [x] T005 [US1] Add metadata cards (version, architecture, license, requirements)
- [x] T006 [US1] Ensure responsive layout across 320px–1440px viewports

**Checkpoint**: `corenote.html` is fully functional and testable independently

## Phase 4: User Story 2 - Navigate Between Tap Homepage and Product Page (Priority: P2)

**Goal**: Link `index.html` to `corenote.html` and provide back-navigation from the product page.

**Independent Test**: Click through from `index.html` to `corenote.html` and back.

### Implementation for User Story 2

- [x] T007 [US2] Update `index.html` header/logo to link back to itself (if not already)
- [x] T008 [US2] Add corenote formula card to `index.html` bento-grid with link to `corenote.html`
- [x] T009 [US2] Update total formulae count in `index.html` from "01" to "02"

**Checkpoint**: Navigation between pages works in both directions

## Phase 5: User Story 3 - Consistent Visual Design (Priority: P3)

**Goal**: Ensure `corenote.html` matches the existing design language exactly.

**Independent Test**: Visual comparison of `index.html` and `corenote.html` shows no discrepancies in colors, typography, or animations.

### Implementation for User Story 3

- [x] T010 [US3] Audit CSS custom properties, font imports, border radius, and hover effects for parity
- [x] T011 [US3] Run Lighthouse accessibility audit; fix any score below 90

**Checkpoint**: Design consistency verified

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T012 [P] Manual cross-browser test (Chrome, Safari, Firefox)
- [x] T013 Validate all links work correctly
- [x] T014 Commit changes with conventional commit message

---

## Dependencies & Execution Order

- T002 → T003 → T004 → T005 → T006 (US1 sequential)
- T007, T008, T009 (US2 sequential, depends on T002-T006)
- T010, T011 (US3, can run after T007-T009)
- T012, T013, T014 (Polish, run after all US complete)
