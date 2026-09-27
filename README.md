# portfolio-template

> 个人作品集网站的**开箱即用模板 + 流程手册 + agent harness + 事故档案**。
> 从 `web-app-template`（企业官网模板）的结构出发，去掉企业站的部分（CMS、公司概要、新闻、招聘、Cloudflare），
> 保留并整理了个人作品集项目里实际用到的东西：**GSAP 动效、字体与设计系统（DESIGN.md ↔ globals.css）、Vercel 部署、Resend 表单**，
> 加上 **日本語 / 中文 / English 三语** 和 **Three.js 3D 首屏** 的起步包。
> 没有 CMS —— 内容在仓库里，用 vibe coding（让 Claude Code 改）更新。

---

## 结构（按"什么时候打开"组织）

| 打开时刻 | 文件 | 是什么 |
|---|---|---|
| **开始之前** | [PLAYBOOK.md](PLAYBOOK.md) | 素材 → 文字 → 结构 → 视觉 → 实装 → 上线。★ sitemap、作品详情的 9 段顺序、素材文件结构、text.md 模板都在第 0–1 章 |
| **整理素材时** | [materials/](materials/) | `portfolio-materials/` 的骨架（inventory 表、profile.md、text.md / credits.md 模板） |
| **建项目时** | [starter/](starter/) + [harness/](harness/) | 可运行的 Next.js 16 作品集 + agent 配置（`scripts/new-project.sh` 一键装） |
| **定视觉时** | [starter/DESIGN.md](starter/DESIGN.md) | 视觉契约：精确 token、字体（含 CJK）、布局、组件、Motion、3D 规则 |
| **干活时** | [CHECKLISTS.md](CHECKLISTS.md) | 逐条可勾的清单（带事故编号） |
| **想知道"为什么"时** | [LESSONS.md](LESSONS.md) | 作品集相关的事故档案（R / B / V / W / P 沿用原编号 + 本模板新增 PF） |

## 快速上手

```bash
# 1. 素材骨架（放仓库外：Google Drive 或本地）
bash scripts/new-materials.sh ~/Drive/portfolio-materials

# 2. 项目（复制 starter 含点文件、装 harness、列占位符、查全局 CLAUDE.md 残留）
bash scripts/new-project.sh ~/Desktop/dev/portfolio-<name> portfolio-<name>
cd ~/Desktop/dev/portfolio-<name> && git init -b main && npm install && npm run check

# 3. 在 Claude Code 里：「把 <素材>/02_works/2024_xxx 加成作品」（→ .claude/skills/add-work）
# 4. 公开前：npm run placeholders → 0 件，CHECKLISTS.md §4
```

⚠️ 手动复制的话务必用 `cp -r starter/. <dest>/`（**点号形式** —— `starter/*` 会丢掉 `.env.example` / `.gitignore` / `.github/`）。

## starter 里有什么

| | |
|---|---|
| 页面 | `/`（首屏 → 精选作品 → About 摘要 → 联系）・`/works`（Fashion / Graphic・Ad / Web 筛选）・`/works/[slug]`（9 段ケーススタディ）・`/about`（+ `#contact`）・`/process`・404（引导回作品一览） |
| 三语 | next-intl。`/` = 日本語、`/zh`、`/en`。内容是 `L<T>`（缺一种语言 = 类型错误），界面文字的键由 lint 比对 |
| 设计系统 | 纸感 + Manrope + 轻而大的标题（400）+ 一种强调色。CJK 按语言只加载一种 Noto，字距按 `:lang()` 切换 |
| 动效 | GSAP + ScrollTrigger：`data-reveal`、首屏行遮罩上升、十字网格随指针变色、视差。reduced-motion 全停，JS 失败 3 秒后强制显示 |
| 3D | `ThreeStage`（懒加载、屏外 / 隐藏标签页暂停、DPR ≤ 2、卸载时释放 GPU 资源、无 WebGL 时显示 poster）+ 示例场景。`site.ts` 一行切换首屏 |
| 表单 | Resend + Server Action + zod（三语错误信息）+ honeypot + 时间判定。env 没配时明确失败，不假装成功。`contact.form = false` 即关 |
| 部署 | Vercel Git 集成。CI = lint（token 冲突 + 三语键 + eslint）+ typecheck + build。CSP、`NEXT_PUBLIC_SITE_URL` 的 `\|\|` 回退 |
| 工具 | `npm run images`（素材 → 长边 3200・去 EXIF・q90 + 台账行）・`npm run placeholders`（公开前的占位扫描） |
| harness | `CLAUDE.md`（内容边界・三语规则・DESIGN.md 规则）・`AGENTS.md`（Next 16 / Tailwind v4 / next-intl / three 的坑）・agents：`live-verifier` / `rework-guard`・skill：`add-work` |

## 技术栈

Next.js 16（App Router, Turbopack）/ React 19 / TypeScript / Tailwind v4 / next-intl 4 / GSAP 3 / Three.js / Resend / Vercel

**不知道就一定踩的坑**（详 → [LESSONS.md](LESSONS.md)）：
1. `next/font/google` + Turbopack → 500（B-02）→ 字体走 `<link>`
2. `--color-X` 与 `--text-X` 同名 → `text-X` 变颜色（B-04）→ lint 拦
3. `NEXT_PUBLIC_*` 是构建时烧进去的（R-02 / P-10）→ 改了要重新部署
4. `/favicon.ico` 会以 locale 身份进 `[locale]`（PF-01）→ 未知 locale 必须 404

## 如果只带走三条

1. **fallback 是负债** —— 表单没配好就说"发不出去"，缺一种语言就报类型错误。宁可红，不可假。
2. **先有文字，再有画面** —— text.md 没写完的作品不做页面。
3. **全局 harness 不放项目内容** —— 否则每个新项目都从"对抗上个项目"开始。
