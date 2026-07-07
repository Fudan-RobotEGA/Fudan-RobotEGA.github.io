# AGENTS.md

## 回答语言
- 默认始终使用中文回复用户；只有当用户明确使用英语提问时，才改用英语回答。

## 仓库结构
- 这是复旦大学星云 EGA 机器人战队主页的单仓库 Vue + Vite 静态站点，不是 monorepo。
- 当前工程正从个人主页迁移为战队官网；后续修改应优先去个人化，避免新增个人主页语境。
- 站点一级栏目固定为：首页 / 关于战队 / 星云机甲 / 开源文档 / 联系我们。
- 代码、路径、变量等英文语境中，机器人/机甲统一使用 `robot`，不要使用 `mecha` / `mechas`；中文正文仍按语境写“机器人”或“机甲”，不要中英文混写。
- 星云 EGA 涉及英文简称时统一写作 `EGA`，不要写作 `XYEGA`。
- 关键入口：
  - `index.html`：Vite 挂载入口。
  - `vite.config.js`：Vite 构建配置，使用标准 `public/` 静态资源目录与 `dist/` 输出目录。
  - `src/main.js`、`src/App.vue`、`src/router/index.js`：应用入口、布局、路由。
  - `src/pages/*`：首页、成果/项目、文章/动态与详情页。
  - `src/content/site.json`：站点级名称、描述、导航与页脚信息。
  - `src/content/team/about.json`：战队介绍、方向、里程碑等结构化内容。
  - `src/content/robots/*`：星云机甲列表、详情 Markdown 与图片资源，列表默认按赛季展开。
  - `src/content/docs/*`：开源文档 Markdown，可包含开源项目说明、技术文档、代码库分析、赛事复盘、团建活动等。
  - `src/content/contact.json`：赞助合作、招新咨询、技术交流等联系方式。
  - `public/*`：站点级静态资源，如队徽、favicon、公共图片。

## 常用命令
- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`（与 `pnpm start` 等价）
- 生产构建：`pnpm build`
- 本地预览构建产物：`pnpm preview`
- `package.json` 中没有仓库级的 `test`、`lint`、`typecheck` 脚本，不要臆测存在这些命令。

## 内容约定
- 新开源文档、动态或技术记录放在 `src/content/docs/`。
- front matter 使用：`title`、`date`、`tags`、`categories`（可选 `sticky`、`series`）。
- `tags` 保持精简，避免一个站点出现过多零散标签。
- 星云机甲列表元数据放在 `src/content/robots/robots.json`，详情正文默认写在 `src/content/robots/<slug>.md`。
- 开源项目说明也直接写成 `src/content/docs/*.md`，不再维护独立项目分类数据。
- 文档资源放在 `src/content/docs/asset/`，机甲资源放在 `src/content/robots/asset/`。
- Markdown 中如需引用图片，继续沿用 `![说明](/文件名.png)` 的写法；构建时会从对应 `asset/` 目录自动解析。
- `robots.json` 中的封面等资源可继续写成 `"/文件名.svg"` 形式，代码会从 `src/content/robots/asset/` 自动解析。
- 文件名避免使用特殊字符，尤其是 `+`，以免影响路由地址、资源链接与后续维护稳定性。
- 写作模板参考 `src/content/docs/template.md`。

## 写作风格
- 战队官网文案应保持准确、克制、可信，避免夸张营销式表达。
- 涉及赛事、成员、奖项、合作单位、年份等事实时，以用户提供素材为准；不确定时先询问，不要编造。
- 如果文章需要给后续模型留说明，优先使用 HTML 注释，保证网页渲染时不可见。

## 生成产物
- 不要手动编辑 `dist/`（构建输出目录），除非用户明确要求修改生成结果。

## Git 与部署
- 日常开发分支是 `docs`。
- 在执行 push 之前，优先检查远程分支是否有新提交；如果远程已更新，先说明情况再决定如何处理。
- 非明确要求时，不要擅自改写历史，不要使用高风险的强制覆盖操作。
- `.github/workflows/deploy-docs.yml` 会在 push 到 `docs` 分支时触发，使用 Node 20 执行 `pnpm run build`，写入 `dist/.nojekyll`，再把 `dist` 发布到 `main` 分支。后续如改为战队服务器部署，应同步更新本段和 workflow。
- commit message 使用中文。
