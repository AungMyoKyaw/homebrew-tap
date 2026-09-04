# Spec: Refresh Dhamma Echo Cask

**Path**: `docs/specs/2026-09-04-refresh-dhamma-cask.md`
**Created**: 2026-09-04
**Status**: done

## Problem

The published Dhamma Echo release is v0.5.10, but the tap's `dhamma-echo` cask still points to v0.5.9. The tap homepage is also stale and currently reports v0.5.5; its existing version-synchronization test is already failing against the cask.

## Goals

- Update the cask to v0.5.10 with SHA256 values computed from the verified GitHub arm64 and Intel DMG assets.
- Synchronize the Dhamma Echo version shown in `README.md` and `index.html` with the cask.
- Add regression coverage for the cask release metadata and documentation synchronization.
- Pass the tap's Node test suite and Homebrew cask audit/style checks.
- Prove the updated cask installs or reinstalls successfully on this Mac, verify the installed app bundle, commit the changes, and push them to `origin/master`.

## Non-goals

- No changes to the Dhamma Echo application repository or its release workflow.
- No changes to other formulae, casks, or unrelated tap website content.
- No release creation, asset replacement, or modification of the installed app beyond the requested cask install/reinstall test.

## Design

### Stack / framework

The tap uses Homebrew Ruby casks and a dependency-free static HTML site. Existing tests use Node's built-in `node:test` runner with strict Node assertions. Validation will use the Homebrew CLI and GitHub CLI (`gh`).

### Key decisions

- **Use the published v0.5.10 release assets**: `gh release view` has confirmed that both `Dhamma.Echo_0.5.10_aarch64.dmg` and `Dhamma.Echo_0.5.10_x64.dmg` exist in a non-draft, non-prerelease release. Tradeoff: the cask remains tied to the release's architecture-specific DMG naming convention.
- **Update all existing version references**: the README and homepage must follow the cask so users see the installable version and the existing homepage test remains meaningful. Tradeoff: the homepage's previously stale v0.5.5 display is corrected as part of this focused metadata update.
- **Test the local cask before pushing**: install/reinstall from the checked-out cask, then verify Homebrew's installed version and `/Applications/Dhamma Echo.app`. Tradeoff: this performs a real application replacement if v0.5.9 is currently installed.

### Files affected

- `Casks/dhamma-echo.rb` — update version and architecture-specific SHA256 values.
- `README.md` — update the Dhamma Echo cask version.
- `index.html` — update the Dhamma Echo package version displayed on the tap homepage.
- `tests/dhamma-echo-cask.test.mjs` — add release metadata and documentation synchronization regression tests.
- `docs/specs/2026-09-04-refresh-dhamma-cask.md` — record the approved implementation and verification plan.

## Tasks

- [x] **T1 (red)**: Add a failing Node test that expects v0.5.10, the verified arm64/Intel DMG URLs and checksums, and matching README/homepage versions; the test failed against the existing v0.5.9 cask and stale documentation.
- [x] **T2 (green)**: Update the cask, README, and homepage metadata so the new regression test passes.
- [x] **T3 (refactor)**: Keep the regression test focused and readable, run the complete Node test suite again, and make no behavior changes.
- [x] **T4 (commit)**: Run Homebrew audit/style checks, perform the real cask install/reinstall and app-bundle verification, create a conventional commit, and push `origin/master`.

## Verification

- `gh release download v0.5.10` downloaded both DMGs; their SHA256 values match the cask.
- `node --test tests/*.test.mjs` passed all 7 tests.
- `git diff --check` passed.
- `brew style Casks/dhamma-echo.rb` reported no offenses.
- `brew audit --cask --online aungmyokyaw/tap/dhamma-echo` passed against the updated cask.
- After `brew update`, the tap resolved to commit `d0bbcc4` and reported cask version `0.5.10`.
- `brew reinstall --cask aungmyokyaw/tap/dhamma-echo` succeeded; `brew list --cask --versions dhamma-echo` reported `0.5.10`, and the installed app bundle reported `CFBundleShortVersionString` `0.5.10`.
- Commit `d0bbcc4` was pushed to `origin/master`.

## Open questions

None.
