# CLAUDE.md — portfolio-template（模板仓库本身）

这是一个**模板仓库**，不是某个人的作品集。它由这些东西组成：

| 路径 | 是什么 | 改动规则 |
|------|--------|---------|
| `starter/` | **完整可运行**的 Next.js 16 作品集（三语、GSAP、Three.js、Resend） | 改完必须 `cd starter && npm run check` 通过 |
| `starter/DESIGN.md` | 复制进新项目的视觉契约 | 视觉 token 的唯一源；改 token 时同步 `starter/src/app/globals.css` |
| `harness/` | 复制进新项目的 agent harness（CLAUDE.md / AGENTS.md / .claude/） | 保持可直接复制；说明写进 `harness/README.md` |
| `materials/` | 复制到仓库外的素材骨架 | 与 `PLAYBOOK.md` 第 1 章、`add-work` skill 的字段对应表保持一致 |
| `PLAYBOOK.md` / `LESSONS.md` / `CHECKLISTS.md` | 流程 / 事故档案 / 清单 | 见「单一事实源」 |
| `scripts/` | `new-project.sh` / `new-materials.sh` | 改 starter / harness / materials 的结构时同步 |

## 单一事实源

- **事故 / 原则**：`LESSONS.md`。R / B / V / W / P 是 web-app-template 的原编号（**不改号**），PF 是本仓库新增。引用写编号，不复述正文。
- **视觉 token**：`starter/DESIGN.md` ↔ `starter/src/app/globals.css`。harness 只写读取与执行规则，不复制 token 表。
- **sitemap / 作品详情的顺序 / 素材结构 / text.md 模板**：`PLAYBOOK.md` 第 0–1 章。`starter/src/content/types.ts` 的 `Work` 与 `materials/02_works/_template/text.md` 必须和它一致。
- 工件文件（`harness/*`、`materials/*`、`starter/README.md`）**允许**与说明文档重复 —— 它们会被复制出仓库，自包含是功能。

## 铁律

- starter 源码里的注释是**事故记录**，绝不删除、绝不"精简"。
- 不要往这个仓库写任何真实个人的内容（真名、雇主、客户、邮箱、作品图）。示例一律是「山田 花子」「example.com」和占位图 —— `npm run placeholders` 靠这些关键词找残留。
- `next/font/google` 禁止（B-02）。
- 三语：starter 的内容与 `messages/*.json` 三种语言必须齐。

## 验证

```bash
cd starter && npm run check                         # lint + typecheck + build，改 starter 后必跑
cd starter && npm run placeholders                  # 模板状态下应列出示例（非 0 是正常的）
bash scripts/new-project.sh C:/sm/pf smoke          # 改结构后冒烟 → cd C:/sm/pf && npm install && npm run check
#   ⚠️ Windows 上冒烟路径要短（C:/sm/...）：长路径下 Turbopack 会因路径长度上限 panic —— 那是测试路径的问题（先怀疑自己的测试路径）
```

浏览器验证：`.claude/launch.json` 的 `dev`（= `npm --prefix starter run dev`）。
内嵌预览里 rAF 可能 0fps：GSAP 用 `window.__gsap.ticker.tick()`，3D 用 `window.__three.frame()` + `gl.readPixels`（V-06 / PF-02）。
