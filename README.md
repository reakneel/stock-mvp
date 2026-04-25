# 股票组合监视平台

一个面向个人投资者的轻量级投资组合管理系统，支持实时监控多个投资组合的表现。

## 特性

- **零注册使用**：无需账号即可创建和分享投资组合
- **双模式支持**：实盘组合（记录持仓数量）+ 模拟组合（仅记录仓位比例）
- **实时行情**：通过新浪财经 API 获取 A 股实时价格
- **全球视野**：中国、日本、韩国、美国等主要市场指数
- **期货监控**：原油期货、贵金属期货实时行情
- **收益分析**：30 天收益趋势图、当日盈亏、累计盈亏
- **安全分享**：通过短码分享组合

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **数据源**: 新浪财经 API
- **数据库**: Supabase (PostgreSQL) - 待集成

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 到 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── page.tsx              # 首页仪表盘
│   ├── layout.tsx            # 根布局
│   ├── create/page.tsx       # 创建组合
│   ├── portfolio/[id]/       # 组合详情
│   ├── portfolios/page.tsx   # 组合列表
│   └── s/[shortCode]/        # 短码分享页面
├── components/
│   ├── ui/                   # 基础 UI 组件
│   └── features/             # 业务组件
├── hooks/                    # 自定义 Hooks
├── lib/                      # 工具函数和 API 客户端
└── types/                    # TypeScript 类型定义
```

## API 说明

### 新浪财经 API

本项目使用新浪财经免费 API 获取实时行情数据：

- A 股：`https://hq.sinajs.cn/list=sh600519`
- 指数：`https://hq.sinajs.cn/list=sh000001`
- 期货：`https://hq.sinajs.cn/list=hf_CL`

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署

## 开发路线图

- [x] 基础架构搭建
- [x] 实时行情获取
- [x] 首页仪表盘
- [x] 组合创建页面
- [x] 组合详情页面
- [ ] Supabase 数据库集成
- [ ] 短码分享功能
- [ ] WebSocket 实时推送
- [ ] 用户认证系统
- [ ] 交易记录管理

## 注意事项

⚠️ **免责声明**：本项目仅供学习参考，不构成任何投资建议。股市有风险，投资需谨慎。

## License

MIT
