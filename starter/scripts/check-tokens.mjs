// Tailwind v4 のトークン名衝突チェック（`npm run lint` の先頭で実行 → CI の Lint ステップにも乗る）。
//
// ⚠️ 実際の事故（ポートフォリオ案件）: `--color-hero` と `--text-hero` を同名で定義した結果、
//    `text-hero` が **色** として解決され、モバイルの h1 が 15px・ほぼ白になった。
//    ビルドもリントも通るので、画面を見るまで気づけない。
//
// Tailwind v4 では 1 つのユーティリティ接頭辞が複数の namespace を見る:
//   text-X   … --text-X（字号）  と --color-X
//   shadow-X / inset-shadow-X / drop-shadow-X … 影 と --color-X
//   font-X   … --font-X（字体）  と --font-weight-X
// さらに既定値（text-lg / shadow-md / font-bold 等）とも衝突しうる。
import { readFileSync } from "node:fs";

const file = new URL("../src/app/globals.css", import.meta.url);
const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** `--<ns>-<name>:` の <name> を集める（`--text-h1--line-height` のような修飾子は除外） */
function names(ns) {
  const re = new RegExp(`--${ns}-([a-z0-9-]+?)\\s*:`, "g");
  const out = new Set();
  for (const [, name] of css.matchAll(re)) {
    if (!name.includes("--")) out.add(name);
  }
  return out;
}

const defaults = {
  text: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"],
  shadow: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
  "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
  font: ["sans", "serif", "mono"],
};

const color = names("color");
const pairs = [
  ["text", "color", "text-"],
  ["shadow", "color", "shadow-"],
  ["inset-shadow", "color", "inset-shadow-"],
  ["drop-shadow", "color", "drop-shadow-"],
  ["font", "font-weight", "font-"],
];

const problems = [];
for (const [a, b, prefix] of pairs) {
  const left = new Set([...names(a), ...(defaults[a] ?? [])]);
  const right = b === "color" ? color : new Set([...names(b), ...(defaults[b] ?? [])]);
  for (const n of left) {
    if (right.has(n)) problems.push(`\`${prefix}${n}\` is ambiguous: --${a}-${n} and --${b}-${n} both exist`);
  }
}

if (problems.length) {
  console.error("✖ Tailwind token name collision (globals.css):");
  for (const p of problems) console.error(`  - ${p}`);
  console.error("  → rename one side (e.g. color `hero` → `hero-surface`). See DESIGN.md「Colors」の命名の罠.");
  process.exit(1);
}
console.log("✓ tokens: no name collisions");
