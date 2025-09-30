# AI 编程指南 - Halo Blog Theme 最佳实践

## 概述

本文档为 Halo Blog Theme 项目制定了完整的编程规范和最佳实践指南，确保 AI 助手和开发者在编写代码时保持一致性，符合项目的设计理念和技术标准。

## 1. 项目哲学与设计原则

### 设计理念
- **简洁优雅**: 优先考虑简洁、直观的解决方案
- **配置驱动**: 通过配置文件管理站点设置，而非硬编码
- **类型安全**: 利用 TypeScript 确保代码的类型安全
- **性能优先**: 利用 Next.js 的 SSG/ISR 和优化特性
- **SEO 友好**: 确保所有页面都有完整的元数据和结构化数据
- **API 优先**: 通过 Halo API 管理内容，实现前后端分离

### Once UI 设计系统原则
- **一致性**: 使用 Once UI 组件确保视觉和交互一致性
- **响应式**: 所有组件都应支持响应式设计
- **可访问性**: 遵循 ARIA 标准和可访问性最佳实践
- **模块化**: 组件应该是独立的、可复用的

## 2. TypeScript 编码规范

### 类型定义规范

```typescript
// ✅ 正确：明确的接口定义
interface PostListProps {
  page?: number;
  size?: number;
  categoryName?: string;
  tagName?: string;
  showThumbnail?: boolean;
}

// ✅ 正确：使用联合类型限制取值
type RenderMode = "ssg" | "ssr" | "isr";

// ✅ 正确：扩展 Halo API 类型
interface ExtendedPostVo extends PostVo {
  readingTime?: number;
  relatedPosts?: PostVo[];
}

// ✅ 正确：API 响应类型定义
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}
```

### Halo API 类型约定

```typescript
// ✅ 正确：从 @halo-dev/api-client 导入类型
import type { PostVo, CategoryVo, TagVo } from "@halo-dev/api-client";

// ✅ 正确：定义扩展类型
interface PostWithContent extends PostVo {
  content: {
    raw: string;
    content: string;
  };
}

// ✅ 正确：分页响应类型
interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

### 导入导出规范

```typescript
// ✅ 正确：明确的导入语句
import { Heading, Text, Button } from "@once-ui-system/core";
import { getPosts, getPostByName } from "@/lib/halo/posts";
import { siteConfig } from "@/resources/config";
import type { PostVo } from "@/types/halo.types";

// ✅ 正确：统一的导出方式
export { PostCard };
export type { PostCardProps };

// ✅ 正确：默认导出页面组件
export default async function PostPage() {
  // ...
}
```

## 3. React 组件开发规范

### 组件结构模式

```typescript
"use client"; // 仅在需要客户端功能时使用

import React, { useEffect, useState } from "react";
import { Column, Text } from "@once-ui-system/core";
import type { PostVo } from "@/types/halo.types";

// 类型定义
interface PostCardProps {
  post: PostVo;
  showThumbnail?: boolean;
  layout?: "vertical" | "horizontal";
}

// 主组件
export const PostCard: React.FC<PostCardProps> = ({
  post,
  showThumbnail = true,
  layout = "vertical",
}) => {
  // Hooks（按顺序：状态、副作用、自定义 hooks）
  const [isHovered, setIsHovered] = useState(false);

  // 事件处理函数
  const handleClick = () => {
    // 事件处理逻辑
  };

  // 渲染逻辑
  return (
    <Column
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {showThumbnail && post.spec.cover && (
        <img src={post.spec.cover} alt={post.spec.title} />
      )}
      <Text variant="heading-strong-l">{post.spec.title}</Text>
      <Text variant="body-default-s">{post.status.excerpt}</Text>
    </Column>
  );
};
```

### 服务端组件与客户端组件

```typescript
// ✅ 正确：服务端组件（默认）
// src/app/blog/page.tsx
import { getPosts } from "@/lib/halo/posts";
import { PostList } from "@/components/post/PostList";

export default async function BlogPage() {
  // 在服务端获取数据
  const { items: posts } = await getPosts({ page: 1, size: 10 });

  return <PostList posts={posts} />;
}

// ✅ 正确：客户端组件（交互功能）
// src/components/SearchBox.tsx
"use client";

import { useState } from "react";
import { Input } from "@once-ui-system/core";

export function SearchBox() {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    // 客户端搜索逻辑
  };

  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 组件命名约定

- **组件文件**: PascalCase (如 `PostCard.tsx`)
- **组件名称**: PascalCase (如 `export const PostCard`)
- **Props 接口**: `ComponentNameProps` (如 `PostCardProps`)
- **样式文件**: `Component.module.scss`（如需要）

