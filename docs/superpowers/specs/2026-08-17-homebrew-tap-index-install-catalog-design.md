# Homebrew Tap Install Catalog Design

## Goal

Turn the root homepage into a trustworthy, install-first catalog for the six packages in this tap while preserving its dark orange/green maker identity.

## Design direction

The page should feel like a well-made macOS utility shelf: dark, precise, slightly opinionated, and useful within five seconds. The primary journey is:

1. Understand that this is a Homebrew tap for macOS tools.
2. Copy the tap command once.
3. Choose a formula or cask.
4. Copy that package's exact install command.
5. Open the package detail page or README only when more context is needed.

The bento dashboard is replaced with a single hero/install panel and structured package rows. Orange identifies command-line formulae, green identifies desktop casks, and yellow is reserved for primary actions. No gradient text, elastic easing, decorative morphing, or fake live status.

## Page structure

- Accessible header with skip link, site identity, package/install navigation, README, and GitHub profile.
- Hero with a direct claim, a concise explanation of Formulae vs Casks, and a two-step install panel.
- Package summary derived from the six package rows instead of a separate hero-metric card.
- Formulae and Casks sections using package rows with name, version, description, tags, detail link, and copyable install command.
- About-this-tap panel that explains what the tap contains and uses a catalog snapshot label instead of claiming live operational status.
- Footer with maintainer and source links.

## Interaction and accessibility

- Every copy action is a real button with an accessible name.
- Commands remain selectable text if clipboard APIs are unavailable.
- Copy success and failure are announced through an aria-live region.
- Keyboard focus is visible, touch targets are at least 44px, and links expose clear focus states.
- Reduced motion disables non-essential transitions.
- Long commands wrap instead of truncating or forcing horizontal overflow.

## Data consistency

The homepage will show the six packages represented by Formula/*.rb and Casks/*.rb. README.md will include both formulas and all four casks. The existing versions and descriptions are retained from the tap files and current homepage. The page does not claim that endpoints are online because no runtime health check exists.

## Verification

- A built-in Node test checks required content and rejects the previous anti-patterns.
- The same test compares homepage versions with Formula/*.rb and Casks/*.rb.
- Impeccable's detector runs against index.html.
- HTML is parsed for balanced structure and no inline onclick handlers.
- Responsive CSS is checked at 320px, 768px, and 1440px through source-level assertions because no browser runtime is available in this environment.
