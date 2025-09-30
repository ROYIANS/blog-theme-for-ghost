# AI Context - Halo Blog Theme 技术架构文档

## 项目概述

Halo Blog Theme 是一个基于 Next.js 15 的现代化博客主题项目，使用 Halo CMS 作为 Headless CMS 后端。项目采用 TypeScript 开发，集成 Once UI 设计系统，借鉴 Magic Portfolio 的 UI 框架和架构设计，通过 Halo API 管理博客内容，实现前后端分离的现代化博客解决方案。

## 技术栈详情

### 核心框架
- **Next.js 15.3.1**: 主框架，使用 App Router 架构 + React Server Components
- **React 19.0.0**: UI 库
- **TypeScript 5.8.3**: 类型安全
- **Node.js**: 运行环境

### UI 与样式
- **@once-ui-system/core**: 核心设计系统组件库（来自 Magic Portfolio）
- **SASS 1.86.3**: CSS 预处理器
- **classnames**: 动态 CSS 类名管理

### 内容管理与 API
- **@halo-dev/api-client**: Halo 官方 JavaScript API 客户端
- **axios**: HTTP 客户端
- **gray-matter**: Frontmatter 解析（用于自定义内容，可选）

### 开发工具
- **@biomejs/biome 1.9.4**: 代码格式化和检查
- **ESLint**: 代码质量检查
- **lint-staged**: Git 提交前代码检查

### 其他依赖
- **react-icons 5.5.0**: 图标库
- **transliteration 2.3.5**: 文本转换
- **cookie 1.0.2**: Cookie 处理

## 项目结构

```
src/
├── app/                          # Next.js App Router 页面
│   ├── [slug]/                   # 文章详情页（动态路由）
│   │   └── page.tsx
│   ├── about/                    # 关于页面（固定路由）
│   │   └── page.tsx
│   ├── contact/                  # 联系页面（固定路由）
│   │   └── page.tsx
│   ├── pages/                    # 独立页面系统（混合路由）
│   │   └── [...slug]/            # 动态路由回退
│   │       └── page.tsx
│   ├── archives/                 # 归档页面
│   │   ├── [year]/               # 按年归档
│   │   │   ├── [month]/          # 按月归档
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── categories/               # 分类系统
│   │   ├── [slug]/               # 分类详情页
│   │   │   └── page.tsx
│   │   └── page.tsx              # 分类列表页
│   ├── tags/                     # 标签系统
│   │   ├── [slug]/               # 标签详情页
│   │   │   └── page.tsx
│   │   └── page.tsx              # 标签列表页
│   ├── authors/                  # 作者页面
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api/                      # API 路由
│   │   ├── og/                   # Open Graph 图片生成
│   │   │   ├── generate/
│   │   │   │   └── route.tsx
│   │   │   └── proxy/
│   │   │       └── route.ts
│   │   ├── rss/                  # RSS Feed 生成
│   │   │   └── route.ts
│   │   ├── sitemap/              # 动态 Sitemap
│   │   │   └── route.ts
│   │   └── search/               # 搜索接口（可选）
│   │       └── route.ts
│   ├── layout.tsx                # 根布局（主题、字体、背景效果）
│   ├── page.tsx                  # 首页
│   ├── not-found.tsx             # 404 页面
│   ├── loading.tsx               # 加载状态
│   ├── error.tsx                 # 错误页面
│   ├── robots.ts                 # robots.txt 生成
│   └── sitemap.ts                # sitemap.xml 生成
│
├── components/                   # React 组件
│   ├── layout/
│   │   ├── Header.tsx            # 页头组件（导航、搜索、主题切换）
│   │   ├── Footer.tsx            # 页脚组件
│   │   └── Sidebar.tsx           # 侧边栏（可选）
│   ├── post/
│   │   ├── PostCard.tsx          # 文章卡片
│   │   ├── PostList.tsx          # 文章列表
│   │   ├── PostHero.tsx          # 文章头部
│   │   ├── PostContent.tsx       # 文章内容渲染
│   │   ├── PostMeta.tsx          # 文章元信息
│   │   ├── PostTOC.tsx           # 目录导航
│   │   └── PostShare.tsx         # 社交分享
│   ├── category/
│   │   ├── CategoryCard.tsx      # 分类卡片
│   │   └── CategoryList.tsx      # 分类列表
│   ├── tag/
│   │   ├── TagBadge.tsx          # 标签徽章
│   │   └── TagCloud.tsx          # 标签云
│   ├── author/
│   │   ├── AuthorCard.tsx        # 作者卡片
│   │   └── AuthorInfo.tsx        # 作者信息
│   ├── common/
│   │   ├── Pagination.tsx        # 分页组件
│   │   ├── SearchBox.tsx         # 搜索框
│   │   ├── ThemeToggle.tsx       # 主题切换
│   │   ├── ScrollToTop.tsx       # 回到顶部
│   │   └── LoadingSpinner.tsx    # 加载指示器
│   ├── Providers.tsx             # 上下文提供者
│   └── index.ts                  # 组件导出
│
├── lib/                          # 核心业务逻辑
│   ├── halo/
│   │   ├── client.ts             # Halo API 客户端配置
│   │   ├── posts.ts              # 文章相关 API
│   │   ├── categories.ts         # 分类相关 API
│   │   ├── tags.ts               # 标签相关 API
│   │   ├── pages.ts              # 独立页面 API
│   │   ├── menus.ts              # 菜单 API
│   │   ├── comments.ts           # 评论 API（可选）
│   │   └── site.ts               # 站点设置 API
│   ├── mdx/
│   │   ├── components.tsx        # MDX 组件映射
│   │   └── plugins.ts            # MDX 插件配置
│   └── seo/
│       ├── meta.ts               # Meta 标签生成
│       ├── schema.ts             # Schema.org 结构化数据
│       └── og.ts                 # OG 图片生成工具
│
├── resources/                    # 配置资源
│   ├── config.ts                 # 全局配置（站点信息、主题配置、固定路由）
│   ├── once-ui.config.ts         # Once UI 配置
│   ├── navigation.ts             # 导航配置
│   ├── icons.ts                  # 图标库
│   ├── custom.css                # 自定义样式
│   └── index.ts                  # 资源导出
│
├── types/                        # TypeScript 类型定义
│   ├── halo.types.ts             # Halo API 数据类型
│   ├── post.types.ts             # 文章类型
│   ├── category.types.ts         # 分类类型
│   ├── tag.types.ts              # 标签类型
│   ├── page.types.ts             # 页面类型
│   ├── config.types.ts           # 配置类型
│   └── index.ts                  # 类型导出
│
├── utils/                        # 工具函数
│   ├── formatDate.ts             # 日期格式化
│   ├── excerpt.ts                # 摘要生成
│   ├── readingTime.ts            # 阅读时间计算
│   ├── slugify.ts                # URL Slug 生成
│   └── index.ts                  # 工具导出
│
└── hooks/                        # React Hooks
    ├── useTheme.ts               # 主题 Hook
    ├── useSearch.ts              # 搜索 Hook
    └── usePagination.ts          # 分页 Hook
```