### 条件渲染模式

```typescript
// ✅ 正确：使用 && 进行条件渲染
{post.spec.cover && (
  <img src={post.spec.cover} alt={post.spec.title} />
)}

// ✅ 正确：复杂条件使用三元运算符
{isLoading ? (
  <Spinner />
) : (
  <PostList posts={posts} />
)}

// ✅ 正确：多条件渲染
{posts.length > 0 ? (
  <PostList posts={posts} />
) : (
  <EmptyState message="暂无文章" />
)}
```

## 4. Halo API 调用规范

### API 客户端使用

```typescript
// ✅ 正确：统一的 API 客户端
// src/lib/halo/client.ts
import axios from "axios";
import { createPublicApiClient } from "@halo-dev/api-client";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`,
  },
  timeout: 10000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export const haloClient = createPublicApiClient(axiosInstance);
```

### 数据获取模式

```typescript
// ✅ 正确：文章列表获取
// src/lib/halo/posts.ts
import { haloClient } from "./client";
import type { PostVo } from "@halo-dev/api-client";

export async function getPosts(params?: {
  page?: number;
  size?: number;
  categoryName?: string;
  tagName?: string;
  sort?: string[];
}) {
  try {
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
      page: response.data.page,
      size: response.data.size,
      totalPages: response.data.totalPages,
      hasNext: response.data.hasNext,
      hasPrevious: response.data.hasPrevious,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error("获取文章列表失败");
  }
}

