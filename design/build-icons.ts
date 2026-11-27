import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = import.meta.dir;
const ICONS_DIR = join(ROOT, "icons");
const TMP_DIR = join(ROOT, ".tmp-icons");
mkdirSync(ICONS_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const INK = "#18181B";
const AMBER = "#D97706";

type Cmd = { command: string; params: Record<string, unknown> };

function strokeStyle(color = INK, weight = 2): Cmd[] {
  return [
    { command: "select.none", params: {} },
    { command: "paint.setFill", params: { none: true } },
    { command: "paint.setStroke", params: { color } },
    { command: "stroke.set", params: { weight, cap: "round", join: "round" } },
  ];
}

function fillStyle(color = AMBER): Cmd[] {
  return [
    { command: "select.none", params: {} },
    { command: "paint.setFill", params: { color } },
    { command: "paint.setStroke", params: { none: true } },
  ];
}

function makeDoc(name: string, draw: Cmd[]): Cmd[] {
  return [
    {
      command: "file.new",
      params: { name, width: 32, height: 32, units: "Pixels", colorMode: "rgb" },
    },
    ...draw,
  ];
}

const icons: Record<string, Cmd[]> = {
  "tap-mark": makeDoc("tap-mark", [
    // Rounded amber badge background + dark geometric tap/terminal chevron
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 2, y: 2, width: 28, height: 28, radius: 7 } },
    ...strokeStyle("#FFFFFF", 2.4),
    { command: "shape.line", params: { x1: 9, y1: 11, x2: 14, y2: 16 } },
    { command: "shape.line", params: { x1: 14, y1: 16, x2: 9, y2: 21 } },
    { command: "shape.line", params: { x1: 16, y1: 21, x2: 23, y2: 21 } },
    ...fillStyle("#FFFFFF"),
    { command: "shape.ellipse", params: { x: 19, y: 10, width: 4, height: 4 } },
  ]),

  focusbar: makeDoc("focusbar", [
    // Geometric menu-bar strip at the top with an amber focus pill + timer indicator below
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 4, y: 5, width: 24, height: 7, radius: 3.5 } },
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 6.5, y: 7, width: 12, height: 3, radius: 1.5 } },
    ...strokeStyle(INK, 2),
    { command: "shape.ellipse", params: { x: 9, y: 15, width: 14, height: 14 } },
    ...strokeStyle(AMBER, 2.2),
    { command: "shape.line", params: { x1: 16, y1: 22, x2: 20, y2: 18 } },
  ]),

  "block-clock": makeDoc("block-clock", [
    // Rounded outer frame with a 3x2 grid of minute blocks, elapsed blocks in amber
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 3, y: 5, width: 26, height: 22, radius: 4 } },
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 7, y: 9, width: 5, height: 5, radius: 1 } },
    { command: "shape.rectangle", params: { x: 13.5, y: 9, width: 5, height: 5, radius: 1 } },
    { command: "shape.rectangle", params: { x: 20, y: 9, width: 5, height: 5, radius: 1 } },
    { command: "shape.rectangle", params: { x: 7, y: 18, width: 5, height: 5, radius: 1 } },
    ...strokeStyle(INK, 1.6),
    { command: "shape.rectangle", params: { x: 13.5, y: 18, width: 5, height: 5, radius: 1 } },
    { command: "shape.rectangle", params: { x: 20, y: 18, width: 5, height: 5, radius: 1 } },
  ]),

  "life-manager": makeDoc("life-manager", [
    // 2x2 structured quadrant planner with amber focus dot
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 4, y: 4, width: 10, height: 10, radius: 2.5 } },
    { command: "shape.rectangle", params: { x: 18, y: 4, width: 10, height: 10, radius: 2.5 } },
    { command: "shape.rectangle", params: { x: 4, y: 18, width: 10, height: 10, radius: 2.5 } },
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 18, y: 18, width: 10, height: 10, radius: 2.5 } },
  ]),

  "chatgpt-controller": makeDoc("chatgpt-controller", [
    // Hexagonal local API node with amber core & link pins
    ...strokeStyle(INK, 2),
    { command: "shape.polygon", params: { cx: 16, cy: 16, radius: 11, sides: 6 } },
    { command: "shape.line", params: { x1: 16, y1: 5, x2: 16, y2: 11 } },
    { command: "shape.line", params: { x1: 16, y1: 21, x2: 16, y2: 27 } },
    ...fillStyle(AMBER),
    { command: "shape.ellipse", params: { x: 12.5, y: 12.5, width: 7, height: 7 } },
  ]),

  "dhamma-echo": makeDoc("dhamma-echo", [
    // Concentric acoustic/mindful rings with amber center
    ...strokeStyle(INK, 1.8),
    { command: "shape.ellipse", params: { x: 4, y: 4, width: 24, height: 24 } },
    { command: "shape.ellipse", params: { x: 8.5, y: 8.5, width: 15, height: 15 } },
    ...fillStyle(AMBER),
    { command: "shape.ellipse", params: { x: 13, y: 13, width: 6, height: 6 } },
  ]),

  receipts: makeDoc("receipts", [
    // Precision menu-bar timer / receipt card with horizontal tick lines
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 6, y: 4, width: 20, height: 24, radius: 3 } },
    { command: "shape.line", params: { x1: 10, y1: 10, x2: 22, y2: 10 } },
    { command: "shape.line", params: { x1: 10, y1: 15, x2: 19, y2: 15 } },
    ...strokeStyle(AMBER, 2.2),
    { command: "shape.line", params: { x1: 10, y1: 21, x2: 22, y2: 21 } },
  ]),

  "rusty-pomodoro": makeDoc("rusty-pomodoro", [
    // Minimalist focus timer dial with amber indicator hand
    ...strokeStyle(INK, 2),
    { command: "shape.ellipse", params: { x: 5, y: 7, width: 22, height: 22 } },
    { command: "shape.line", params: { x1: 13, y1: 3.5, x2: 19, y2: 3.5 } },
    { command: "shape.line", params: { x1: 16, y1: 3.5, x2: 16, y2: 7 } },
    ...strokeStyle(AMBER, 2.4),
    { command: "shape.line", params: { x1: 16, y1: 18, x2: 21.5, y2: 13.5 } },
    ...fillStyle(AMBER),
    { command: "shape.ellipse", params: { x: 14, y: 16, width: 4, height: 4 } },
  ]),

  caffeinate: makeDoc("caffeinate", [
    // Geometric mug + handle + amber steam lines
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 5, y: 12, width: 16, height: 14, radius: 3 } },
    { command: "shape.rectangle", params: { x: 21, y: 15, width: 5, height: 7, radius: 2 } },
    ...strokeStyle(AMBER, 2),
    { command: "shape.line", params: { x1: 9.5, y1: 5, x2: 9.5, y2: 8.5 } },
    { command: "shape.line", params: { x1: 13, y1: 4, x2: 13, y2: 8.5 } },
    { command: "shape.line", params: { x1: 16.5, y1: 5, x2: 16.5, y2: 8.5 } },
  ]),

  gitfolio: makeDoc("gitfolio", [
    // 3x3 contribution graph with amber highlight cells
    ...strokeStyle(INK, 1.6),
    { command: "shape.rectangle", params: { x: 4, y: 4, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 13, y: 4, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 22, y: 4, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 4, y: 13, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 22, y: 22, width: 6, height: 6, radius: 1.5 } },
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 13, y: 13, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 22, y: 13, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 4, y: 22, width: 6, height: 6, radius: 1.5 } },
    { command: "shape.rectangle", params: { x: 13, y: 22, width: 6, height: 6, radius: 1.5 } },
  ]),

  "git-ingest": makeDoc("git-ingest", [
    // Branching nodes funneling into a single amber output block
    ...strokeStyle(INK, 2),
    { command: "shape.ellipse", params: { x: 5, y: 5, width: 6, height: 6 } },
    { command: "shape.ellipse", params: { x: 21, y: 5, width: 6, height: 6 } },
    { command: "shape.line", params: { x1: 8, y1: 11, x2: 16, y2: 18 } },
    { command: "shape.line", params: { x1: 24, y1: 11, x2: 16, y2: 18 } },
    ...fillStyle(AMBER),
    { command: "shape.rectangle", params: { x: 10, y: 20, width: 12, height: 7, radius: 2 } },
  ]),

  reminder: makeDoc("reminder", [
    // Terminal prompt + amber check circle
    ...strokeStyle(INK, 2),
    { command: "shape.rectangle", params: { x: 4, y: 5, width: 24, height: 22, radius: 4 } },
    { command: "shape.line", params: { x1: 9, y1: 13, x2: 13, y2: 16 } },
    { command: "shape.line", params: { x1: 13, y1: 16, x2: 9, y2: 19 } },
    ...fillStyle(AMBER),
    { command: "shape.ellipse", params: { x: 17, y: 13, width: 6, height: 6 } },
  ]),

  corenote: makeDoc("corenote", [
    // SQLite stacked discs + amber note accent bar
    ...strokeStyle(INK, 2),
    { command: "shape.ellipse", params: { x: 6, y: 5, width: 20, height: 7 } },
    { command: "shape.line", params: { x1: 6, y1: 8.5, x2: 6, y2: 23.5 } },
    { command: "shape.line", params: { x1: 26, y1: 8.5, x2: 26, y2: 23.5 } },
    { command: "shape.ellipse", params: { x: 6, y: 20, width: 20, height: 7 } },
    ...strokeStyle(AMBER, 2.2),
    { command: "shape.line", params: { x1: 10, y1: 16, x2: 22, y2: 16 } },
  ]),
};

