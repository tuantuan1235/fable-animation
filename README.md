# 寓言动画创作平台

> 让单人创作者在 1 小时内，把一个"寓言想法"变成可发布的短视频。

## 项目结构

```
fable-animation-platform/
├── apps/
│   ├── web/                  # Next.js 前端（剧本编辑器 + 管理界面）
│   └── remotion-studio/      # Remotion 视频渲染 studio
├── packages/
│   ├── shared/               # 共享类型定义 + 工具函数
│   ├── db/                   # SQLite 数据层
│   ├── stickfigure/          # 火柴人 SVG 组件库
│   └── tts/                  # MiniMax TTS 封装
├── Dockerfile                # Docker 镜像构建
├── docker-compose.yml        # 容器编排
└── DEPLOY.md                 # 部署指南
```

## 技术栈

- **前端**: React + Next.js 14
- **视频渲染**: Remotion 4
- **TTS**: MiniMax TTS
- **数据存储**: SQLite (sql.js，纯 JS 无需 C++ 编译)
- **火柴人**: SVG 组件绘制
- **包管理**: npm workspaces

## 本地开发

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 部署

参见 [DEPLOY.md](./DEPLOY.md)，推荐用 Docker Compose 部署。

## 环境变量

复制 `.env.example` 为 `.env` 填入 MiniMax TTS 凭据：

```
MINIMAX_API_KEY=your_api_key_here
MINIMAX_GROUP_ID=your_group_id_here
```

## 启动 Remotion Studio（视频预览）

```bash
npm run dev:studio
```