// ✅ 正确：单篇文章获取
export async function getPostBySlug(slug: string): Promise<PostVo | null> {
  try {
    const { items } = await getPosts({ size: 1000 });
    return items.find((post) => post.spec.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch post with slug: ${slug}`, error);
    return null;
  }
}

// ✅ 正确：文章内容获取
export async function getPostContent(name: string): Promise<string> {
  try {
    const response = await haloClient.post.getPostContent({ name });
    return response.data.content;
  } catch (error) {
    console.error(`Failed to fetch content for post: ${name}`, error);
    throw new Error("获取文章内容失败");
  }
}
```

### 错误处理规范

```typescript
// ✅ 正确：完善的错误处理
export async function getPosts(params?: PostQueryParams) {
  try {
    const response = await haloClient.post.listPosts(params);
    return response.data;
  } catch (error) {
    // 1. 日志记录
    console.error("API Error:", error);

    // 2. 区分错误类型
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("文章不存在");
      } else if (error.response?.status === 401) {
        throw new Error("API 认证失败");
      } else if (error.code === "ECONNABORTED") {
        throw new Error("请求超时");
      }
    }

    // 3. 通用错误
    throw new Error("获取数据失败，请稍后重试");
  }
}
```

### 缓存策略

```typescript
// ✅ 正确：使用 Next.js Fetch Cache
export async function getPosts(params?: PostQueryParams) {
  const response = await fetch(`${API_URL}/posts`, {
    next: {
      revalidate: 60, // ISR: 60 秒重新验证
      tags: ["posts"], // 缓存标签
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

// ✅ 正确：静态数据缓存
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    cache: "force-cache", // 永久缓存（构建时）
  });

  return response.json();
}

// ✅ 正确：按需重新验证
import { revalidateTag } from "next/cache";

export async function revalidatePosts() {
  revalidateTag("posts");
}
```

### 独立页面数据获取规范

```typescript
// ✅ 正确：独立页面 API 调用
// src/lib/halo/pages.ts
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

### API 客户端配置（支持认证）

```typescript
// ✅ 正确：使用 createCoreApiClient 支持完整 API
// src/lib/halo/client.ts
import axios from "axios";
import { createCoreApiClient } from "@halo-dev/api-client";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL,
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

## 5. 混合路由开发规范

### 固定路由 vs 动态路由使用场景

**固定路由使用场景**：
- ✅ 核心页面（About、Contact、Services）
- ✅ 页面内容很少变化
- ✅ 需要特殊的页面结构或布局
- ✅ 需要额外的类型安全保证

**动态路由使用场景**：
- ✅ 频繁新增的页面
- ✅ 标准化的页面结构
- ✅ 完全由 Halo 后台管理的内容

### 固定路由实现规范

```typescript
// ✅ 正确：固定路由实现
// src/app/about/page.tsx
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

### 动态路由实现规范

```typescript
// ✅ 正确：动态路由实现（排除固定路由）
// src/app/pages/[...slug]/page.tsx
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

### 如何添加新的固定路由

```typescript
// 1. 更新固定路由配置
// src/resources/config.ts
export const FIXED_ROUTES = {
  about: '/about',
  contact: '/contact',
  services: '/services', // 新增
} as const;

// 2. 创建固定路由文件
// src/app/services/page.tsx
import { getPageBySlug } from "@/lib/halo/pages";
import { PageContent } from "@/components/page/PageContent";
import { notFound } from "next/navigation";

export default async function ServicesPage() {
  const page = await getPageBySlug("services");
  if (!page) notFound();
  return <PageContent page={page} />;
}

export const revalidate = 3600;
```

### 路由命名规范

```typescript
// ✅ 正确：路由文件命名
src/app/about/page.tsx          // 固定路由：关于页面
src/app/contact/page.tsx        // 固定路由：联系页面
src/app/pages/[...slug]/page.tsx  // 动态路由：其他页面

// ✅ 正确：Slug 命名规范（在 Halo 后台）
about                           // 简单 slug
docs/getting-started            // 嵌套 slug（支持）
blog-archive                    // 使用连字符

// ❌ 错误：避免的 slug 命名
About                           // 避免大写
about_page                      // 避免下划线
about page                      // 避免空格
```

### 页面可见性处理

```typescript
// ✅ 正确：处理页面可见性
export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(slug);

  // 1. 页面不存在
  if (!page) {
    notFound();
  }

  // 2. 未发布
  if (!page.spec.publish) {
    notFound();
  }

  // 3. 非公开页面
  if (page.spec.visible !== 'PUBLIC') {
    // 可选：重定向到登录页或返回 403
    notFound();
  }

  return <PageContent page={page} />;
}
```

## 6. Once UI 组件使用规范

### 布局组件使用

```typescript
// ✅ 正确：使用 Once UI 布局组件
import { Column, Row, Grid, Flex } from "@once-ui-system/core";

export function PostList({ posts }: { posts: PostVo[] }) {
  return (
    <Column fillWidth gap="xl" paddingY="12">
      <Grid columns="3" s={{ columns: 1 }} m={{ columns: 2 }} gap="16">
        {posts.map((post) => (
          <PostCard key={post.metadata.name} post={post} />
        ))}
      </Grid>
    </Column>
  );
}

// ✅ 正确：响应式布局
<Row
  fillWidth
  gap="16"
  vertical="center"
  s={{ direction: "column" }}
  m={{ direction: "row" }}
>
  <Flex flex={1}>
    <Heading as="h1">标题</Heading>
  </Flex>
  <Flex flex={0}>
    <Button>操作</Button>
  </Flex>
</Row>
```

### 文本组件规范

```typescript
// ✅ 正确：标题组件
<Heading as="h1" variant="display-strong-l">
  {post.spec.title}
</Heading>

// ✅ 正确：正文文本
<Text variant="body-default-m" onBackground="neutral-weak">
  {post.status.excerpt}
</Text>

// ✅ 正确：小标签文本
<Text variant="label-default-s" onBackground="brand-weak">
  {category.spec.displayName}
</Text>
```

### 按钮组件规范

```typescript
// ✅ 正确：主要按钮
<Button
  variant="primary"
  size="m"
  href={`/${post.spec.slug}`}
  arrowIcon
>
  阅读更多
</Button>

// ✅ 正确：图标按钮
<IconButton
  icon="share"
  tooltip="分享"
  size="s"
  variant="ghost"
  onClick={handleShare}
/>
```

### 动画效果使用

```typescript
// ✅ 正确：RevealFx 动画效果
import { RevealFx } from "@once-ui-system/core";

<RevealFx translateY="4" delay={0.1} fillWidth>
  <PostCard post={post} />
</RevealFx>
```

## 7. 内容渲染规范

### HTML 内容安全渲染

```typescript
// ✅ 正确：清理 HTML 内容
import DOMPurify from "isomorphic-dompurify";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  // 1. 清理 HTML（防止 XSS）
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "a", "img", "code", "pre",
      "blockquote", "strong", "em", "del", "table",
      "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "id", "title"],
  });

  // 2. 渲染 HTML
  return (
    <div
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
```

### HTML 后处理

```typescript
// ✅ 正确：对渲染的 HTML 进行后处理
"use client";

import { useEffect, useRef } from "react";
import { slugify } from "@/utils/slugify";

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 1. 为标题添加锚点链接
    const headings = contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      const id = heading.id || slugify(heading.textContent || "");
      heading.id = id;

      const anchor = document.createElement("a");
      anchor.href = `#${id}`;
      anchor.className = "heading-anchor";
      anchor.textContent = "#";
      anchor.ariaLabel = `链接到 ${heading.textContent}`;
      heading.appendChild(anchor);
    });

    // 2. 外部链接添加 target="_blank"
    const links = contentRef.current.querySelectorAll("a");
    links.forEach((link) => {
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });

    // 3. 图片懒加载
    const images = contentRef.current.querySelectorAll("img");
    images.forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
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

## 8. SEO 优化规范

### 元数据生成

```typescript
// ✅ 正确：文章元数据生成
import { Metadata } from "next";
import { siteConfig } from "@/resources/config";
import type { PostVo } from "@/types/halo.types";

export function generatePostMetadata(post: PostVo): Metadata {
  const url = `${siteConfig.url}/${post.spec.slug}`;
  const ogImage = post.spec.cover || `${siteConfig.url}/api/og/generate?title=${encodeURIComponent(post.spec.title)}`;

  return {
    title: `${post.spec.title} - ${siteConfig.name}`,
    description: post.status.excerpt,
    authors: [{ name: post.owner?.displayName || siteConfig.author.name }],
    keywords: post.tags?.map((tag) => tag.spec.displayName),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.spec.title,
      description: post.status.excerpt,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.spec.title }],
      publishedTime: post.spec.publishTime,
      modifiedTime: post.status.lastModifyTime,
      authors: [post.owner?.displayName || siteConfig.author.name],
      tags: post.tags?.map((tag) => tag.spec.displayName),
    },
    twitter: {
      card: "summary_large_image",
      title: post.spec.title,
      description: post.status.excerpt,
      images: [ogImage],
      creator: "@your_twitter_handle",
    },
  };
}
```

### 结构化数据

```typescript
// ✅ 正确：添加 JSON-LD 结构化数据
import { generateArticleSchema } from "@/lib/seo/schema";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const schema = generateArticleSchema(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PostContent post={post} />
    </>
  );
}
```

## 9. 样式和 SCSS 规范

### Tailwind CSS 使用

```typescript
// ✅ 正确：使用 Tailwind 工具类
<div className="max-w-4xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
    {title}
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    {description}
  </p>
</div>

// ✅ 正确：响应式设计
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {posts.map((post) => (
    <PostCard key={post.metadata.name} post={post} />
  ))}
</div>
```

### SCSS 模块化

```scss
// PostCard.module.scss
.card {
  position: relative;
  border-radius: var(--radius-m);
  background: var(--neutral-surface-weak);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  &__content {
    padding: var(--space-m);
  }
}

// 响应式断点
@media (max-width: 768px) {
  .card {
    border-radius: var(--radius-s);
  }
}
```

## 10. 性能优化规范

### 图片优化

```typescript
// ✅ 正确：使用 Next.js Image 组件
import Image from "next/image";

export function PostCover({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority // 首屏图片使用 priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      placeholder="blur"
      blurDataURL="data:image/..." // 使用模糊占位符
    />
  );
}
```

### 代码分割

```typescript
// ✅ 正确：动态导入大组件
import dynamic from "next/dynamic";

const Comments = dynamic(() => import("@/components/Comments"), {
  loading: () => <Spinner />,
  ssr: false, // 仅在客户端加载
});

export function PostPage() {
  return (
    <>
      <PostContent />
      <Comments />
    </>
  );
}
```

### 数据预取

```typescript
// ✅ 正确：预取相关数据
export async function getRelatedPosts(post: PostVo) {
  if (!post.categories || post.categories.length === 0) {
    return [];
  }

  const { items } = await getPosts({
    categoryName: post.categories[0].metadata.name,
    size: 5,
  });

  return items.filter((p) => p.metadata.name !== post.metadata.name);
}
```

## 11. 错误处理和用户体验

### 加载状态

```typescript
// ✅ 正确：加载状态处理
"use client";

import { useState, useEffect } from "react";
import { Spinner, Flex } from "@once-ui-system/core";

export function PostList() {
  const [posts, setPosts] = useState<PostVo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  return <PostGrid posts={posts} />;
}
```

### 错误状态

```typescript
// ✅ 正确：错误状态处理
const [error, setError] = useState<string | null>(null);

if (error) {
  return (
    <Column paddingY="128" gap="24" center>
      <Heading>出错了</Heading>
      <Text onBackground="neutral-weak">{error}</Text>
      <Button onClick={() => window.location.reload()}>刷新页面</Button>
    </Column>
  );
}
```

### 空状态

```typescript
// ✅ 正确：空状态处理
if (posts.length === 0) {
  return (
    <Column paddingY="128" gap="16" center>
      <Text variant="heading-strong-l">暂无文章</Text>
      <Text variant="body-default-m" onBackground="neutral-weak">
        目前还没有发布任何文章
      </Text>
    </Column>
  );
}
```

## 12. 可访问性规范

### ARIA 和语义化

```typescript
// ✅ 正确：语义化 HTML
<Column as="main" role="main">
  <Heading as="h1" id="page-title">
    博客文章
  </Heading>
  <Text as="p">文章列表</Text>
</Column>

// ✅ 正确：ARIA 标签
<Button
  aria-label="分享到 Twitter"
  onClick={handleShare}
>
  <Icon name="twitter" />
</Button>

// ✅ 正确：焦点管理
<a
  href={`/${post.spec.slug}`}
  aria-describedby={`post-excerpt-${post.metadata.name}`}
>
  {post.spec.title}
</a>
<p id={`post-excerpt-${post.metadata.name}`}>
  {post.status.excerpt}
</p>
```

## 13. 测试规范

### 单元测试

```typescript
// ✅ 正确：API 函数测试
import { describe, it, expect, vi } from "vitest";
import { getPosts } from "@/lib/halo/posts";

describe("getPosts", () => {
  it("should fetch posts successfully", async () => {
    const { items } = await getPosts({ page: 1, size: 10 });
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it("should handle errors gracefully", async () => {
    vi.mock("@/lib/halo/client", () => ({
      haloClient: {
        post: {
          listPosts: vi.fn().mockRejectedValue(new Error("Network error")),
        },
      },
    }));

    await expect(getPosts()).rejects.toThrow("获取文章列表失败");
  });
});
```

### 组件测试

```typescript
// ✅ 正确：组件测试
import { render, screen } from "@testing-library/react";
import { PostCard } from "@/components/post/PostCard";

describe("PostCard", () => {
  const mockPost: PostVo = {
    metadata: { name: "test-post" },
    spec: {
      title: "测试文章",
      slug: "test-post",
      cover: "/test-cover.jpg",
    },
    status: {
      excerpt: "这是一篇测试文章",
    },
  };

  it("renders post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("测试文章")).toBeInTheDocument();
  });

  it("shows thumbnail when showThumbnail is true", () => {
    render(<PostCard post={mockPost} showThumbnail={true} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test-cover.jpg");
  });
});
```

## 14. 环境配置规范

### 环境变量

```typescript
// ✅ 正确：环境变量验证
// src/lib/env.ts
const requiredEnvVars = [
  "NEXT_PUBLIC_HALO_API_URL",
  "HALO_API_TOKEN",
] as const;

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const env = {
  haloApiUrl: process.env.NEXT_PUBLIC_HALO_API_URL!,
  haloApiToken: process.env.HALO_API_TOKEN!,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;
```

## 15. 代码审查检查清单

### 提交前检查项

- [ ] 所有组件都有适当的 TypeScript 类型
- [ ] API 调用包含错误处理
- [ ] 使用了 Once UI 组件而非原生 HTML 元素
- [ ] 响应式设计已实现
- [ ] 可访问性标签已添加
- [ ] 性能优化已考虑（图片、懒加载）
- [ ] SEO 元数据已添加
- [ ] 代码已通过 Biome 格式化
- [ ] 符合命名约定
- [ ] 适当的注释和文档

### 性能检查项

- [ ] 服务端组件优先，客户端组件按需使用
- [ ] 使用 Next.js Image 组件优化图片
- [ ] API 请求使用了适当的缓存策略
- [ ] 大组件使用动态导入
- [ ] 避免不必要的重新渲染

### 安全检查项

- [ ] HTML 内容使用 DOMPurify 清理
- [ ] 外部链接添加 `rel="noopener noreferrer"`
- [ ] API Token 存储在环境变量中
- [ ] 敏感信息不暴露给客户端

## 16. Git 提交规范

### Commit Message 格式

```bash
# ✅ 正确：遵循 Conventional Commits
feat: 添加文章搜索功能
fix: 修复文章列表分页错误
docs: 更新 API 文档
style: 格式化代码
refactor: 重构文章获取逻辑
test: 添加文章组件测试
chore: 更新依赖

# ✅ 正确：包含详细描述
feat: 添加文章搜索功能

- 实现全文搜索 API
- 添加搜索框组件
- 支持按标题和内容搜索
```

## 结语

遵循本指南将确保 Halo Blog Theme 项目的代码质量、一致性和可维护性。所有开发者和 AI 助手都应严格按照这些规范进行开发，以创造出色的用户体验和可靠的技术解决方案。

**核心原则：类型安全、配置驱动、性能优先、SEO 友好、用户体验至上。**