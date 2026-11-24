import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DESIGN_DIR = "/Users/aungmyokyaw/my-home/projects/life/homebrew-tap/design";
const EXPORTS_DIR = join(DESIGN_DIR, "exports");
mkdirSync(EXPORTS_DIR, { recursive: true });

type Cmd = { command: string; params: Record<string, unknown> };

interface Theme {
  name: string;
  bg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentBg: string;
  accentText: string;
  termBg: string;
  termBorder: string;
  termText: string;
  termPrompt: string;
  success: string;
  successBg: string;
}

const LIGHT: Theme = {
  name: "Light",
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EFECE5",
  border: "#E4DFD5",
  borderStrong: "#D1C9BA",
  text: "#18181B",
  textMuted: "#57534E",
  textSubtle: "#78716C",
  accent: "#D97706",
  accentBg: "#FEF3C7",
  accentText: "#92400E",
  termBg: "#18181B",
  termBorder: "#27272A",
  termText: "#F4F4F5",
  termPrompt: "#F59E0B",
  success: "#059669",
  successBg: "#D1FAE5",
};

const DARK: Theme = {
  name: "Dark",
  bg: "#0E1012",
  surface: "#15181C",
  surfaceMuted: "#1C2026",
  border: "#262B33",
  borderStrong: "#353C47",
  text: "#F4F4F5",
  textMuted: "#A1A1AA",
  textSubtle: "#71717A",
  accent: "#F59E0B",
  accentBg: "#2E210B",
  accentText: "#FCD34D",
  termBg: "#090A0C",
  termBorder: "#23272F",
  termText: "#E4E4E7",
  termPrompt: "#F59E0B",
  success: "#10B981",
  successBg: "#0A2B20",
};

interface Pkg {
  id: string;
  name: string;
  version: string;
  kind: "cask" | "formula";
  arch: string;
  macos: string;
  desc: string;
  cmd: string;
  badge?: string;
  glyphLabel: string;
  expandedNote?: string;
}

const CASKS: Pkg[] = [
  {
    id: "life-manager",
    name: "Life Manager",
    version: "v0.1.0",
    kind: "cask",
    arch: "arm64",
    macos: "macOS 13+",
    desc: "Local-first GPUI productivity app for tasks, calendar, focus, habits, and goals + life CLI.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/life-manager",
    glyphLabel: "LM",
    expandedNote: "Ad-hoc signed · quarantine auto-cleared on install · includes `life` CLI binary · --zap removes SQLite DB.",
  },
  {
    id: "chatgpt-controller",
    name: "ChatGPT Controller",
    version: "v0.3.0",
    kind: "cask",
    arch: "arm64",
    macos: "macOS",
    desc: "Native Rust local API controller with embedded ChatGPT sign-in. Zero external Chrome needed.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/chatgpt-controller",
    glyphLabel: "CC",
  },
  {
    id: "dhamma-echo",
    name: "Dhamma Echo",
    version: "v0.6.0",
    kind: "cask",
    arch: "arm64",
    macos: "macOS 13+",
    desc: "Fast, private native GPUI desktop library for Dhamma talks. Listen offline, mindfully.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/dhamma-echo",
    glyphLabel: "DE",
  },
  {
    id: "receipts",
    name: "Receipts",
    version: "v0.1.0",
    kind: "cask",
    arch: "arm64 · x64",
    macos: "macOS 13.3+",
    desc: "Local-first menu-bar time tracker with sessions, weekly calendar, and statistics.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/receipts",
    glyphLabel: "RC",
  },
  {
    id: "rusty-pomodoro",
    name: "Rusty Pomodoro",
    version: "v1.0.1",
    kind: "cask",
    arch: "arm64 · x64",
    macos: "macOS 11+",
    desc: "Focused Pomodoro timer with sessions, breaks, themes, and statistics.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/rusty-pomodoro",
    glyphLabel: "RP",
  },
  {
    id: "caffeinate",
    name: "Caffeinate",
    version: "v3.0.0",
    kind: "cask",
    arch: "Universal",
    macos: "macOS 12+",
    desc: "Keep your Mac awake during long builds, downloads, renders, and remote sessions.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/caffeinate",
    glyphLabel: "CF",
  },
  {
    id: "gitfolio",
    name: "GitFolio",
    version: "v1.0.2",
    kind: "cask",
    arch: "arm64 · x64",
    macos: "macOS",
    desc: "Git contribution portfolio exporter for macOS. Turn local commit history into visual reports.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/gitfolio",
    glyphLabel: "GF",
  },
  {
    id: "git-ingest",
    name: "Git-Ingest",
    version: "v0.2.7",
    kind: "cask",
    arch: "arm64 · x64",
    macos: "macOS",
    desc: "Secure desktop app that bundles any repository into clean, structured LLM context.",
    cmd: "brew install --cask AungMyoKyaw/homebrew-tap/git-ingest",
    glyphLabel: "GI",
  },
];