## 核心架构设计

### 1. Halo API 集成架构

#### 1.1 API 客户端配置

**文件**: `src/lib/halo/client.ts`

```typescript
import axios from "axios";
import { createPublicApiClient } from "@halo-dev/api-client";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL || "http://localhost:8090",
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`,
  },
  timeout: 10000,
});

export const haloClient = createPublicApiClient(axiosInstance);
```

#### 1.2 数据获取模式

**文章获取** (`src/lib/halo/posts.ts`):

```typescript
import { haloClient } from "./client";
import { PostVo } from "@/types/halo.types";

// 获取文章列表
export async function getPosts(params?: {
  page?: number;
  size?: number;
  categoryName?: string;
  tagName?: string;
  sort?: string[];
}): Promise<{ items: PostVo[]; total: number; hasNext: boolean }> {
  const response = await haloClient.post.listPosts({
    page: params?.page || 1,
    size: params?.size || 10,
    categoryName: params?.categoryName,
    tagName: params?.tagName,
    sort: params?.sort || ["spec.publishTime,desc"],
  });

  return {
    items: response.data.items,
    total: response.data.total,
    hasNext: response.data.hasNext,
  };
}

// 获取单篇文章
export async function getPostByName(name: string): Promise<PostVo> {
  const response = await haloClient.post.getPost({ name });
  return response.data;
}

