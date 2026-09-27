# PLAYBOOK — 作品集从素材到上线

> 顺序本身就是规则：**素材 → 文字 → 结构 → 视觉 → 实装 → 上线**。
> 前一步没完成就开始后一步，是返工的第一来源（P-15 / W-17）。

| 章 | 做什么 | 产出物 |
|---|---|---|
| 0 | 定结构（sitemap / 作品详情的顺序） | 本章，基本不用改 |
| 1 | 整理素材 | `portfolio-materials/`（仓库外） |
| 2 | 写文字 | 每个作品的 `text.md` + `profile.md` |
| 3 | 定视觉 | `DESIGN.md` |
| 4 | 建项目 → 实装 | 仓库（`new-project.sh`） |
| 5 | 3D 首屏（可选） | `components/three/scenes/*` |
| 6 | 联系表单（Resend） | Vercel 环境变量 + 认证过的发信域名 |
| 7 | 上线（Vercel） | 生产 URL |
| 8 | 更新（vibe coding） | — |

---

## 0. 网站结构

页面数量少、层级浅，是"信息清晰"最直接的保证。以下是出发点，阶段 02 会用线框确认。

### Sitemap

- **`/` TOP**：首屏（名字 + 一句定位 + 主视觉）→ 精选作品 3–4 个 → About 摘要 → 联系方式
- **`/works` 作品一览**：按 Fashion / Graphic・Ad / Web 筛选
- **`/works/[slug]` 作品详情**：ケーススタディ（下方的顺序）
- **`/about` 关于我**：经历、技能、工具、想做的工作
- **`/process` 这个网站的做法**：AI 开发过程，和其他候选人拉开差距的一页
- **`/404`**：找不到页面时，也引导回作品一览

联系方式不单独做页面：放在页脚和 About，直接写邮件地址和 SNS 链接（About 的 `#contact` 里可选开一个 Resend 表单）。
语言：日本語（`/`）・中文（`/zh`）・English（`/en`）。三种语言结构完全相同。

### 作品详情页的信息顺序

1. **タイトル** · 作品名、类别、年份
2. **キービジュアル** · 最能代表作品的一张大图
3. **概要** · 一句话，40 字以内
4. **担当範囲・期間・ツール・クレジット** · 用表格写清楚
5. **課題・背景** · 为什么做、要解决什么
6. **プロセス** · 草图、试作、过程照片。策划岗最想看这里
7. **成果** · 成品大图
8. **振り返り** · 学到什么，怎么用到 Web 工作里
9. **次の作品** · 链接到下一个作品和一览

实装：`starter/src/app/[locale]/works/[slug]/page.tsx`（顺序写死在这里）；数据形状：`starter/src/content/types.ts` 的 `Work`。

---

## 1. 素材的文件结构

原始素材和网站代码分开放。原图、PSD、AI 文件不进 Git（太大，而且上传到 GitHub 就收不回来 —— W-17）。
文件夹名 `年份_英文-slug` 里的 slug 会直接变成网址：`/works/graduation-collection`。

### A. 原始素材（Google Drive 或本地）

```
portfolio-materials/
├─ 00_inventory.xlsx      # 全部作品一览 → 标记选中的
├─ 01_profile/
│  ├─ photo/              # 本人照片（可选）
│  └─ profile.md          # 经历・技能・一句定位
├─ 02_works/
│  ├─ 2023_graduation-collection/
│  │  ├─ raw/             # 原图・PSD・AI，不动
│  │  ├─ selects/         # 网页用图 01, 02 …（第 1 张 = キービジュアル）
│  │  ├─ process/         # 草图・试作・过程照
│  │  ├─ text.md          # 案例文字
│  │  └─ credits.md       # 模特・摄影・许可
│  └─ 2024_xxxx-campaign/
├─ 03_references/         # 情绪板截图，写明出处
└─ 04_brand/              # logo・字体・名字标识
```

一键生成这个骨架（含 text.md / credits.md / profile.md 模板和 inventory 表）：

```bash
bash scripts/new-materials.sh ~/Drive/portfolio-materials
```

### B. 网站仓库（Git）

```
portfolio/
├─ DESIGN.md              # 视觉契约
├─ CLAUDE.md              # 给 Claude Code 的规则
├─ AGENTS.md              # 框架版本的坑
├─ .claude/
│  ├─ agents/             # live-verifier（实查）・rework-guard（该不该做）
│  └─ skills/add-work/    # 「加作品」的完整步骤
├─ docs/
│  ├─ ASSET-SOURCES.md    # 素材台账：来源・加工・授权
│  └─ design-source/      # 上游设计稿（只读）
├─ messages/{ja,zh,en}.json  # 界面固定文字
├─ src/assets/images/
│  ├─ works/<slug>/
│  │  ├─ cover.jpg
│  │  ├─ 01.jpg, 02.jpg …
│  │  └─ process-01.jpg …
│  └─ profile/
└─ src/content/
   ├─ site.ts             # 名字・邮件・SNS・首屏主视觉
   ├─ works.ts            # 作品数据（顺序）→ works/<slug>.ts（每个作品一个文件，三语）
   ├─ profile.ts          # About 内容
   └─ process.ts          # Process 页内容
```

> 与最初提案的一处差异：图片放在 `src/assets/images/`（static import）而不是 `public/images/`。
> 这样 Next 能在构建时知道宽高（无布局跳动）、自动生成模糊占位、由 Vercel 优化；放 `public/` 则每张图都要手写宽高。
> 视频和 3D 模型仍放 `public/media/`、`public/models/`。

### text.md 模板（每个作品一份）

