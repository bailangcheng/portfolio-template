#!/usr/bin/env bash
# 用模板初始化一个新的作品集项目。
#
#   bash scripts/new-project.sh <目标目录> [项目名]
#
# 做的事（每一步都对应一次踩过的坑）：
#   1. 复制 starter/（含点文件，排除 node_modules / .next）
#      —— `cp -r starter/* dest/` 会丢掉 .env.example / .gitignore / .github（* 不匹配点文件）。
#   2. 安装 harness（CLAUDE.md / AGENTS.md / .claude/agents / .claude/skills）
#   3. 替换项目名
#   4. 列出待替换的占位符（示例作品、仮名、example.com、占位图）
#   5. ★ 检查全局 / 祖先目录的 CLAUDE.md 有没有上个项目的残留（W-07）
#
# 素材的骨架（portfolio-materials/）是另一个脚本：scripts/new-materials.sh
set -euo pipefail

TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?用法: bash scripts/new-project.sh <目标目录> [项目名]}"
NAME="${2:-}"

if [ -e "$DEST" ] && [ -n "$(ls -A "$DEST" 2>/dev/null)" ]; then
  echo "❌ 目标目录已存在且非空: $DEST" >&2
  exit 1
fi
mkdir -p "$DEST"

# 1) starter（含点文件，排除依赖与构建产物）
echo "▸ 复制 starter/ → $DEST"
(
  cd "$TEMPLATE_DIR/starter"
  tar cf - --exclude=node_modules --exclude=.next --exclude='*.tsbuildinfo' --exclude=next-env.d.ts . \
    | tar xf - -C "$DEST"
)

# 2) harness
echo "▸ 安装 harness（CLAUDE.md / AGENTS.md / .claude/）"
cp "$TEMPLATE_DIR/harness/CLAUDE.md" "$DEST/CLAUDE.md"
cp "$TEMPLATE_DIR/harness/AGENTS.md" "$DEST/AGENTS.md"
# ⚠️ 用 "/." 合并：starter 自带 .claude/launch.json，`cp -r harness/.claude dest/.claude` 会变成 dest/.claude/.claude
mkdir -p "$DEST/.claude"
cp -r "$TEMPLATE_DIR/harness/.claude/." "$DEST/.claude/"

# 3) 项目名
if [ -n "$NAME" ]; then
  echo "▸ 项目名 → $NAME"
  sed -i.bak "s/\"name\": \"portfolio-starter\"/\"name\": \"$NAME\"/" "$DEST/package.json" && rm -f "$DEST/package.json.bak"
fi

# 4) 占位符（上线前必须 0 件 → 项目里随时可以 `npm run placeholders`）
echo ""
echo "▸ 待替换的占位符（首 20 行。全部 → cd $DEST && npm run placeholders）:"
# 与项目里的 `npm run placeholders` 用同一个扫描（关键词只维护一处）
(cd "$DEST" && node scripts/check-placeholders.mjs 2>&1 | sed -n '3,22p') || true

# 5) ★ 全局 harness 残留（W-07：上个项目的规则会污染新项目的每一个 session）
echo ""
echo "▸ 检查全局 CLAUDE.md 是否有上个项目的残留:"
FOUND=0
for f in "$HOME/CLAUDE.md" "$HOME/.claude/CLAUDE.md"; do
  if [ -f "$f" ]; then
    FOUND=1
    echo "  ⚠️  存在: $f —— 确认里面只有「我是谁、我怎么工作」，没有任何项目专属内容（颜色 / class 名 / 目录）"
  fi
done
# 祖先目录里的 CLAUDE.md 也会被自动注入（查了 ~/.claude/ 却漏了 ~/，就是这么出事的）
d="$(cd "$DEST" && pwd)"
while [ "$d" != "/" ] && [ "$d" != "$(dirname "$d")" ]; do
  d="$(dirname "$d")"
  [ -f "$d/CLAUDE.md" ] && { FOUND=1; echo "  ⚠️  祖先目录: $d/CLAUDE.md —— 会注入本项目所有 session"; }
done
[ "$FOUND" -eq 0 ] && echo "  ✅ 未发现全局 / 祖先 CLAUDE.md"

echo ""
echo "▸ 记忆种子: $TEMPLATE_DIR/harness/memory/seeds/*.md"
echo "  项目第一次用 Claude Code 打开后，复制到 ~/.claude/projects/<project>/memory/（见 harness/memory/README.md）"

echo ""
echo "✅ 完成。下一步:"
echo "   cd $DEST && git init -b main && npm install && npm run check"
echo "   素材骨架还没有的话: bash $TEMPLATE_DIR/scripts/new-materials.sh <素材目录>"
echo "   然后按 PLAYBOOK.md 第 2 章（写文字）→ 第 4 章（实装）走。"
