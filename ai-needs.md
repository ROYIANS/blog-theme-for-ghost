# AI Needs - Halo Blog Theme 项目需求文档

## 项目背景

### 现有资源
1. **Magic Portfolio 项目**：基于 Next.js 15 的作品集模板
   - 位置：`reference/magic/`
   - 特点：优雅的 UI、Once UI 设计系统、配置驱动架构
   - 可复用：UI 框架、主题系统、组件库、配置模式

2. **Halo CMS 系统**：开源内容管理系统
   - 文档位置：`reference/halo/halo-developer-guide/`
   - 提供：管理后台、RESTful API、内容管理能力
   - 数据模型：博文、页面、分类、标签、菜单等

### 项目目标
开发一个现代化的博客主题，基于 Next.js 15 + Halo CMS，借鉴 Magic Portfolio 的 UI 设计，实现前后端分离的博客解决方案。

## 核心需求

### 1. 技术架构

#### 前端技术栈
- **框架**：Next.js 15.3.1（App Router）
- **语言**：TypeScript 5.8.3
- **UI 库**：@once-ui-system/core（来自 Magic Portfolio）
- **样式**：Sass + Tailwind CSS
- **API 客户端**：@halo-dev/api-client + axios

#### 后端集成
- **内容源**：Halo CMS
- **API 方式**：RESTful API（需要认证）
- **认证方式**：Personal Access Token
- **数据缓存**：Next.js ISR + Fetch Cache

#### 渲染策略
- 首页：ISR（60秒重新验证）
- 文章详情：SSG + ISR（1小时重新验证）
- 分类/标签页：SSR
- 独立页面：混合路由（固定 + 动态）

### 2. 功能需求

#### 2.1 核心功能（必须）

**博客文章系统**：
- [x] 文章列表展示（分页）
- [x] 文章详情页面
- [x] 文章分类浏览
- [x] 文章标签浏览
- [x] 文章归档（按年/月）
- [x] 文章搜索（可选，后期）
- [x] 文章目录（TOC）
- [x] 文章分享功能

**独立页面系统**（混合路由）：
- [x] 固定路由：About、Contact
- [x] 动态路由：其他页面自动支持
- [x] 页面可见性控制（PUBLIC/INTERNAL/PRIVATE）
- [x] 支持嵌套路径（如 docs/getting-started）

**导航和菜单**：
- [ ] 从 Halo 获取主菜单配置
- [ ] 响应式导航栏
- [ ] 移动端菜单适配
- [ ] 面包屑导航

**主题系统**：
- [x] 深色/浅色/系统自动切换
- [x] 主题配置持久化（localStorage）
- [x] 防闪烁脚本（服务端注入）
- [x] Once UI 主题配置

#### 2.2 SEO 优化（必须）

- [x] 自动生成 Meta 标签
- [x] Open Graph 图片生成
- [x] 结构化数据（Schema.org）
- [x] Sitemap 自动生成
- [x] RSS Feed 生成
- [x] robots.txt 配置

#### 2.3 性能优化（必须）

- [x] 图片优化（Next.js Image）
- [x] 代码分割（动态导入）
- [x] API 缓存策略（ISR）
- [x] 静态资源优化
- [x] 字体优化（Geist）

#### 2.4 扩展功能（可选，后期）

- [ ] 全文搜索（Algolia/Meilisearch）
- [ ] 评论系统（Giscus/Utterances）
- [ ] 阅读统计（Umami/Plausible）
- [ ] Newsletter 订阅（Mailchimp/ConvertKit）
- [ ] 多语言支持（i18n）

### 3. 路由架构需求

#### 3.1 混合路由模式（已确定）

**设计原则**：
- 核心页面使用固定路由（性能最优、类型安全）
- 其他页面使用动态路由（灵活、自动支持新增）
- Next.js 自动处理路由优先级

**路由映射**：

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 固定 | 首页（文章列表） |
| `/[slug]` | 动态 | 文章详情 |
| `/about` | 固定 | 关于页面 |
| `/contact` | 固定 | 联系页面 |
| `/pages/[...slug]` | 动态 | 其他独立页面（回退） |
| `/archives` | 固定 | 归档页 |
| `/archives/[year]` | 动态 | 年度归档 |
| `/archives/[year]/[month]` | 动态 | 月度归档 |
| `/categories` | 固定 | 分类列表 |
| `/categories/[slug]` | 动态 | 分类详情 |
| `/tags` | 固定 | 标签列表 |
| `/tags/[slug]` | 动态 | 标签详情 |

**固定路由配置**：
```typescript
// src/resources/config.ts
export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
} as const;
```

#### 3.2 路由实现要求

- 固定路由：直接创建页面文件（如 `app/about/page.tsx`）
- 动态路由：使用 `generateStaticParams` 生成静态路径
- ISR 配置：`revalidate = 3600`（1小时）
- 404 处理：使用 `notFound()` 函数
- 错误处理：创建 `error.tsx` 文件

