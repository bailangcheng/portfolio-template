# 检查清单 / Checklists

> 每条后面的编号 → [LESSONS.md](LESSONS.md)。

## 0. 开始之前（Day 0）

- [ ] **放哪些作品？** `00_inventory.xlsx` 里标出来了（3–4 个精选 + 其余）
- [ ] 每个要放的作品：`text.md` 写完了？`selects/` 选好了？（没有 → 那个作品先不做，P-15）
- [ ] **公开许可**：学校 / 公司 / 客户的作品能公开吗？照片里的人同意了吗？→ `credits.md` 写确认日期
- [ ] **联系方式**：只放邮箱 + SNS，还是也要表单？→ `site.contact.form`（W-18）
- [ ] **语言**：三种都要吗？谁写 / 谁校对中文和英文？（不写就删掉那种语言，不要拿英文顶，PF-04）
- [ ] **首屏**：`grid` / `image` / `three`？three 的话，有要展示的立体内容吗？
- [ ] 域名：有吗？在哪家注册？（发信域名也要用它）

## 1. 建项目时

- [ ] `bash scripts/new-project.sh <目标> <名字>`（不要手动 `cp -r starter/*` —— 会丢点文件）
- [ ] ★ 全局 / 祖先目录的 CLAUDE.md 没有上个项目的残留（脚本会扫，W-07）
- [ ] `npm install && npm run check` 绿
- [ ] `.gitignore` 里有 `.env.local`、原素材扩展名（psd / ai / raw …）

## 2. 每次 UI 变更（给 agent）

- [ ] 先读 `DESIGN.md`；用的颜色 / 字号 / 圆角都在里面（W-07）
- [ ] 标题字重 400，没有自作主张加粗（W-06）
- [ ] CJK 文字上没有硬写负字距（PF-03）
- [ ] token 改了 → `DESIGN.md` 与 `globals.css` 同一个 commit；颜色与字号不同名（B-04，lint 会拦）
- [ ] 新内容块有 `data-reveal`；同一元素没有 CSS transition + GSAP 两套；reduced-motion 下全部可见
- [ ] 改布局后同 viewport 实测（computed style / box），不是目测（V-07）
- [ ] **390 / 320px** 无横向溢出（`document.documentElement.scrollWidth > innerWidth` 为 `false`）
- [ ] 三种语言都看过（`/`、`/zh`、`/en` + 改到的页面）
- [ ] 加了外部图片 / 视频 / iframe / 字体源 → CSP（`next.config.ts`）同一个 commit 改

## 3. 每次加 / 改作品

- [ ] 文字出自 `text.md`；没加原文没有的成果、数字、客户名
- [ ] 三语齐全（类型会拦，但别用"先复制英文"绕过）
- [ ] 每张图有真实的 alt（三语）
- [ ] 封面裁切确认过（`focus`；必要时 PIL 复现 `object-fit: cover`）
- [ ] `docs/ASSET-SOURCES.md` 加了行；`credits.md` 未确认的人名没出现在页面上
- [ ] 单张图 > 900 KB 的警告处理了（W-17）
- [ ] `npm run check` 绿

## 4. 上线前

### 内容
- [ ] `npm run placeholders` → **0 件**（示例作品、山田 花子、example.com、占位图、占位 favicon）
- [ ] `docs/ASSET-SOURCES.md` 的 `⚠️ 待确认` 和 `占位` 全部清零
- [ ] 没有「確認中」「TBD」「Coming soon」的公开文字；没有 `href="#"`
- [ ] 外部链接全部实际打得开；SNS 地址是本人的
- [ ] 没有指向 demo / 视频的假按钮

### 元信息
- [ ] `NEXT_PUBLIC_SITE_URL` = 正式域名，**设了之后重新部署了**（R-02 / P-10）
- [ ] `curl -s https://<domain>/sitemap.xml | head` → `<loc>` 是正式域名，不是 localhost、不是空（R-03）
- [ ] 每页 `<title>` / description 三语都对；作品页的 OG 图是 cover
- [ ] favicon 换成自己的（`src/app/icon.svg`）
- [ ] `curl -sI https://<domain>/favicon.ico` → 404，不是 500（PF-01）

### 表单（开着的话）
- [ ] Resend 发信域名 `verified`（未认证 = 只能发给自己、进垃圾箱）
- [ ] 从**生产**实际发一封 → 收到了；Reply-To 是填写者的邮箱
- [ ] Preview 环境也单独确认过（Production 与 Preview 是两份变量）

### 兜底
- [ ] `npm run check` 绿；CI 绿
- [ ] 手机实机：首屏高度、3D 的发热 / 帧率、字体加载
- [ ] `grep -rn "NEXT_PUBLIC" src/` 逐个确认都是可公开的值；`RESEND_API_KEY` 没有 `NEXT_PUBLIC_` 前缀

## 5. 上线当天

- [ ] ★ 先实查，再说话（`live-verifier`，V-01）：`npx vercel ls`、`dig +short <domain>`、实际发信
- [ ] 生产只有一条路径：`main` push → Vercel（R-05）
- [ ] URL 还可能改 → 重定向用 307，不用 301（R-08）