// 获取文章内容
export async function getPostContent(name: string): Promise<string> {
  const response = await haloClient.post.getPostContent({ name });
  return response.data.content;
}
```

#### 1.3 数据缓存策略

**使用 Next.js Fetch Cache**:

```typescript
// 文章列表 - 重新验证周期 60 秒
export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`, {
    next: { revalidate: 60 },
  });
  return response.json();
}

// 文章详情 - ISR 按需重新验证
export async function getPost(slug: string) {
  const response = await fetch(`${API_URL}/posts/${slug}`, {
    next: { revalidate: 3600 }, // 1 小时
  });
  return response.json();
}

// 静态数据 - 构建时获取
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "force-cache",
  });
  return response.json();
}
```

### 2. 路由架构

#### 2.1 混合路由设计（固定路由 + 动态路由）

**设计理念**：
- **核心页面使用固定路由**：About、Contact 等常用页面，性能最优、类型安全
- **其他页面使用动态路由**：自动支持 Halo 后台新增的页面，无需修改代码
- **路由优先级**：Next.js 自动处理，固定路由优先级高于动态路由

**固定路由配置** (`src/resources/config.ts`):

```typescript
// 固定路由列表（从动态路由中排除）
export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
} as const;

export type FixedRouteName = keyof typeof FIXED_ROUTES;
```

#### 2.2 路由映射表

| 路由 | 页面 | 路由类型 | 数据源 | 渲染方式 |
|------|------|---------|--------|---------|
| `/` | 首页 | 固定 | 文章列表 | SSR/ISR |
| `/[slug]` | 文章详情 | 动态 | 文章内容 | SSG/ISR |
| `/about` | 关于页面 | 固定 | 独立页面 | SSG/ISR |
| `/contact` | 联系页面 | 固定 | 独立页面 | SSG/ISR |
| `/pages/[...slug]` | 其他页面 | 动态回退 | 独立页面 | SSG/ISR |
| `/archives` | 归档页 | 固定 | 归档列表 | SSR |
| `/archives/[year]` | 年度归档 | 动态 | 按年文章 | SSR |
| `/archives/[year]/[month]` | 月度归档 | 动态 | 按月文章 | SSR |
| `/categories` | 分类列表 | 固定 | 所有分类 | SSG |
| `/categories/[slug]` | 分类详情 | 动态 | 分类文章 | SSR/ISR |
| `/tags` | 标签列表 | 固定 | 所有标签 | SSG |
| `/tags/[slug]` | 标签详情 | 动态 | 标签文章 | SSR/ISR |

#### 2.3 独立页面路由实现

**Halo 独立页面（SinglePage）路由规则**：
- Halo 系统中独立页面的访问路径为 `/:slug`（直接挂在根路径）
- 每个页面有 `spec.slug` 字段用于生成路径
- `status.permalink` 包含完整的访问 URL

**固定路由实现** (`src/app/about/page.tsx`):

```typescript
import { getPageBySlug } from "@/lib/halo/pages";
import { PageContent } from "@/components/page/PageContent";
import { generatePageMetadata } from "@/lib/seo/meta";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const page = await getPageBySlug("about");
  if (!page) return { title: "页面不存在" };
  return generatePageMetadata(page);
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  if (!page || !page.spec.publish) {
    notFound();
  }

  return <PageContent page={page} />;
}

// ISR 重新验证
export const revalidate = 3600; // 1 小时
```

**动态路由回退** (`src/app/pages/[...slug]/page.tsx`):

```typescript
import { getAllPages, getPageBySlug } from "@/lib/halo/pages";
import { PageContent } from "@/components/page/PageContent";
import { FIXED_ROUTES } from "@/resources/config";
import { notFound } from "next/navigation";

// 静态生成路径（排除固定路由）
export async function generateStaticParams() {
  const pages = await getAllPages();
  const fixedSlugs = Object.keys(FIXED_ROUTES);

  return pages
    .filter(page => !fixedSlugs.includes(page.spec.slug))
    .map(page => ({
      slug: page.spec.slug.split('/'), // 支持嵌套路径如 'docs/api'
    }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const page = await getPageBySlug(slug);
  if (!page) return { title: "页面不存在" };
  return generatePageMetadata(page);
}

// 页面渲染
export default async function DynamicPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const page = await getPageBySlug(slug);

  if (!page || !page.spec.publish || page.spec.visible !== 'PUBLIC') {
    notFound();
  }

  return <PageContent page={page} />;
}

// ISR 重新验证
export const revalidate = 3600; // 1 小时
```

**独立页面 API 封装** (`src/lib/halo/pages.ts`):

