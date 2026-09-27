# CLAUDE.md

本文件为 coding agent 提供本项目的工作指引。

> 本项目 = 个人作品集站（从 `portfolio-template` 起步）。部署走 Vercel（Git 集成）。
> **内容全部在仓库里（`src/content/`），没有 CMS。更新 = 让 agent 改代码（vibe coding）。**
> 事故编号（R-01 / W-06 / B-04 等）的出处是模板仓库的 `LESSONS.md`。
> `<...>` 占位符替换成项目实值。

@AGENTS.md

## 栈

Next.js 16（App Router）/ React 19 / TypeScript / Tailwind v4 / next-intl（ja・zh・en）/ GSAP + ScrollTrigger / Three.js（可选）/ Resend / Vercel

## 输入从哪来（先读）

| 要什么 | 看哪里 |
|---|---|
| 视觉 token / 组件 / 动效 / 3D 规则 | 根目录 `DESIGN.md`（可执行版）↔ `src/app/globals.css` |
| 设计原稿（上游，只读快照） | `docs/design-source/<...>` |
| 作品正文（每个作品的原文） | `<portfolio-materials 的路径>/02_works/<年_slug>/text.md`（仓库外） |
| 署名・公开许可 | 同上 `credits.md`（带确认日期） |
| 个人经历・一句定位 | `<portfolio-materials>/01_profile/profile.md` |
| 素材的来源・加工・授权 | `docs/ASSET-SOURCES.md` |

冲突时的优先级：本人最新决定（写明日期）→ `DESIGN.md` / 已认可的设计稿 → text.md / profile.md（事实）→ 现有文案。
- `docs/design-source/_local/` 已被 gitignore：含雇主・个人信息的底稿，**绝不进仓库、绝不公开**。
- 上游之间矛盾、或没有出处的公开文字 → **停下来问**，不要自己写一个（P-15）。

## ⚠️ RULE: 内容边界（比代码规则更重要）

- 作品正文 = text.md 原文主导的三语翻译。**不改写、不补结论、不加成果 / 数字 / 雇主 / 客户 / 奖项。**
- 未确认的事实（年份、担当、署名、联系方式）→ 值留 `undefined` / `null`，组件**什么都不渲染**。公开页面绝不出现「確認中」「TBD」「000-0000」。
- 三语一起改：`src/content/` 的文字是 `L<T>`（ja / zh / en 必须齐），`messages/*.json` 的键三份必须一致（`npm run lint` 会拦）。**不要拿英文顶替另一种语言。**
- 翻译：ja 用自然的です・ます或体言止め（看现有语气），zh 用简体，en 用平实的英语。专有名词（作品名、工具名）保持原样。
- 概念图・开发中截图要标明；没有真实的 demo / 视频时不放播放、下载、购买按钮。
- 新增素材同一个 commit 更新 `docs/ASSET-SOURCES.md`；原始素材（PSD / AI / RAW）不进仓库。

## ⚠️ RULE: 改 UI 前先读 DESIGN.md

- 不得发明 `DESIGN.md` 里没有的颜色、字号、字重、圆角、阴影或组件风格。token 变化时同一次变更同步 `DESIGN.md` 与 `globals.css`。
- 标题字重是 400（轻而大），不要自行加粗（W-06）。
- ⚠️ `--color-X` 与 `--text-X` 不能同名（`text-X` 会变成颜色，B-04）。`npm run lint` 会拦。
- CJK 标题不要硬写负的 `tracking-[…]`：字间距走 `--ls-*` 变量，按 `:lang()` 切换。
- 动效：新内容块加 `data-reveal`（图片外框 `data-reveal="media"`）；同一元素不要同时有 CSS transition 和 GSAP；必须支持 reduced-motion；内容绝不能依赖 JS 才可见。
- 3D：生命周期只在 `ThreeStage`，场景只画画；文字永远是 HTML；颜色从 token 取。
- 改布局后与设计稿在同一 viewport 实测对比（computed style / box），不要凭感觉（V-07）。

## 路由

