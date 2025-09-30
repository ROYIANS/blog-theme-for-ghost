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
- npm/pnpm/yarn
- Halo CMS 实例（2.0+）

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 环境配置

创建 `.env.local` 文件：

```bash
# Halo API 配置
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=pat_xxxxxxxxxxxxx

# 站点配置
NEXT_PUBLIC_SITE_URL=https://your-blog.com
NEXT_PUBLIC_SITE_NAME=My Blog
```

### 获取 Halo API Token

1. 登录 Halo 管理后台
2. 进入「个人中心」→「个人令牌」
3. 创建新的 Personal Access Token
4. 复制 Token 到环境变量 `HALO_API_TOKEN`

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
npm run start
```

## 路由架构

### 混合路由模式

项目采用**固定路由 + 动态路由**的混合模式：

**固定路由**（核心页面）：
- `/` - 首页
- `/about` - 关于页面
- `/contact` - 联系页面
- `/archives` - 归档页面
- `/categories` - 分类列表
- `/tags` - 标签列表

**动态路由**（自动生成）：
- `/[slug]` - 文章详情
- `/pages/[...slug]` - 其他独立页面
- `/categories/[slug]` - 分类详情
- `/tags/[slug]` - 标签详情
- `/archives/[year]/[month]` - 按月归档

### 路由优先级

Next.js 自动处理路由优先级：固定路由 > 动态路由

## 配置管理

### 站点配置

编辑 `src/resources/config.ts`：

```typescript
export const siteConfig = {
  name: "博客名称",
  title: "博客标题",
  description: "博客描述",
  author: { name: "作者名称", ... },
  social: [...],
  features: { search: true, comments: true, ... },
};

export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
};
```

### Once UI 配置

编辑 `src/resources/once-ui.config.ts`：

```typescript
export const onceUIConfig = {
  style: {
    theme: "system",
    brand: "blue",
    accent: "violet",
  },
  effects: {
    gradient: { display: true },
    dots: { display: true },
  },
};
```

## 开发指南

### 添加新的固定路由

1. 更新配置：
```typescript
// src/resources/config.ts
export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
  services: '/services', // 新增
};
```

2. 创建页面文件：
```typescript
// src/app/services/page.tsx
export default async function ServicesPage() {
  const page = await getPageBySlug("services");
  return <PageContent page={page} />;
}
```

### API 调用示例

```typescript
import { getPosts, getPostBySlug } from "@/lib/halo/posts";

// 获取文章列表
const { items, total } = await getPosts({ page: 1, size: 10 });

// 获取单篇文章
const post = await getPostBySlug("hello-world");
```

## 部署

### Vercel（推荐）

1. Fork 本项目
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署

### Docker

```bash
docker build -t halo-blog-theme .
docker run -p 3000:3000 halo-blog-theme
```

### 自托管

```bash
npm run build
npm run start
```

## 开发文档

- 📘 [技术架构文档](./ai-context.md) - 详细的技术架构说明
- 📗 [编程规范文档](./ai-guideline.md) - 代码规范和最佳实践
- 📕 [项目需求文档](./ai-needs.md) - 完整的需求说明

## 参考项目

- [Magic Portfolio](./reference/magic/) - UI 设计参考
- [Halo CMS](https://halo.run/) - 内容管理系统

## 开发计划

- [x] 项目架构设计
- [x] 文档编写
- [ ] 项目初始化
- [ ] Halo API 集成
- [ ] 核心功能开发
- [ ] SEO 优化
- [ ] 性能优化
- [ ] 测试和发布

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。

---

**项目状态**: 🚧 开发准备中
**版本**: 0.1.0