```typescript
import { coreApiClient } from "./client";
import type { SinglePageVo } from "@halo-dev/api-client";

// 获取所有已发布的公开页面
export async function getAllPages(): Promise<SinglePageVo[]> {
  try {
    const response = await coreApiClient.content.singlePage.listSinglePage({
      page: 0,
      size: 100,
      fieldSelector: ['spec.publish==true', 'spec.visible==PUBLIC'],
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return [];
  }
}

// 通过 slug 获取单个页面
export async function getPageBySlug(slug: string): Promise<SinglePageVo | null> {
  try {
    const pages = await getAllPages();
    return pages.find(page => page.spec.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch page with slug: ${slug}`, error);
    return null;
  }
}

// 获取页面内容
export async function getPageContent(name: string): Promise<string> {
  try {
    const response = await coreApiClient.content.singlePage.getContentByName({
      name,
    });
    return response.data.content || "";
  } catch (error) {
    console.error(`Failed to fetch content for page: ${name}`, error);
    throw new Error("获取页面内容失败");
  }
}
```

**认证 API 客户端** (`src/lib/halo/client.ts`):

```typescript
import axios from "axios";
import { createCoreApiClient } from "@halo-dev/api-client";

// 服务端专用客户端（带认证）
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL || "http://localhost:8090",
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`, // Personal Access Token
  },
  timeout: 10000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  console.log(`[Halo API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Halo API Error]:", error.message);
    if (error.response?.status === 401) {
      console.error("API 认证失败，请检查 HALO_API_TOKEN 环境变量");
    }
    return Promise.reject(error);
  }
);

export const coreApiClient = createCoreApiClient(axiosInstance);
```

#### 2.4 路由优先级和冲突处理

**Next.js 路由优先级规则**（自动处理）：
1. 固定路由 > 动态路由
2. 特定路径 > 通配路径
3. 示例：`/about` > `/pages/[...slug]` > `/[slug]`

**避免路由冲突**：
- 文章详情使用 `/[slug]`，位于根路径
- 独立页面核心路径（如 `/about`）使用固定路由
- 其他独立页面使用 `/pages/[...slug]` 作为回退

**路由冲突检测**（可选）：

```typescript
// src/lib/halo/route-conflict-checker.ts
export async function checkRouteConflicts() {
  const posts = await getPosts({ size: 1000 });
  const pages = await getAllPages();

  const postSlugs = new Set(posts.items.map(p => p.spec.slug));
  const pageSlugs = new Set(pages.map(p => p.spec.slug));

  const conflicts = [...postSlugs].filter(slug => pageSlugs.has(slug));

  if (conflicts.length > 0) {
    console.warn("发现路由冲突:", conflicts);
  }

  return conflicts;
}
```

#### 2.5 动态路由生成（文章详情页）

**文章详情页** (`src/app/[slug]/page.tsx`):

```typescript
import { getPosts, getPostBySlug, getPostContent } from "@/lib/halo/posts";
import { PostContent } from "@/components/post/PostContent";
import { notFound } from "next/navigation";

// 静态生成路径（构建时）
export async function generateStaticParams() {
  const { items } = await getPosts({ size: 1000 });
  return items.map((post) => ({
    slug: post.spec.slug,
  }));
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "文章不存在" };

  return {
    title: post.spec.title,
    description: post.status.excerpt,
    openGraph: {
      title: post.spec.title,
      description: post.status.excerpt,
      images: [post.spec.cover],
    },
  };
}

// 页面渲染
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const content = await getPostContent(post.metadata.name);

  return (
    <>
      <PostHero post={post} />
      <PostContent content={content} />
      <PostShare post={post} />
    </>
  );
}

// ISR 重新验证
export const revalidate = 3600; // 1 小时
```

### 3. 内容渲染架构

#### 3.1 HTML 内容渲染

**Halo 返回的是渲染好的 HTML**，需要安全渲染：

```typescript
// src/components/post/PostContent.tsx
import DOMPurify from "isomorphic-dompurify";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  // 1. 清理 HTML（防止 XSS）
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "img", "code", "pre", "blockquote"],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "id"],
  });

  // 2. 渲染 HTML
  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