const FORMULAE: Pkg[] = [
  {
    id: "reminder",
    name: "reminder",
    version: "v3.0.4",
    kind: "formula",
    arch: "MIT",
    macos: "EventKit",
    desc: "Native Swift CLI for Apple Reminders with full EventKit integration.",
    cmd: "brew install AungMyoKyaw/homebrew-tap/reminder",
    glyphLabel: ">_",
  },
  {
    id: "corenote",
    name: "corenote",
    version: "v0.1.0",
    kind: "formula",
    arch: "MIT",
    macos: "SQLite",
    desc: "CLI frontend to Apple Notes via direct local SQLite access.",
    cmd: "brew install AungMyoKyaw/homebrew-tap/corenote",
    glyphLabel: "DB",
  },
];

const cmds: Cmd[] = [];
const SANS = "Inter";
const MONO = "JetBrains Mono";

function rect(
  parent: number,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  props: Record<string, unknown> = {}
) {
  cmds.push({
    command: "node.create",
    params: { type: "rectangle", parent, name, x, y, width, height, props },
  });
}

function text(
  parent: number,
  name: string,
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
  props: Record<string, unknown> = {}
) {
  cmds.push({
    command: "node.create",
    params: {
      type: "text",
      parent,
      name,
      text: content,
      x,
      y,
      width,
      height,
      props: { fontFamily: SANS, ...props },
    },
  });
}

function pill(
  parent: number,
  name: string,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  bg: string,
  fg: string,
  border?: string,
  mono = true
) {
  rect(parent, `${name}-bg`, x, y, w, h, {
    fill: bg,
    cornerRadius: 6,
    ...(border ? { stroke: border, strokeWeight: 1 } : {}),
  });
  text(parent, `${name}-txt`, label, x + 8, y + Math.floor((h - 15) / 2), w - 16, 16, {
    fontFamily: mono ? MONO : SANS,
    fontSize: 11,
    fontStyle: "Medium",
    fill: fg,
    textAlign: "center",
  });
}

