# Halo Blog Theme

> 一个基于 Next.js 15 + Halo CMS 的现代化博客主题，借鉴 Magic Portfolio 的优雅设计

## 项目简介

Halo Blog Theme 是一个前后端分离的博客主题项目，使用 Next.js 15 作为前端框架，Halo CMS 作为内容管理后端。项目采用 TypeScript 开发，集成 Once UI 设计系统，支持混合路由模式、主题切换、SEO 优化等现代化特性。

## 核心特性

- 🚀 **Next.js 15** - 使用 App Router 和 React Server Components
- 🎨 **Once UI** - 优雅的设计系统组件库
- 📝 **Halo CMS** - 强大的内容管理系统
- 🎯 **混合路由** - 固定路由 + 动态路由的灵活架构
- 🌓 **主题切换** - 支持深色/浅色/系统自动模式
- ⚡ **性能优化** - ISR、图片优化、代码分割
- 🔍 **SEO 友好** - 自动生成 Sitemap、RSS、OG 图片
- 📱 **响应式设计** - 完美支持桌面、平板、手机

## 技术栈

### 前端
- **Next.js 15.3.1** - React 框架
- **React 19.0.0** - UI 库
- **TypeScript 5.8.3** - 类型安全
- **@once-ui-system/core** - 设计系统
- **Sass 1.86.3** - CSS 预处理器

### 后端集成
- **Halo CMS** - 内容管理系统
- **@halo-dev/api-client** - Halo API 客户端
- **axios** - HTTP 客户端

### 开发工具
- **Biome 1.9.4** - 代码格式化和检查
- **ESLint** - 代码质量检查
- **lint-staged** - Git 提交前检查

## 项目结构

```
.
├── src/                      # 源代码目录
│   ├── app/                  # Next.js App Router 页面
│   │   ├── [slug]/           # 文章详情（动态路由）
│   │   ├── about/            # 关于页面（固定路由）
│   │   ├── contact/          # 联系页面（固定路由）
│   │   ├── pages/            # 其他独立页面（动态路由）
│   │   ├── categories/       # 分类系统
│   │   ├── tags/             # 标签系统
│   │   └── archives/         # 归档页面
│   ├── components/           # React 组件
│   ├── lib/                  # 核心业务逻辑
│   │   └── halo/             # Halo API 封装
│   ├── resources/            # 配置资源
│   ├── types/                # TypeScript 类型定义
│   └── utils/                # 工具函数
├── public/                   # 静态资源
├── reference/                # 参考项目
│   ├── magic/                # Magic Portfolio 源码
│   └── halo/                 # Halo 开发者文档
├── ai-context.md             # AI 架构文档
├── ai-guideline.md           # AI 编程规范
├── ai-needs.md               # 项目需求文档
└── README.md                 # 本文件
```

## 快速开始

### 环境要求

- Node.js 20+
- pnpm
- Halo CMS 实例（2.0+）

### 安装依赖

```bash
pnpm install
```

### 环境配置

复制 `.env.example` 到 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```bash
# Halo API 配置
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=pat_xxxxxxxxxxxxx

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Halo Blog
```

### 获取 Halo API Token

1. 登录 Halo 管理后台
2. 进入「个人中心」→「个人令牌」
3. 创建新的 Personal Access Token
4. 复制 Token 到环境变量 `HALO_API_TOKEN`

### 开发

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建

```bash
pnpm build
pnpm start
```

## 项目状态

✅ 基础架构已搭建完成

- [x] Next.js 15 项目初始化
- [x] TypeScript 配置
- [x] Once UI 组件库集成
- [x] 基础组件（Header、Footer、Providers）
- [x] Halo API 客户端结构
- [x] 基础页面（首页、关于页）
- [x] 主题系统

🚧 待开发功能

- [ ] 文章列表和详情页
- [ ] 分类和标签系统
- [ ] 独立页面（混合路由）
- [ ] 归档页面
- [ ] SEO 优化
- [ ] 搜索功能（可选）

## 开发指南

详见：
- [技术架构文档](./ai-context.md)
- [编程规范文档](./ai-guideline.md)
- [项目需求文档](./ai-needs.md)