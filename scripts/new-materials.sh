#!/usr/bin/env bash
# 生成 portfolio-materials/ 的骨架（放在仓库外：Google Drive 或本地）。
#
#   bash scripts/new-materials.sh <目标目录>
#
# 内容 → materials/README.md（00_inventory.xlsx / 01_profile / 02_works/_template / 03_references / 04_brand）
set -euo pipefail

TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?用法: bash scripts/new-materials.sh <目标目录>}"

if [ -e "$DEST" ] && [ -n "$(ls -A "$DEST" 2>/dev/null)" ]; then
  echo "❌ 目标目录已存在且非空: $DEST（已有素材不覆盖）" >&2
  exit 1
fi
mkdir -p "$DEST"
cp -r "$TEMPLATE_DIR/materials/." "$DEST/"
find "$DEST" -name .gitkeep -delete

echo "✅ 素材骨架 → $DEST"
echo "   作品: cp -r \"$DEST/02_works/_template\" \"$DEST/02_works/2024_my-work\"  （年_slug。slug = URL）"
echo "   然后填 text.md / credits.md，selects/ 放网页用图（第 1 张 = キービジュアル）。"