let failures = 0;
for (const [name, commands] of Object.entries(icons)) {
  const cmdFile = join(TMP_DIR, `${name}.json`);
  writeFileSync(cmdFile, JSON.stringify(commands, null, 2));

  const vcOut = join(ICONS_DIR, `${name}.vectorcraft`);
  const svgOut = join(ICONS_DIR, `${name}.svg`);
  const pngOut = join(ICONS_DIR, `${name}.png`);

  const proc = Bun.spawnSync([
    "vectorcraft-cli",
    "--safe-mode",
    "run",
    "--commands",
    cmdFile,
    "--export",
    vcOut,
    "--export",
    svgOut,
    "--export",
    pngOut,
    "--ppi",
    "288",
  ]);

  const stdout = proc.stdout.toString();
  const stderr = proc.stderr.toString();
  if (proc.exitCode !== 0) {
    console.error(`FAIL ${name}: exit ${proc.exitCode}\n${stderr}\n${stdout}`);
    failures++;
    continue;
  }

  // Verify JSONL steps if present
  const lines = stdout.trim().split("\n").filter(Boolean);
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj.ok === false || obj.error) {
        console.error(`STEP FAIL ${name}: ${line}`);
        failures++;
      }
    } catch {
      // non-JSON status line
    }
  }

  if (!existsSync(vcOut) || !existsSync(svgOut) || !existsSync(pngOut)) {
    console.error(`MISSING OUTPUT for ${name}`);
    failures++;
  } else {
    console.log(`OK ${name}: .vectorcraft + .svg + .png`);
  }
}

if (failures > 0) {
  process.exit(1);
}
console.log(`All ${Object.keys(icons).length} icons generated cleanly.`);