function buildDesktop(frameName: number, _offsetX: number, t: Theme, showCopiedOnFirst = false) {
  const W = 1440;
  const CX = 160;
  const CW = 1120;

  // Top navigation bar
  rect(frameName, "topbar-bg", 0, 0, W, 64, { fill: t.surface });
  rect(frameName, "topbar-border", 0, 63, W, 1, { fill: t.border });

  // Brand mark + repo title
  rect(frameName, "brand-mark", CX, 16, 32, 32, { fill: t.accent, cornerRadius: 8 });
  text(frameName, "brand-mark-glyph", ">_", CX + 5, 23, 22, 18, {
    fontFamily: MONO,
    fontSize: 13,
    fontStyle: "Bold",
    fill: "#FFFFFF",
    textAlign: "center",
  });
  text(frameName, "brand-title", "AungMyoKyaw / homebrew-tap", CX + 44, 21, 320, 22, {
    fontFamily: MONO,
    fontSize: 15,
    fontStyle: "SemiBold",
    fill: t.text,
  });

  // Top nav links + theme toggle
  const navX = CX + CW - 360;
  text(frameName, "nav-casks", "Casks", navX, 23, 56, 18, { fontSize: 13, fontStyle: "Medium", fill: t.textMuted });
  text(frameName, "nav-formulae", "Formulae", navX + 68, 23, 72, 18, { fontSize: 13, fontStyle: "Medium", fill: t.textMuted });
  text(frameName, "nav-install", "Install", navX + 152, 23, 52, 18, { fontSize: 13, fontStyle: "Medium", fill: t.textMuted });
  text(frameName, "nav-gh", "GitHub ↗", navX + 214, 23, 72, 18, { fontSize: 13, fontStyle: "Medium", fill: t.textMuted });
  pill(
    frameName,
    "theme-toggle",
    t.name === "Light" ? "◐ Dark" : "☀ Light",
    CX + CW - 74,
    18,
    74,
    28,
    t.surfaceMuted,
    t.text,
    t.border,
    false
  );

  // Hero block (compact, high-signal)
  let y = 108;
  pill(frameName, "hero-eyebrow", "PERSONAL HOMEBREW TAP · MACOS", CX, y, 236, 26, t.accentBg, t.accentText);
  y += 40;
  text(frameName, "hero-h1", "Native macOS tools, installed via Homebrew.", CX, y, 860, 48, {
    fontSize: 38,
    fontStyle: "Bold",
    fill: t.text,
    letterSpacing: -0.8,
  });
  y += 54;
  text(
    frameName,
    "hero-sub",
    "8 desktop casks and 2 CLI formulae. SHA256-pinned releases, automatic quarantine cleanup, zero telemetry.",
    CX,
    y,
    820,
    26,
    { fontSize: 16, fill: t.textMuted }
  );
  y += 42;

  // One-click Tap Command Bar
  rect(frameName, "tap-cmd-box", CX, y, CW, 56, {
    fill: t.termBg,
    cornerRadius: 10,
    stroke: t.termBorder,
    strokeWeight: 1,
  });
  text(frameName, "tap-cmd-prompt", "$", CX + 20, y + 18, 16, 20, {
    fontFamily: MONO,
    fontSize: 15,
    fontStyle: "Bold",
    fill: t.termPrompt,
  });
  text(frameName, "tap-cmd-str", "brew tap AungMyoKyaw/homebrew-tap", CX + 40, y + 18, 520, 20, {
    fontFamily: MONO,
    fontSize: 15,
    fill: t.termText,
  });
  pill(
    frameName,
    "tap-cmd-copy",
    "Copy command",
    CX + CW - 134,
    y + 12,
    120,
    32,
    t.accent,
    "#FFFFFF",
    undefined,
    false
  );
  y += 84;

  // Filter & Instant Search Bar
  rect(frameName, "filter-divider", CX, y - 14, CW, 1, { fill: t.border });
  pill(frameName, "flt-all", "All (10)", CX, y, 86, 34, t.text, t.bg, undefined, false);
  pill(frameName, "flt-casks", "Casks (8)", CX + 96, y, 96, 34, t.surface, t.textMuted, t.border, false);
  pill(frameName, "flt-formulae", "Formulae (2)", CX + 202, y, 114, 34, t.surface, t.textMuted, t.border, false);

  rect(frameName, "search-input", CX + CW - 320, y, 320, 34, {
    fill: t.surface,
    cornerRadius: 8,
    stroke: t.border,
    strokeWeight: 1,
  });
  text(frameName, "search-ph", "Filter packages by name or keyword...", CX + CW - 306, y + 9, 250, 18, {
    fontSize: 13,
    fill: t.textSubtle,
  });
  pill(frameName, "search-kbd", "⌘K", CX + CW - 50, y + 6, 40, 22, t.surfaceMuted, t.textSubtle, t.border);
  y += 62;

  // Section 1: Desktop Apps (Casks)
  text(frameName, "sec-casks-title", "DESKTOP APPS — CASKS", CX, y, 300, 20, {
    fontFamily: MONO,
    fontSize: 12,
    fontStyle: "Bold",
    fill: t.textSubtle,
    letterSpacing: 1.2,
  });
  text(frameName, "sec-casks-count", "8 packages · brew install --cask", CX + CW - 260, y, 260, 20, {
    fontFamily: MONO,
    fontSize: 12,
    fill: t.textSubtle,
    textAlign: "right",
  });
  y += 30;

  // 2-column architectural grid (4 rows x 2 cols)
  const GAP = 16;
  const CARD_W = (CW - GAP) / 2; // 552
  const ROW_H_FIRST = 224; // taller first row to show expanded disclosure on Life Manager
  const ROW_H_STD = 178;

  CASKS.forEach((pkg, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = CX + col * (CARD_W + GAP);
    const cy = y + (row === 0 ? 0 : ROW_H_FIRST + GAP + (row - 1) * (ROW_H_STD + GAP));
    const ch = row === 0 ? ROW_H_FIRST : ROW_H_STD;
    const pfx = `cask-${pkg.id}`;

    rect(frameName, `${pfx}-card`, cx, cy, CARD_W, ch, {
      fill: t.surface,
      cornerRadius: 10,
      stroke: idx === 0 ? t.accent : t.border,
      strokeWeight: 1,
    });

    // Glyph container
    rect(frameName, `${pfx}-glyph-bg`, cx + 20, cy + 20, 38, 38, {
      fill: t.surfaceMuted,
      cornerRadius: 8,
      stroke: t.border,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-glyph-txt`, pkg.glyphLabel, cx + 20, cy + 31, 38, 18, {
      fontFamily: MONO,
      fontSize: 13,
      fontStyle: "Bold",
      fill: t.accent,
      textAlign: "center",
    });

    // Title + Version + Arch pills
    text(frameName, `${pfx}-name`, pkg.name, cx + 70, cy + 20, 220, 22, {
      fontSize: 16,
      fontStyle: "SemiBold",
      fill: t.text,
    });
    pill(frameName, `${pfx}-ver`, pkg.version, cx + 70, cy + 44, 62, 20, t.accentBg, t.accentText);
    pill(frameName, `${pfx}-arch`, `${pkg.arch} · ${pkg.macos}`, cx + 138, cy + 44, 152, 20, t.surfaceMuted, t.textMuted);

    // Top-right links
    text(frameName, `${pfx}-link`, "GitHub ↗", cx + CARD_W - 84, cy + 22, 64, 18, {
      fontSize: 12,
      fontStyle: "Medium",
      fill: t.textSubtle,
      textAlign: "right",
    });

    // Description
    text(frameName, `${pfx}-desc`, pkg.desc, cx + 20, cy + 76, CARD_W - 40, 34, {
      fontSize: 13.5,
      fill: t.textMuted,
      lineHeight: 19,
    });

    // Inline command strip
    const cmdY = cy + 120;
    rect(frameName, `${pfx}-cmd-bg`, cx + 20, cmdY, CARD_W - 40, 38, {
      fill: t.termBg,
      cornerRadius: 7,
      stroke: t.termBorder,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-cmd-txt`, `$ ${pkg.cmd}`, cx + 32, cmdY + 11, CARD_W - 140, 16, {
      fontFamily: MONO,
      fontSize: 11.5,
      fill: t.termText,
    });

    const isCopied = showCopiedOnFirst && idx === 0;
    pill(
      frameName,
      `${pfx}-copy`,
      isCopied ? "Copied ✓" : "Copy",
      cx + CARD_W - 106,
      cmdY + 6,
      78,
      26,
      isCopied ? t.success : t.surfaceMuted,
      isCopied ? "#FFFFFF" : t.text,
      isCopied ? undefined : t.border,
      false
    );

    // Expanded note on card 0 to showcase inline disclosure state
    if (pkg.expandedNote) {
      rect(frameName, `${pfx}-note-bg`, cx + 20, cy + 168, CARD_W - 40, 40, {
        fill: t.surfaceMuted,
        cornerRadius: 6,
      });
      text(frameName, `${pfx}-note-txt`, pkg.expandedNote, cx + 30, cy + 176, CARD_W - 60, 26, {
        fontSize: 11.5,
        fill: t.textMuted,
        lineHeight: 15,
      });
    }
  });

  y += ROW_H_FIRST + GAP + 3 * (ROW_H_STD + GAP) + 28;

  // Section 2: CLI Tools (Formulae)
  text(frameName, "sec-formulae-title", "CLI TOOLS — FORMULAE", CX, y, 300, 20, {
    fontFamily: MONO,
    fontSize: 12,
    fontStyle: "Bold",
    fill: t.textSubtle,
    letterSpacing: 1.2,
  });
  text(frameName, "sec-formulae-count", "2 packages · brew install", CX + CW - 260, y, 260, 20, {
    fontFamily: MONO,
    fontSize: 12,
    fill: t.textSubtle,
    textAlign: "right",
  });
  y += 30;

  FORMULAE.forEach((pkg, idx) => {
    const ry = y + idx * 96;
    const pfx = `formula-${pkg.id}`;
    rect(frameName, `${pfx}-row`, CX, ry, CW, 82, {
      fill: t.surface,
      cornerRadius: 10,
      stroke: t.border,
      strokeWeight: 1,
    });
    rect(frameName, `${pfx}-glyph-bg`, CX + 20, ry + 22, 38, 38, {
      fill: t.surfaceMuted,
      cornerRadius: 8,
      stroke: t.border,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-glyph-txt`, pkg.glyphLabel, CX + 20, ry + 33, 38, 18, {
      fontFamily: MONO,
      fontSize: 13,
      fontStyle: "Bold",
      fill: t.accent,
      textAlign: "center",
    });

    text(frameName, `${pfx}-name`, pkg.name, CX + 72, ry + 18, 140, 22, {
      fontFamily: MONO,
      fontSize: 16,
      fontStyle: "Bold",
      fill: t.text,
    });
    pill(frameName, `${pfx}-ver`, pkg.version, CX + 175, ry + 18, 60, 20, t.accentBg, t.accentText);
    pill(frameName, `${pfx}-meta`, `${pkg.arch} · ${pkg.macos}`, CX + 243, ry + 18, 110, 20, t.surfaceMuted, t.textMuted);

    text(frameName, `${pfx}-desc`, pkg.desc, CX + 72, ry + 46, 480, 20, {
      fontSize: 13.5,
      fill: t.textMuted,
    });

    // Right side inline command + Docs link
    rect(frameName, `${pfx}-cmd-bg`, CX + 572, ry + 22, 434, 38, {
      fill: t.termBg,
      cornerRadius: 7,
      stroke: t.termBorder,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-cmd-txt`, `$ ${pkg.cmd}`, CX + 584, ry + 33, 344, 16, {
      fontFamily: MONO,
      fontSize: 11.5,
      fill: t.termText,
    });
    pill(frameName, `${pfx}-copy`, "Copy", CX + 938, ry + 28, 60, 26, t.surfaceMuted, t.text, t.border, false);

    text(frameName, `${pfx}-docs`, "Docs →", CX + CW - 84, ry + 32, 64, 18, {
      fontSize: 13,
      fontStyle: "SemiBold",
      fill: t.accent,
      textAlign: "right",
    });
  });

  y += 224;

  // Footer reference strip (Install / Upgrade / Security)
  rect(frameName, "footer-line", CX, y, CW, 1, { fill: t.border });
  y += 24;
  const colW = (CW - 32) / 3;
  const footerBlocks = [
    {
      title: "UPDATE ALL",
      body: "brew update && brew upgrade\nAdd --cask when upgrading desktop apps.",
    },
    {
      title: "SIGNING & QUARANTINE",
      body: "Binaries are SHA256-pinned. Ad-hoc casks clear com.apple.quarantine in postflight.",
    },
    {
      title: "UNINSTALL & ZAP",
      body: "Use brew uninstall --cask --zap <pkg> to remove local preferences and SQLite data.",
    },
  ];
  footerBlocks.forEach((b, i) => {
    const bx = CX + i * (colW + 16);
    text(frameName, `foot-t-${i}`, b.title, bx, y, colW, 16, {
      fontFamily: MONO,
      fontSize: 11,
      fontStyle: "Bold",
      fill: t.textSubtle,
      letterSpacing: 1,
    });
    text(frameName, `foot-b-${i}`, b.body, bx, y + 22, colW, 40, {
      fontSize: 12.5,
      fill: t.textMuted,
      lineHeight: 18,
    });
  });

  text(frameName, "copyright", "Maintained by @AungMyoKyaw · Generated from Formula/*.rb & Casks/*.rb", CX, y + 86, CW, 18, {
    fontFamily: MONO,
    fontSize: 11.5,
    fill: t.textSubtle,
  });
}

function buildMobile(frameName: number, _offsetX: number, t: Theme) {
  const W = 390;
  const PX = 20;
  const CW = W - PX * 2;

  // Mobile Header
  rect(frameName, "m-top-bg", 0, 0, W, 56, { fill: t.surface });
  rect(frameName, "m-top-border", 0, 55, W, 1, { fill: t.border });
  rect(frameName, "m-mark", PX, 14, 28, 28, { fill: t.accent, cornerRadius: 7 });
  text(frameName, "m-mark-g", ">_", PX + 4, 20, 20, 16, {
    fontFamily: MONO,
    fontSize: 11,
    fontStyle: "Bold",
    fill: "#FFFFFF",
    textAlign: "center",
  });
  text(frameName, "m-title", "homebrew-tap", PX + 38, 19, 160, 20, {
    fontFamily: MONO,
    fontSize: 14,
    fontStyle: "SemiBold",
    fill: t.text,
  });
  pill(frameName, "m-theme", "◐ Dark", W - PX - 68, 14, 68, 28, t.surfaceMuted, t.text, t.border, false);

  let y = 80;
  text(frameName, "m-h1", "Native macOS tools,\nvia Homebrew.", PX, y, CW, 68, {
    fontSize: 26,
    fontStyle: "Bold",
    fill: t.text,
    lineHeight: 32,
  });
  y += 74;
  text(frameName, "m-sub", "8 desktop casks · 2 CLI formulae · SHA256 pinned.", PX, y, CW, 20, {
    fontSize: 13.5,
    fill: t.textMuted,
  });
  y += 34;

  // Tap command box
  rect(frameName, "m-tap-bg", PX, y, CW, 50, {
    fill: t.termBg,
    cornerRadius: 8,
    stroke: t.termBorder,
    strokeWeight: 1,
  });
  text(frameName, "m-tap-str", "$ brew tap AungMyoKyaw/homebrew-tap", PX + 12, y + 17, CW - 84, 16, {
    fontFamily: MONO,
    fontSize: 10.5,
    fill: t.termText,
  });
  pill(frameName, "m-tap-copy", "Copy", W - PX - 62, y + 11, 52, 28, t.accent, "#FFFFFF", undefined, false);
  y += 68;

  // Filter pills
  pill(frameName, "m-f-all", "All (10)", PX, y, 76, 30, t.text, t.bg, undefined, false);
  pill(frameName, "m-f-casks", "Casks (8)", PX + 84, y, 86, 30, t.surface, t.textMuted, t.border, false);
  pill(frameName, "m-f-form", "Formulae (2)", PX + 178, y, 102, 30, t.surface, t.textMuted, t.border, false);
  y += 48;

  text(frameName, "m-sec-casks", "DESKTOP APPS — CASKS (8)", PX, y, CW, 16, {
    fontFamily: MONO,
    fontSize: 11,
    fontStyle: "Bold",
    fill: t.textSubtle,
  });
  y += 24;

  // Show first 4 casks stacked
  CASKS.slice(0, 4).forEach((pkg, idx) => {
    const cy = y + idx * 164;
    const pfx = `m-c-${pkg.id}`;
    rect(frameName, `${pfx}-card`, PX, cy, CW, 150, {
      fill: t.surface,
      cornerRadius: 10,
      stroke: t.border,
      strokeWeight: 1,
    });
    rect(frameName, `${pfx}-g`, PX + 14, cy + 14, 32, 32, {
      fill: t.surfaceMuted,
      cornerRadius: 7,
      stroke: t.border,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-gt`, pkg.glyphLabel, PX + 14, cy + 23, 32, 16, {
      fontFamily: MONO,
      fontSize: 11,
      fontStyle: "Bold",
      fill: t.accent,
      textAlign: "center",
    });
    text(frameName, `${pfx}-n`, pkg.name, PX + 56, cy + 14, 180, 18, {
      fontSize: 15,
      fontStyle: "SemiBold",
      fill: t.text,
    });
    pill(frameName, `${pfx}-v`, pkg.version, PX + 56, cy + 35, 56, 18, t.accentBg, t.accentText);
    pill(frameName, `${pfx}-a`, pkg.arch, PX + 118, cy + 35, 96, 18, t.surfaceMuted, t.textMuted);

    text(frameName, `${pfx}-d`, pkg.desc, PX + 14, cy + 62, CW - 28, 32, {
      fontSize: 12.5,
      fill: t.textMuted,
      lineHeight: 16,
    });
    rect(frameName, `${pfx}-cb`, PX + 14, cy + 104, CW - 28, 34, {
      fill: t.termBg,
      cornerRadius: 6,
    });
    text(frameName, `${pfx}-ct`, `$ brew install --cask .../${pkg.id}`, PX + 22, cy + 114, CW - 104, 14, {
      fontFamily: MONO,
      fontSize: 10.5,
      fill: t.termText,
    });
    pill(frameName, `${pfx}-cp`, "Copy", W - PX - 72, cy + 109, 50, 24, t.surfaceMuted, t.text, t.border, false);
  });

  y += 4 * 164 + 16;
  text(frameName, "m-sec-form", "CLI TOOLS — FORMULAE (2)", PX, y, CW, 16, {
    fontFamily: MONO,
    fontSize: 11,
    fontStyle: "Bold",
    fill: t.textSubtle,
  });
  y += 24;

  FORMULAE.forEach((pkg, idx) => {
    const cy = y + idx * 140;
    const pfx = `m-f-${pkg.id}`;
    rect(frameName, `${pfx}-card`, PX, cy, CW, 126, {
      fill: t.surface,
      cornerRadius: 10,
      stroke: t.border,
      strokeWeight: 1,
    });
    text(frameName, `${pfx}-n`, `${pkg.name}  ${pkg.version}`, PX + 14, cy + 14, 220, 18, {
      fontFamily: MONO,
      fontSize: 14,
      fontStyle: "Bold",
      fill: t.text,
    });
    text(frameName, `${pfx}-docs`, "Docs →", W - PX - 74, cy + 14, 60, 18, {
      fontSize: 12,
      fontStyle: "SemiBold",
      fill: t.accent,
      textAlign: "right",
    });
    text(frameName, `${pfx}-d`, pkg.desc, PX + 14, cy + 38, CW - 28, 32, {
      fontSize: 12.5,
      fill: t.textMuted,
      lineHeight: 16,
    });
    rect(frameName, `${pfx}-cb`, PX + 14, cy + 80, CW - 28, 34, {
      fill: t.termBg,
      cornerRadius: 6,
    });
    text(frameName, `${pfx}-ct`, `$ brew install .../${pkg.id}`, PX + 22, cy + 90, CW - 104, 14, {
      fontFamily: MONO,
      fontSize: 10.5,
      fill: t.termText,
    });
    pill(frameName, `${pfx}-cp`, "Copy", W - PX - 72, cy + 85, 50, 24, t.surfaceMuted, t.text, t.border, false);
  });
}

function buildFormulaDetail(frameName: number, _offsetX: number, t: Theme) {
  const W = 1440;
  const CX = 220;
  const CW = 1000;

  // Top bar
  rect(frameName, "fd-top", 0, 0, W, 64, { fill: t.surface });
  rect(frameName, "fd-top-b", 0, 63, W, 1, { fill: t.border });
  text(frameName, "fd-crumb", "← homebrew-tap  /  formulae  /  reminder", CX, 22, 420, 20, {
    fontFamily: MONO,
    fontSize: 13.5,
    fontStyle: "Medium",
    fill: t.textMuted,
  });
  pill(frameName, "fd-theme", "◐ Dark", CX + CW - 74, 18, 74, 28, t.surfaceMuted, t.text, t.border, false);

  let y = 110;
  rect(frameName, "fd-glyph", CX, y, 48, 48, {
    fill: t.surface,
    cornerRadius: 10,
    stroke: t.border,
    strokeWeight: 1,
  });
  text(frameName, "fd-glyph-t", ">_", CX, y + 14, 48, 20, {
    fontFamily: MONO,
    fontSize: 16,
    fontStyle: "Bold",
    fill: t.accent,
    textAlign: "center",
  });
  text(frameName, "fd-title", "reminder", CX + 64, y + 2, 260, 40, {
    fontFamily: MONO,
    fontSize: 32,
    fontStyle: "Bold",
    fill: t.text,
  });
  pill(frameName, "fd-v", "v3.0.4", CX + 240, y + 10, 68, 24, t.accentBg, t.accentText);
  pill(frameName, "fd-lic", "MIT · Swift · EventKit", CX + 316, y + 10, 164, 24, t.surfaceMuted, t.textMuted);

  y += 66;
  text(
    frameName,
    "fd-sub",
    "Native macOS command-line interface for Apple Reminders with full EventKit integration, instant execution, and zero external runtime dependencies.",
    CX,
    y,
    820,
    46,
    { fontSize: 16, fill: t.textMuted, lineHeight: 24 }
  );
  y += 64;

  // Install box
  rect(frameName, "fd-inst-bg", CX, y, CW, 56, {
    fill: t.termBg,
    cornerRadius: 10,
    stroke: t.termBorder,
    strokeWeight: 1,
  });
  text(frameName, "fd-inst-txt", "$ brew install AungMyoKyaw/homebrew-tap/reminder", CX + 20, y + 18, 640, 20, {
    fontFamily: MONO,
    fontSize: 15,
    fill: t.termText,
  });
  pill(frameName, "fd-inst-cp", "Copy command", CX + CW - 134, y + 12, 120, 32, t.accent, "#FFFFFF", undefined, false);
  y += 88;

  // Usage Terminal Block
  text(frameName, "fd-use-h", "QUICK START", CX, y, 200, 18, {
    fontFamily: MONO,
    fontSize: 12,
    fontStyle: "Bold",
    fill: t.textSubtle,
    letterSpacing: 1.2,
  });
  y += 26;
  rect(frameName, "fd-use-box", CX, y, CW, 186, {
    fill: t.termBg,
    cornerRadius: 10,
    stroke: t.termBorder,
    strokeWeight: 1,
  });
  const examples = [
    { cmd: "$ reminder list", comment: "# List upcoming reminders" },
    { cmd: "$ reminder add \"Ship homebrew-tap\"", comment: "# Create a reminder in default list" },
    { cmd: "$ reminder complete 1", comment: "# Mark item #1 complete" },
    { cmd: "$ reminder --help", comment: "# Full subcommand reference" },
  ];
  examples.forEach((line, i) => {
    text(frameName, `fd-ex-c-${i}`, line.cmd, CX + 24, y + 24 + i * 36, 420, 22, {
      fontFamily: MONO,
      fontSize: 14,
      fill: t.termText,
    });
    text(frameName, `fd-ex-m-${i}`, line.comment, CX + 460, y + 24 + i * 36, 480, 22, {
      fontFamily: MONO,
      fontSize: 13.5,
      fill: t.textSubtle,
    });
  });
  y += 218;

  // 2-column specs & troubleshooting
  const half = (CW - 20) / 2;
  rect(frameName, "fd-card-1", CX, y, half, 210, {
    fill: t.surface,
    cornerRadius: 10,
    stroke: t.border,
    strokeWeight: 1,
  });
  text(frameName, "fd-c1-h", "CAPABILITIES", CX + 24, y + 22, 200, 18, {
    fontFamily: MONO,
    fontSize: 11.5,
    fontStyle: "Bold",
    fill: t.textSubtle,
  });
  text(
    frameName,
    "fd-c1-b",
    "• Direct EventKit sync with iCloud & Apple Reminders\n• Native compiled Swift binary — sub-20ms startup\n• Scriptable plain-text output for shell pipelines\n• Automatic quarantine removal during brew install",
    CX + 24,
    y + 52,
    half - 48,
    130,
    { fontSize: 13.5, fill: t.textMuted, lineHeight: 24 }
  );

  rect(frameName, "fd-card-2", CX + half + 20, y, half, 210, {
    fill: t.surface,
    cornerRadius: 10,
    stroke: t.border,
    strokeWeight: 1,
  });
  text(frameName, "fd-c2-h", "PERMISSIONS & TROUBLESHOOTING", CX + half + 44, y + 22, 320, 18, {
    fontFamily: MONO,
    fontSize: 11.5,
    fontStyle: "Bold",
    fill: t.textSubtle,
  });
  text(
    frameName,
    "fd-c2-b",
    "On first run, macOS prompts Terminal for Reminders access — choose Allow.\n\nIf macOS still flags the binary:\nxattr -d com.apple.quarantine \"$(brew --prefix)/bin/reminder\"",
    CX + half + 44,
    y + 52,
    half - 48,
    130,
    { fontSize: 13.5, fill: t.textMuted, lineHeight: 22 }
  );
}

const frameDefs: Cmd[] = [
  { command: "node.create", params: { type: "frame", name: "01-Desktop-Light", x: 0, y: 0, width: 1440, height: 1780, props: { fill: LIGHT.bg, clip: true } } },
  { command: "node.create", params: { type: "frame", name: "02-Desktop-Dark", x: 1540, y: 0, width: 1440, height: 1780, props: { fill: DARK.bg, clip: true } } },
  { command: "node.create", params: { type: "frame", name: "03-Mobile-Light", x: 3080, y: 0, width: 390, height: 1320, props: { fill: LIGHT.bg, clip: true } } },
  { command: "node.create", params: { type: "frame", name: "04-Formula-Detail-Light", x: 3570, y: 0, width: 1440, height: 1040, props: { fill: LIGHT.bg, clip: true } } },
];

const stage1Script = join(DESIGN_DIR, "stage1-frames.json");
const stage1Fig = join(DESIGN_DIR, "stage1-frames.figcraft");
writeFileSync(stage1Script, JSON.stringify(frameDefs, null, 2));

const p1 = Bun.spawnSync([
  "figcraft-cli",
  "run",
  stage1Script,
  "--out",
  stage1Fig,
  "--automation-read-root",
  DESIGN_DIR,
  "--automation-write-root",
  DESIGN_DIR,
]);
if (p1.exitCode !== 0) {
  console.error("Stage 1 failed:", p1.stderr.toString(), p1.stdout.toString());
  process.exit(1);
}
const p1Lines = p1.stdout.toString().trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
const frameIds = p1Lines.map((r) => r.result?.id ?? r.id);
if (frameIds.length !== 4 || frameIds.some((id) => typeof id !== "number")) {
  console.error("Unexpected frame IDs:", p1Lines);
  process.exit(1);
}

buildDesktop(frameIds[0], 0, LIGHT, false);
buildDesktop(frameIds[1], 1540, DARK, true);
buildMobile(frameIds[2], 3080, LIGHT);
buildFormulaDetail(frameIds[3], 3570, LIGHT);

const scriptPath = join(DESIGN_DIR, "homebrew-tap-figcraft-commands.json");
writeFileSync(scriptPath, JSON.stringify(cmds, null, 2));

const outFig = join(DESIGN_DIR, "homebrew-tap.figcraft");
const runProc = Bun.spawnSync([
  "figcraft-cli",
  "run",
  scriptPath,
  "--in",
  stage1Fig,
  "--out",
  outFig,
  "--automation-read-root",
  DESIGN_DIR,
  "--automation-write-root",
  DESIGN_DIR,
]);

if (runProc.exitCode !== 0) {
  console.error("figcraft-cli run failed:", runProc.stderr.toString(), runProc.stdout.toString());
  process.exit(1);
}

// Check every JSONL result
const lines = runProc.stdout.toString().trim().split("\n").filter(Boolean);
let stepErrors = 0;
for (const line of lines) {
  const res = JSON.parse(line);
  if (!res.ok) {
    console.error("Step error:", line);
    stepErrors++;
  }
}
if (stepErrors > 0) {
  console.error(`${stepErrors} FigCraft steps failed.`);
  process.exit(1);
}
console.log(`FigCraft built ${lines.length} nodes cleanly -> ${outFig}`);

// Export all 4 top-level frames as PNGs
const expProc = Bun.spawnSync([
  "figcraft-cli",
  "export",
  outFig,
  "--out",
  EXPORTS_DIR,
  "--format",
  "png",
  "--scale",
  "1",
  "--automation-read-root",
  DESIGN_DIR,
  "--automation-write-root",
  DESIGN_DIR,
]);

if (expProc.exitCode !== 0) {
  console.error("figcraft-cli export failed:", expProc.stderr.toString(), expProc.stdout.toString());
  process.exit(1);
}
console.log("Exported PNGs ->", EXPORTS_DIR);