### 4. UI/UX 需求

#### 4.1 设计风格
- **简洁优雅**：借鉴 Magic Portfolio 的设计风格
- **响应式**：支持桌面、平板、手机
- **一致性**：使用 Once UI 组件保证视觉统一
- **可访问性**：遵循 ARIA 标准

#### 4.2 核心组件

**布局组件**：
- Header（导航、搜索、主题切换）
- Footer（版权、社交链接）
- Sidebar（可选）

**文章组件**：
- PostCard（文章卡片）
- PostList（文章列表）
- PostHero（文章头部）
- PostContent（内容渲染）
- PostMeta（元信息）
- PostTOC（目录）
- PostShare（分享）

**页面组件**：
- PageContent（独立页面内容）
- PageHero（页面头部）

**通用组件**：
- Pagination（分页）
- SearchBox（搜索框）
- ThemeToggle（主题切换）
- LoadingSpinner（加载指示）
- ScrollToTop（回到顶部）

**分类/标签组件**：
- CategoryCard（分类卡片）
- CategoryList（分类列表）
- TagBadge（标签徽章）
- TagCloud（标签云）

### 5. 数据管理需求

#### 5.1 Halo API 集成

**API 客户端配置**：
```typescript
// 使用 createCoreApiClient（支持完整 API）
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`,
  },
});
export const coreApiClient = createCoreApiClient(axiosInstance);
```

**数据获取函数**（必须实现）：

**文章相关**：
- `getPosts(params)` - 获取文章列表
- `getPostBySlug(slug)` - 根据 slug 获取文章
- `getPostContent(name)` - 获取文章内容
- `getRelatedPosts(post)` - 获取相关文章

**分类相关**：
- `getCategories()` - 获取所有分类
- `getCategoryBySlug(slug)` - 获取分类详情
- `getPostsByCategory(slug)` - 获取分类文章

**标签相关**：
- `getTags()` - 获取所有标签
- `getTagBySlug(slug)` - 获取标签详情
- `getPostsByTag(slug)` - 获取标签文章

**页面相关**：
- `getAllPages()` - 获取所有独立页面
- `getPageBySlug(slug)` - 根据 slug 获取页面
- `getPageContent(name)` - 获取页面内容

**菜单相关**：
- `getPrimaryMenu()` - 获取主菜单
- `getMenuByName(name)` - 获取指定菜单

**站点相关**：
- `getSiteSettings()` - 获取站点设置
- `getSiteStats()` - 获取站点统计

#### 5.2 数据缓存策略

- 文章列表：60 秒重新验证
- 文章详情：3600 秒（1小时）重新验证
- 分类/标签列表：构建时缓存（force-cache）
- 独立页面：3600 秒重新验证
- 站点设置：构建时缓存

### 6. 配置管理需求

#### 6.1 站点配置（src/resources/config.ts）

```typescript
export const siteConfig = {
  name: "博客名称",
  title: "博客标题",
  description: "博客描述",
  url: "https://your-blog.com",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  author: {
    name: "作者名称",
    email: "author@email.com",
    avatar: "/avatar.jpg",
    bio: "作者简介",
  },
  social: [
    { name: "GitHub", icon: "github", url: "https://github.com/..." },
    { name: "Twitter", icon: "twitter", url: "https://twitter.com/..." },
  ],
  features: {
    search: true,
    comments: true,
    newsletter: false,
    darkMode: true,
  },
  pagination: {
    perPage: 10,
  },
};

export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
} as const;
```

#### 6.2 Once UI 配置（src/resources/once-ui.config.ts）

```typescript
export const onceUIConfig = {
  style: {
    theme: "system",
    neutral: "gray",
    brand: "blue",
    accent: "violet",
    border: "playful",
    surface: "translucent",
  },
  effects: {
    gradient: { display: true },
    dots: { display: true },
  },
  fonts: {
    display: { family: "Geist", weight: 700 },
    body: { family: "Geist", weight: 400 },
    code: { family: "Geist Mono", weight: 400 },
  },
};
```

### 7. 环境变量需求

```bash
# .env.local

# Halo API 配置（必须）
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=pat_xxxxxxxxxxxxx

# 站点配置（必须）
NEXT_PUBLIC_SITE_URL=https://your-blog.com
NEXT_PUBLIC_SITE_NAME=My Blog

# 功能开关（可选）
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_COMMENTS=true

