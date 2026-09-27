// 作品フォルダ（portfolio-materials/02_works/<年_slug>/）から Web 用の画像を書き出す。
//
//   npm run images -- <作品フォルダ> <slug>
//   例: npm run images -- ../portfolio-materials/02_works/2024_poster-campaign poster-campaign
//
// 入力（PLAYBOOK.md「素材の構造」）:
//   selects/  … Web に出す画像。ファイル名順。1 枚目が cover（キービジュアル）、残りが 01, 02 …（成果）
//   process/  … 草図・試作・過程写真 → process-01, process-02 …
//   raw/      … 触らない（原本）
// 出力: src/assets/images/works/<slug>/cover.jpg, 01.jpg …, process-01.jpg …
//
// 加工（docs/ASSET-SOURCES.md「加工規則」と同じ。変えるなら両方）:
//   ・長辺 ≤ 3200px（小さい原本は拡大しない）・EXIF/GPS を除去（sharp は既定でメタデータを書かない）
//   ・sRGB JPEG q90（mozjpeg）。透過 PNG / 線画スクリーンショットは PNG のまま
// 最後に ASSET-SOURCES.md に貼る行を出力する（出典と許可は自分で埋める）。
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const [src, slug] = process.argv.slice(2);
if (!src || !slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error("usage: npm run images -- <materials work folder> <slug>   (slug = lowercase-kebab-case, becomes the URL)");
  process.exit(1);
}

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "src", "assets", "images", "works", slug);
mkdirSync(out, { recursive: true });

const IMG = /\.(jpe?g|png|webp|tiff?)$/i;
const list = (dir) =>
  existsSync(join(src, dir))
    ? readdirSync(join(src, dir))
        .filter((f) => IMG.test(f))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((f) => join(src, dir, f))
    : [];

const selects = list("selects");
const processImgs = list("process");
if (selects.length === 0) {
  console.error(`✖ no images in ${join(src, "selects")} — put the web-ready picks there first (1st = cover)`);
  process.exit(1);
}

const jobs = [
  ...selects.map((file, i) => ({ file, name: i === 0 ? "cover" : String(i).padStart(2, "0") })),
  ...processImgs.map((file, i) => ({ file, name: `process-${String(i + 1).padStart(2, "0")}` })),
];

const rows = [];
for (const { file, name } of jobs) {
  const img = sharp(file).rotate(); // EXIF の向きを反映してから捨てる
  const meta = await img.metadata();
  const keepPng = extname(file).toLowerCase() === ".png" && meta.hasAlpha;
  const target = join(out, `${name}.${keepPng ? "png" : "jpg"}`);
  const pipeline = img.resize({ width: 3200, height: 3200, fit: "inside", withoutEnlargement: true }).toColourspace("srgb");
  const info = await (keepPng ? pipeline.png({ compressionLevel: 9 }) : pipeline.jpeg({ quality: 90, mozjpeg: true })).toFile(target);
  const kb = Math.round(info.size / 1024);
  console.log(`  ${basename(file)} → ${slug}/${basename(target)}  ${info.width}×${info.height}  ${kb} KB${kb > 900 ? "  ⚠️ large — check the export (W-17)" : ""}`);
  rows.push(`| works/${slug}/${basename(target)} | ${basename(file)}（${meta.width}×${meta.height}） | 長辺 ≤3200・EXIF 除去・${keepPng ? "PNG" : "q90"} | ⚠️ 待确认: <出典・許可> |`);
}

console.log(`\n✓ ${jobs.length} file(s) → src/assets/images/works/${slug}/`);
console.log("\n▸ docs/ASSET-SOURCES.md に追記する行（出典・許可を埋めること）:\n");
console.log(rows.join("\n"));
