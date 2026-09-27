---
name: add-work
description: 把 portfolio-materials 里的一个作品文件夹（年_slug/ 含 text.md・selects/・process/・credits.md）做成网站上的作品（ケーススタディ）。用户说「加作品」「把这个文件夹做成作品」「作品を追加」「更新某个作品的图/文字」时使用。
---

# 加一个作品（text.md → 三语 content + 图片 + 台账）

输入：一个作品文件夹，例如 `../portfolio-materials/02_works/2024_poster-campaign/`

```
2024_poster-campaign/
├─ raw/          不碰
├─ selects/      Web 用图。按文件名排序：第 1 张 = cover（キービジュアル），其余 = 成果图
├─ process/      草图・试作・过程照
├─ text.md       正文（模板见模板仓库 materials/02_works/_template/text.md）
└─ credits.md    模特・摄影・共同制作者・公开许可（带确认日期）
```

## 步骤

1. **读** `text.md` 和 `credits.md` 全文。缺了哪个 → 停下问用户，不要编。
   - `一言で` 超过 40 字（ja）→ 问用户要不要缩，不要自己改写意思。
   - 有 `（未確認）` / 空栏的项目 → 在 content 里留 `undefined`（页面不显示那一行）。
2. **slug** = 文件夹名去掉年份（`2024_poster-campaign` → `poster-campaign`）。它就是 URL，公开后不改。
   和 `src/content/works.ts` 已有的 slug 重复 → 停下问。
3. **图片**：`npm run images -- <作品文件夹> <slug>`
   - 输出 `src/assets/images/works/<slug>/cover.jpg, 01.jpg…, process-01.jpg…`
   - 把脚本最后打印的表格行追加到 `docs/ASSET-SOURCES.md`，授权栏按 `credits.md` 填（没有确认 → `⚠️ 待确认: <什么>`）。
   - 有 >900 KB 的警告 → 告诉用户，别自己降画质。
4. **content**：复制 `src/content/works/poster-campaign.ts`（最小例）或 `graduation-collection.ts`（完整例）为 `src/content/works/<slug>.ts`。
   - text.md 的栏 → `Work` 的字段：カテゴリ→`category`（fashion / graphic / web）・年→`year`・担当範囲→`facts.role`・期間→`facts.period`・使用ツール→`facts.tools`・クレジット→`facts.credits`（**只放 credits.md 里公开 OK 的**）・一言で→`summary`・課題・背景→`background`・プロセス→`process.body`・成果→`outcome.body`・振り返り→`reflection`。
   - **三语全写**（ja / zh / en）。原文是哪种语言就以它为准翻译另外两种；不加原文没有的成果、数字、客户名、奖项。
   - 每张图写 `alt`（三语，描述画面内容，不是「画像1」）。需要的话 `caption`。
   - 裁切有问题的封面 → 设 `focus`（例 `"50% 35%"`）。
5. `src/content/works.ts`：import 并插进数组（位置 = 用户指定的顺序；没说就问。默认放最前）。TOP 要显示的加 `featured: true`（TOP 最多 4 个）。
6. `npm run check` → 绿。
7. dev 里打开 `/works/<slug>`、`/zh/works/<slug>`、`/en/works/<slug>`：看图、看三语、看 390px 无横向溢出。
8. 汇报：加了什么、哪些栏因为未确认而没显示、`ASSET-SOURCES.md` 里还有哪些 `⚠️ 待确认`。

## 更新已有作品

- 文字：只改 `src/content/works/<slug>.ts` 的对应字段，**三语一起改**。
- 换图：重新跑 `npm run images`（同名覆盖）→ 更新 `ASSET-SOURCES.md` 的那一行。删掉的图同时删 import 和台账行。
- 删除作品：从 `works.ts` 移除 → 删 `works/<slug>.ts` → 删图片目录 → 删台账行。

## 不要做

- 不要把 `raw/` 里的原图、PSD、AI 放进仓库。
- 不要为了"好看"改写正文或补一句总结。
- 不要在 `credits.md` 没确认的情况下写出模特 / 摄影师的名字。