# 第三方服务（可选，后期）
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_URL=
```

### 8. 开发规范需求

#### 8.1 代码质量
- 严格的 TypeScript 类型检查
- 使用 Biome 进行代码格式化
- ESLint 进行代码检查
- 所有 API 调用必须有错误处理

#### 8.2 命名规范
- 组件：PascalCase（如 `PostCard`）
- 文件：PascalCase（如 `PostCard.tsx`）
- 函数：camelCase（如 `getPosts`）
- 常量：UPPER_SNAKE_CASE（如 `FIXED_ROUTES`）

#### 8.3 提交规范
- 使用 Conventional Commits
- 格式：`<type>: <description>`
- 类型：feat, fix, docs, style, refactor, test, chore

### 9. 部署需求

#### 9.1 目标平台
- Vercel（推荐）
- Docker（可选）
- 自托管（可选）

#### 9.2 构建要求
- 构建时生成静态页面（SSG）
- 支持 ISR 增量静态生成
- 优化构建速度和包体积

### 10. 文档需求

#### 10.1 开发文档（已完成）
- ✅ `ai-context.md` - 技术架构文档
- ✅ `ai-guideline.md` - 编程规范文档
- ✅ `ai-needs.md` - 项目需求文档（本文档）

#### 10.2 用户文档（待完成）
- [ ] `README.md` - 项目介绍和快速开始
- [ ] `DEPLOYMENT.md` - 部署指南
- [ ] `CONFIGURATION.md` - 配置说明
- [ ] `CHANGELOG.md` - 更新日志

### 11. 测试需求

#### 11.1 单元测试
- API 函数测试
- 工具函数测试
- 组件单元测试

#### 11.2 集成测试（可选）
- 页面渲染测试
- 路由跳转测试
- API 集成测试

### 12. 迭代计划

#### Phase 1: 基础架构（优先级：高）
- [ ] 项目初始化
- [ ] Halo API 客户端配置
- [ ] 路由结构搭建
- [ ] 基础布局组件（Header、Footer）
- [ ] 主题系统实现

#### Phase 2: 核心功能（优先级：高）
- [ ] 文章列表页面
- [ ] 文章详情页面
- [ ] 分类/标签页面
- [ ] 独立页面系统（混合路由）
- [ ] 归档页面

#### Phase 3: SEO 优化（优先级：高）
- [ ] Meta 标签生成
- [ ] OG 图片生成
- [ ] Sitemap 生成
- [ ] RSS Feed 生成
- [ ] 结构化数据

#### Phase 4: 性能优化（优先级：中）
- [ ] 图片优化
- [ ] 代码分割
- [ ] 缓存策略优化
- [ ] 构建优化

#### Phase 5: 扩展功能（优先级：低）
- [ ] 搜索功能
- [ ] 评论系统
- [ ] 阅读统计
- [ ] Newsletter 订阅

## 技术约束

### 必须遵守
1. ✅ 使用 Halo CMS 作为内容源（不使用 Ghost）
2. ✅ 采用混合路由模式（固定路由 + 动态路由）
3. ✅ 借鉴 Magic Portfolio 的 UI 设计
4. ✅ 使用 Once UI 组件库
5. ✅ 所有配置通过配置文件管理
6. ✅ 严格的 TypeScript 类型安全

### 避免使用
1. ❌ Ghost CMS 相关依赖（@tryghost/content-api）
2. ❌ 硬编码内容（使用配置文件）
3. ❌ 全局样式污染（使用 CSS Modules）
4. ❌ 客户端渲染（优先服务端渲染）

## 成功标准

### 功能完整性
- [ ] 所有核心功能正常运行
- [ ] 路由系统正确工作
- [ ] API 集成稳定可靠
- [ ] SEO 优化到位

### 性能指标
- [ ] Lighthouse 性能评分 > 90
- [ ] 首次内容绘制（FCP）< 1.5s
- [ ] 最大内容绘制（LCP）< 2.5s
- [ ] 累积布局偏移（CLS）< 0.1

### 代码质量
- [ ] TypeScript 无类型错误
- [ ] ESLint 无错误
- [ ] 代码格式统一
- [ ] 测试覆盖率 > 60%

### 用户体验
- [ ] 响应式设计完美
- [ ] 主题切换流畅
- [ ] 页面加载快速
- [ ] 交互体验良好

## 参考资源

### 项目参考
- Magic Portfolio 源码：`reference/magic/`
- Halo 开发者文档：`reference/halo/halo-developer-guide/`

### 官方文档
- Next.js 文档：https://nextjs.org/docs
- Halo API 文档：https://api.halo.run
- Once UI 文档：https://once-ui.com/docs
- TypeScript 文档：https://www.typescriptlang.org/docs

### 工具和库
- @halo-dev/api-client：Halo 官方 JS 客户端
- @once-ui-system/core：Once UI 组件库
- axios：HTTP 客户端
- isomorphic-dompurify：HTML 清理

## 联系方式

如有任何问题或需求变更，请及时更新本文档。

---

**文档版本**: 1.0.0
**最后更新**: 2025-09-30
**状态**: 需求确认中 → 开发准备中