```markdown
# 作品名 / English title
- カテゴリ：Fashion / Graphic・Ad / Web
- 年・制作期間：
- 担当範囲：
- 使用ツール：
- クレジット：（モデル・撮影・共同制作者／公開OKの確認日）

## 一言で（40字以内）
## 課題・背景
## 考えたこと・プロセス
## 成果
## 振り返り（Webの仕事にどうつながるか）
```

text.md 的每一栏 ↔ `Work` 的字段（`add-work` skill 按这张表搬）：

| text.md | `Work` | 页面上 |
|---|---|---|
| 作品名 | `title` | 1 |
| selects/ 第 1 张 | `cover` | 2 |
| 一言で | `summary` | 3 |
| 担当範囲 / 年・制作期間 / 使用ツール / クレジット | `facts.role` / `year`+`facts.period` / `facts.tools` / `facts.credits` | 4（空栏 → 那一行不显示） |
| 課題・背景 | `background` | 5 |
| 考えたこと・プロセス + process/ | `process.body` + `process.images` | 6 |
| 成果 + selects/ 第 2 张起 | `outcome.body` + `outcome.images` | 7 |
| 振り返り | `reflection` | 8 |
| （works.ts 的顺序） | — | 9 |

---

## 2. 写文字（先于画面）

- 先写完 `profile.md` 和**要放的每个作品**的 `text.md`，再开始做页面。写不出来的作品，先不放。
- 用一种语言写原文（通常日文），另外两种让 agent 翻译，**你来校对**。agent 不补原文没有的成果、数字、客户名。
- クレジット：写进 `credits.md`，并写**公开 OK 的确认日期**。没确认的，不写名字。
- 学校课题、公司业务的作品：确认能不能公开、能公开到什么程度（`⚠️ 待确认`）。

## 3. 定视觉

- 从 starter 的 `DESIGN.md` 出发（纸感、Manrope、轻而大的标题、一种强调色）。要改就**先改 DESIGN.md**，再让 agent 同步 `globals.css`。
- 参考网站 / 截图放 `03_references/`，在 `DESIGN.md「Visual References」`按 Source / Extract / Reject 记：学什么、不学什么。
- 首屏主视觉三选一：`grid`（默认，无素材也成立）/ `image` / `three`。

## 4. 建项目 → 实装

```bash
bash scripts/new-project.sh ~/Desktop/dev/portfolio-<name> portfolio-<name>
cd ~/Desktop/dev/portfolio-<name> && git init && npm install && npm run check
```

然后在 Claude Code 里：

1. 「site.ts 的名字・一句定位・邮箱・SNS 换成 profile.md 的内容」
2. 「profile.ts 按 profile.md 写，三语」
3. 每个作品：「把 `../portfolio-materials/02_works/2024_xxx` 加成作品」（→ `add-work` skill）
4. 删掉示例作品（`graduation-collection` / `poster-campaign` / `this-site`）和占位图
5. `process.ts` 改成你自己的做法（这一页是差异化的地方：写你怎么和 AI 分工、怎么验证）
6. `npm run placeholders` → 0

## 5. 3D 首屏（可选）

- `site.ts`：`hero.visual = { kind: "three", scene: "sample", poster }`。先用示例场景确认整体感觉。
- 自己的场景：复制 `components/three/scenes/sample.ts` → 改名 → 在 `ThreeStage.tsx` 的 `scenes` 里登记 → `scene: "<name>"`（类型会跟着更新）。
- 读 `DESIGN.md「3D」`：文字永远是 HTML；颜色从 token 取；reduced-motion 下一帧静止画面也要成立；模型放 `public/models/`、尽量 < 2 MB。
- 手机上实测：发热、帧率、首屏出现前的空白（poster 就是为此存在的）。

## 6. 联系表单（Resend）

默认开着（`site.contact.form = true`）。不需要就设 `false` —— 页脚和 About 仍然有邮箱和 SNS。

1. Resend 注册 → Domains 添加你的域名 → 按提示加 DNS（MX / SPF / DKIM）→ `verified`。
2. API Keys → 建一个只有发送权限的 key。
3. Vercel → Settings → Environment Variables（Production 和 Preview **各自**）：`RESEND_API_KEY`、`CONTACT_FROM_EMAIL`（`Portfolio <contact@你的域名>`）、`CONTACT_TO_EMAIL`。
4. 重新部署 → 在生产 URL 实际发一封 → 收件箱 + Resend Logs 都确认（`live-verifier`）。
5. 没配好时表单会显示「现在无法发送，请直接发邮件」—— 这是设计，不是 bug（R-01：绝不假装成功）。

## 7. 上线（Vercel）

1. GitHub 建 repo → push。
2. Vercel → Add New Project → Import（Framework 自动识别 Next.js，不改设置）。之后 `main` push = 生产，PR = 预览。**不要**再从本地 `vercel deploy --prod`（R-05）。
3. Domains：加自定义域名 → 按提示设 DNS。apex 和 www 选一个为正。
4. `NEXT_PUBLIC_SITE_URL` = 正式域名 → 重新部署（构建时变量，P-10）。
5. [CHECKLISTS.md](CHECKLISTS.md) §4 从头到尾。

## 8. 更新（vibe coding）

内容全在仓库里。更新 = 对 Claude Code 说一句话 → 它改 `src/content/` → `npm run check` → commit → push → Vercel 自动部署。

| 想做的事 | 说法 |
|---|---|
| 加作品 | 「把 `<文件夹>` 加成作品，放在最前」 |
| 改文字 | 「poster-campaign 的振り返り改成〇〇，三语」 |
| 换顺序 / 精选 | 「works 顺序改成 A, C, B；TOP 精选只要 A 和 C」 |
| 换首屏 | 「首屏换成 image，用 A 的 cover」 |
| 加一种语言 | 「加韩语」→ `routing.ts` + `messages/ko.json` + 类型错误逐个补（先问：谁来写韩语？） |
