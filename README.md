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
└── package.json
```

## 技术栈

- **前端**: React + Next.js
- **视频渲染**: Remotion
- **TTS**: MiniMax TTS
- **数据存储**: SQLite (better-sqlite3)
- **火柴人**: SVG 组件绘制