```

#### 3.2 自定义渲染处理

**对特殊元素进行后处理**:

```typescript
import { useEffect, useRef } from "react";

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 1. 为所有标题添加锚点链接
    const headings = contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      const id = heading.id || slugify(heading.textContent || "");
      heading.id = id;

      const anchor = document.createElement("a");
      anchor.href = `#${id}`;
      anchor.className = "heading-anchor";
      anchor.textContent = "#";
      heading.appendChild(anchor);
    });

    // 2. 为外部链接添加 target="_blank"
    const links = contentRef.current.querySelectorAll("a");
    links.forEach((link) => {
      if (link.hostname !== window.location.hostname) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });

    // 3. 图片懒加载
    const images = contentRef.current.querySelectorAll("img");
    images.forEach((img) => {
      img.loading = "lazy";
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
```

### 4. 配置系统

#### 4.1 站点配置

**文件**: `src/resources/config.ts`

```typescript
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  logo: string;
  favicon: string;
  locale: string;
  timezone: string;
  author: {
    name: string;
    email: string;
    avatar: string;
    bio: string;
  };
  social: Array<{
    name: string;
    icon: string;
    url: string;
  }>;
  features: {
    search: boolean;
    comments: boolean;
    newsletter: boolean;
    darkMode: boolean;
  };
  pagination: {
    perPage: number;
  };
}

export const siteConfig: SiteConfig = {
  name: "My Blog",
  title: "My Blog - Powered by Halo",
  description: "A modern blog built with Next.js and Halo",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  author: {
    name: "Your Name",
    email: "your@email.com",
    avatar: "/avatar.jpg",
    bio: "Your bio here",
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
```

#### 4.2 Once UI 配置

**文件**: `src/resources/once-ui.config.ts`

```typescript
export const onceUIConfig = {
  style: {
    theme: "system",
    neutral: "gray",
    brand: "blue",
    accent: "violet",
    solid: "contrast",
    solidStyle: "flat",
    border: "playful",
    surface: "translucent",
    transition: "all",
    scaling: "100",
  },
  effects: {
    mask: { cursor: false },
    gradient: { display: true, opacity: 40 },
    dots: { display: true, opacity: 20, size: "2" },
    grid: { display: false },
    lines: { display: false },
  },
  fonts: {
    display: { family: "Geist", weight: 700 },
    heading: { family: "Geist", weight: 600 },
    body: { family: "Geist", weight: 400 },
    code: { family: "Geist Mono", weight: 400 },
  },
};
```

### 5. SEO 优化

#### 5.1 元数据生成

**文件**: `src/lib/seo/meta.ts`

```typescript
import { Metadata } from "next";
import { siteConfig } from "@/resources/config";
import { PostVo } from "@/types/halo.types";

export function generatePostMetadata(post: PostVo): Metadata {
  const url = `${siteConfig.url}/${post.spec.slug}`;
  const ogImage = post.spec.cover || `${siteConfig.url}/api/og/generate?title=${encodeURIComponent(post.spec.title)}`;

  return {
    title: `${post.spec.title} - ${siteConfig.name}`,
    description: post.status.excerpt,
    authors: [{ name: post.owner.displayName }],
    keywords: post.tags?.map((tag) => tag.spec.displayName),
    openGraph: {
      type: "article",
      title: post.spec.title,
      description: post.status.excerpt,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      publishedTime: post.spec.publishTime,
      authors: [post.owner.displayName],
      tags: post.tags?.map((tag) => tag.spec.displayName),
    },
    twitter: {
      card: "summary_large_image",
      title: post.spec.title,
      description: post.status.excerpt,
      images: [ogImage],
    },
  };
}
```

#### 5.2 结构化数据

**文件**: `src/lib/seo/schema.ts`

```typescript
import { PostVo } from "@/types/halo.types";
import { siteConfig } from "@/resources/config";

export function generateArticleSchema(post: PostVo) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.spec.title,
    "description": post.status.excerpt,
    "image": post.spec.cover,
    "datePublished": post.spec.publishTime,
    "dateModified": post.status.lastModifyTime,
    "author": {
      "@type": "Person",
      "name": post.owner.displayName,
      "url": `${siteConfig.url}/authors/${post.spec.owner}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${post.spec.slug}`,
    },
  };
}
```

#### 5.3 Sitemap 生成

**文件**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from "next";
import { getPosts } from "@/lib/halo/posts";
import { getCategories } from "@/lib/halo/categories";
import { getTags } from "@/lib/halo/tags";
import { siteConfig } from "@/resources/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 静态页面
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/archives`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/tags`, lastModified: new Date(), priority: 0.7 },
  ];

  // 文章页面
  const { items: posts } = await getPosts({ size: 1000 });
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/${post.spec.slug}`,
    lastModified: new Date(post.status.lastModifyTime),
    priority: 0.9,
  }));

  // 分类页面
  const categories = await getCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.spec.slug}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  // 标签页面
  const tags = await getTags();
  const tagPages = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.spec.slug}`,
    lastModified: new Date(),
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}
```