| 路径 | 文件 |
|------|------|
| `/` | `src/app/[locale]/page.tsx`（首屏 → 精选作品 → About 摘要 → 联系方式） |
| `/works` | `src/app/[locale]/works/page.tsx`（`?category=fashion|graphic|web` 筛选） |
| `/works/[slug]` | `src/app/[locale]/works/[slug]/page.tsx`（只生成 `works.ts` 里有的；其余 404） |
| `/about`（`#contact`） | `src/app/[locale]/about/page.tsx` |
| `/process` | `src/app/[locale]/process/page.tsx` |
| 404 | `src/app/[locale]/not-found.tsx`（引导回作品一览） |

语言：`src/i18n/routing.ts` 是单一源。默认 `ja` 无前缀，`/zh`、`/en` 有前缀。导航 = `src/content/site.ts` 的 `navItems` + `messages/*.json` 的 `nav.*`。

## 内容层

| 改什么 | 改哪里 |
|---|---|
| 名字・一句定位・邮箱・SNS・首屏主视觉・表单开关 | `src/content/site.ts` |
| 作品顺序（= 一览 = 下一个作品） | `src/content/works.ts` |
| 某个作品的文字・图片 | `src/content/works/<slug>.ts` |
| About | `src/content/profile.ts` |
| Process | `src/content/process.ts` |
| 界面固定文字（导航、节标题、表单） | `messages/{ja,zh,en}.json` |

- 读取 `L<T>` 一律用 `pick(value, locale)`（`src/content/pick.ts`）。
- 图片放 `src/assets/images/works/<slug>/` 并 static import。用 `npm run images -- <素材目录> <slug>` 生成（长边 3200・去 EXIF・q90）。
- **加作品的完整步骤 → `.claude/skills/add-work/SKILL.md`**（用户说「加作品」「把这个文件夹做成作品」时照做）。

## 常见错误

- 不用 `next/font/google`；字体走 `[locale]/layout.tsx` 的 `<link>`（B-02）。CJK 字体按语言只加载一种。
- Tailwind v4 没有 `tailwind.config.js`；token 在 `globals.css` 的 `@theme inline {}`。断点：sm=431 / md=801 / 2xl=1550。
- Next 16：`params` 是 Promise；`middleware.ts` → `src/proxy.ts`。
- 站内链接用 `SmartLink` / `@/i18n/navigation`；静态文件 URL（`/_next/...`）必须用普通 `<a>`（`SmartLink` 已处理）。
- CSP（`next.config.ts`）：加外部图片 / 视频 / iframe / 字体源时，CSP 与相应配置**同一个 commit 改**。`frame-ancestors 'none'` → iframe 里测不了页面。
- 表单：env 没配时必须明确失败（`unconfigured`），绝不假装发送成功（R-01 / P-6）。
- 生产部署只有一条路：`main` push → Vercel。不要在本地 `vercel deploy --prod`（R-05 / P-13）。

## 验证

- 内嵌预览里 `requestAnimationFrame` 可能不跑（0fps）：**看不见 ≠ 坏了，截图空白 ≠ 通过**。dev 下用 `window.__gsap.ticker.tick()` 推进动画、`window.__three.frame()` + `gl.readPixels` 验证 3D（V-06）。
- 每页 **390 / 320px** 无横向溢出：`document.documentElement.scrollWidth > innerWidth` 为 `false`。
- 三种语言都打开看一遍（至少 `/`、`/works`、一个作品页）。

## 命令

```bash
npm run dev           # http://localhost:3000
npm run check         # lint（token 冲突 + 三语键一致 + eslint）+ typecheck + build（提交前运行）
npm run images -- <素材目录> <slug>
npm run placeholders  # 公开前：示例文字・example.com・占位图 必须为 0
```

## 变更时检查清单

- [ ] UI 工作前读过 `DESIGN.md`；改布局后实测对比
- [ ] 新公开文字有出处（text.md / profile.md / 本人确认）；三语齐全
- [ ] 未确认的信息没有以占位形式公开
- [ ] 使用的 token 已定义；`DESIGN.md` 与 `globals.css` 同步
- [ ] 新素材写进了 `docs/ASSET-SOURCES.md`
- [ ] 390 / 320px 无横向溢出
- [ ] 跑过 `npm run check`
