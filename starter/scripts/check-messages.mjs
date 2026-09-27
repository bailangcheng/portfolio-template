// messages/*.json のキーが全言語で一致しているかを確かめる（`npm run lint` の中で実行 → CI にも乗る）。
//
// なぜ: next-intl はキーが無いとキー名そのもの（"work.next"）を画面に出すだけで、ビルドは通る。
//       ja だけに足して zh / en を忘れる、は 3 言語サイトで一番起きる事故。
// content（src/content/）の方は L<T> 型で同じことを typecheck が止める。
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../messages/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

function keys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

const sets = Object.fromEntries(
  files.map((f) => [f, new Set(keys(JSON.parse(readFileSync(new URL(f, dir), "utf8"))))]),
);
const all = new Set(Object.values(sets).flatMap((s) => [...s]));

const problems = [];
for (const [file, set] of Object.entries(sets)) {
  for (const k of all) if (!set.has(k)) problems.push(`${file}: missing "${k}"`);
}

if (problems.length) {
  console.error("✖ messages: keys differ between locales:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ messages: ${files.join(", ")} have the same ${all.size} keys`);