#### 5.4 RSS Feed

**文件**: `src/app/api/rss/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getPosts } from "@/lib/halo/posts";
import { siteConfig } from "@/resources/config";

export async function GET() {
  const { items: posts } = await getPosts({ size: 20 });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>${siteConfig.locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/api/rss" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.spec.title)}</title>
      <link>${siteConfig.url}/${post.spec.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/${post.spec.slug}</guid>
      <pubDate>${new Date(post.spec.publishTime).toUTCString()}</pubDate>
      <description>${escapeXml(post.status.excerpt)}</description>
      ${post.categories?.map((cat) => `<category>${escapeXml(cat.spec.displayName)}</category>`).join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
    return c;
  });
}
```

### 6. 主题系统

#### 6.1 主题切换实现

**文件**: `src/components/ThemeToggle.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { IconButton } from "@once-ui-system/core";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <IconButton
      icon={theme === "light" ? "sun" : "moon"}
      onClick={toggleTheme}
      aria-label="切换主题"
    />
  );
}
```

#### 6.2 防闪烁脚本

**文件**: `src/app/layout.tsx`

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 性能优化策略

### 1. 渲染策略

- **首页**: ISR（Incremental Static Regeneration），60 秒重新验证
- **文章详情**: SSG（Static Site Generation） + ISR，1 小时重新验证
- **分类/标签页**: SSR（Server-Side Rendering）
- **归档页**: SSR
- **关于页**: SSG

### 2. 图片优化

```typescript
import Image from "next/image";

export function PostCover({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  );
}
```

### 3. 数据预取

```typescript
// 在文章详情页预取相关文章
export async function getRelatedPosts(postName: string) {
  const post = await getPostByName(postName);
  const { items } = await getPosts({
    categoryName: post.categories?.[0]?.metadata.name,
    size: 5,
  });
  return items.filter((p) => p.metadata.name !== postName);
}
```

## 环境变量配置

```bash
# .env.local

# Halo API 配置
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=your_personal_access_token

# 站点配置
NEXT_PUBLIC_SITE_URL=https://your-blog.com
NEXT_PUBLIC_SITE_NAME=My Blog

# 功能开关
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_COMMENTS=true
```

## 部署配置

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_HALO_API_URL": "@halo-api-url",
    "HALO_API_TOKEN": "@halo-api-token"
  }
}
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## 开发命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
npm run format       # Biome 格式化
npm run type-check   # TypeScript 类型检查
```

## 扩展功能

### 1. 全文搜索

**使用 Algolia**:

```typescript
import algoliasearch from "algoliasearch/lite";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export async function searchPosts(query: string) {
  const index = searchClient.initIndex("posts");
  const { hits } = await index.search(query);
  return hits;
}
```

### 2. 评论系统

**使用 Giscus**:

```typescript
"use client";

import Giscus from "@giscus/react";

export function Comments() {
  return (
    <Giscus
      repo="your-username/your-repo"
      repoId="your-repo-id"
      category="Announcements"
      categoryId="your-category-id"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}
```

### 3. 阅读统计

**使用 Umami**:

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script
          async
          defer
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          src={process.env.NEXT_PUBLIC_UMAMI_URL}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 注意事项

1. **API 认证**: 生产环境必须使用个人令牌（PAT）进行 API 认证
2. **错误处理**: 所有 API 调用必须包含错误处理和重试逻辑
3. **缓存策略**: 合理使用 Next.js 缓存机制，避免过度请求 Halo API
4. **类型安全**: 严格遵循 TypeScript 类型定义，避免运行时错误
5. **SEO 优化**: 确保所有页面都有完整的元数据和结构化数据
6. **性能监控**: 使用 Vercel Analytics 或其他工具监控性能
7. **安全性**: 对用户生成内容（评论、HTML 内容）进行清理，防止 XSS 攻击

## 参考资源

- **Halo API 文档**: https://api.halo.run
- **Next.js 文档**: https://nextjs.org/docs
- **Once UI 文档**: https://once-ui.com/docs
- **Magic Portfolio 源码**: reference/magic/
- **Halo 开发者指南**: reference/halo/halo-developer-guide/