---
name: project-shell-encoding-trap
description: Windows 的 Git Bash 把非 ASCII 转成本地代码页，curl 传日语/中文会乱码。用 Node。
metadata:
  type: project
---

**这台 Windows 机的 Git Bash 传非 ASCII（UTF-8）给 curl 会乱码。**
shell 会先转成本地代码页再发。

**Why:** 邮件疏通测试时日语乱码。**在到达 API 之前就已经乱了**（调 API 查发出的内容确认）。
应用是无辜的，但一度差点被判成"网站的 bug"，**排查方向整个反了**。
同一天 `curl --data-binary @<(...)` 的进程替换在 Git Bash 上 body 根本没送到，
外层 catch 的通用报错差点被读成"服务端拒绝了"。

**How to apply:**
- 带非 ASCII 或 JSON body 的外部 API 测试**用 Node 的 `fetch`，不用 curl**。
- 发之前可以 `Buffer.from('文字','utf8').toString('hex')` 验证编码。
- **自己的测试失败时，先怀疑自己的测试路径。**

关联: [[feedback-verify-infra-live]]
