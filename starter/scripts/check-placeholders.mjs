// 公開前に消すべき「サンプルのまま」を列挙する（`npm run placeholders`）。0 件で終了コード 0。
//
// 対象: src/ と public/ と docs/ASSET-SOURCES.md。starter のサンプルが必ず含む「印」だけを探す
// （コードのコメントや placeholder="blur" には反応しない ―― 反応すると永遠に 0 にならず、誰も見なくなる）:
//   ・サンプル文言の印:（サンプル…）/ サンプル文 /（示例…）/ 示例文字 / (sample…) / sample text / 占位画像 / 占位图 / (placeholder) / PLACEHOLDER / ○○
//   ・仮の連絡先: example.com / instagram.com/example / github.com/example
//   ・テンプレートの仮名: 山田 花子 / Hanako Yamada
//   ・ASSET-SOURCES.md の許可欄が「占位」「⚠️ 待确认: …」の行（HTML コメント内の例は除く）
// ⚠️ lint には入れていない: 開発中はサンプルが残っているのが正常。上線前チェック（CHECKLISTS §4）で回す。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const patterns = [
  /（サンプル/, /サンプル文/, /（示例/, /示例文字/, /\(sample/i, /sample text/i, /占位画像/, /占位图/, /\(placeholder\)/i, /PLACEHOLDER/, /○○/,
  /example\.com/, /instagram\.com\/example/, /github\.com\/example/,
  /山田\s?花子/, /Hanako Yamada/,
  /^\|.*\|\s*(占位|⚠️ 待确认:[^|`]*)\s*\|$/,
];
// このスクリプト自身と、説明として語を含むだけのファイルは除外
const skip = new Set(["scripts/check-placeholders.mjs"]);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (name === "node_modules" || name === ".next") return [];
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const targets = [...walk(join(root, "src")), ...walk(join(root, "public")), join(root, "docs", "ASSET-SOURCES.md")];
const hits = [];
for (const file of targets) {
  const rel = relative(root, file).replaceAll("\\", "/");
  if (skip.has(rel) || !/\.(tsx?|mjs|json|md|svg|css)$/.test(file)) continue;
  let inComment = false; // Markdown の <!-- --> 内（記入例）は数えない
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const text = line.trim();
      if (file.endsWith(".md")) {
        if (inComment) {
          if (text.includes("-->")) inComment = false;
          return;
        }
        if (text.startsWith("<!--")) {
          inComment = !text.includes("-->");
          return;
        }
      }
      if (patterns.some((re) => re.test(text))) hits.push(`${rel}:${i + 1}: ${text.slice(0, 110)}`);
    });
}

if (hits.length) {
  console.log(`▸ ${hits.length} placeholder line(s) left — replace before going live:\n`);
  for (const h of hits) console.log(`  ${h}`);
  process.exit(1);
}
console.log("✓ no placeholders left");
