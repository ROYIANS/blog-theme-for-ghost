# Halo 用户信息 API 使用指南

## 概述

Halo 博客系统提供了用户信息获取的 API，可以用来获取站长信息、作者信息等。

## API 接口

### 1. 获取指定用户信息

```typescript
import { getUserByName } from "@/lib/halo/users";

const user = await getUserByName("admin");
// 返回:
// {
//   name: "admin",
//   displayName: "管理员",
//   avatar: "https://example.com/avatar.jpg",
//   bio: "站长的个人简介",
//   email: "admin@example.com"
// }
```

### 2. 获取当前认证用户信息

```typescript
import { getCurrentUser } from "@/lib/halo/users";

const user = await getCurrentUser();
// 返回当前通过 API Token 认证的用户信息
```

### 3. 获取站长信息

```typescript
import { getSiteOwner } from "@/lib/halo/users";

const owner = await getSiteOwner();
// 默认获取 "admin" 用户
// 可通过环境变量 HALO_SITE_OWNER 配置
```

## 配置

在 `.env.local` 中添加：

```bash
# 站长用户名（可选，默认为 admin）
HALO_SITE_OWNER=your-admin-username
```

## 使用场景

### 1. 在页面中显示站长信息

```typescript
// src/app/about/page.tsx
import { getSiteOwner } from "@/lib/halo/users";

export default async function AboutPage() {
  const owner = await getSiteOwner();

  return (
    <div>
      <img src={owner?.avatar} alt={owner?.displayName} />
      <h1>{owner?.displayName}</h1>
      <p>{owner?.bio}</p>
    </div>
  );
}
```

### 2. 从文章中获取作者信息

文章和页面对象已经包含作者信息，无需额外 API 调用：

```typescript
// 文章中的 owner 字段已包含作者信息
post.owner.displayName  // 作者显示名称
post.owner.avatar       // 作者头像
post.owner.bio          // 作者简介
post.owner.name         // 作者用户名
```

### 3. 在布局中显示站长头像

```typescript
// src/components/Header.tsx
import { getSiteOwner } from "@/lib/halo/users";

export async function Header() {
  const owner = await getSiteOwner();

  return (
    <header>
      <nav>...</nav>
      <div>
        <img src={owner?.avatar} alt="站长" />
        <span>{owner?.displayName}</span>
      </div>
    </header>
  );
}
```

## 数据结构

### UserInfo

```typescript
interface UserInfo {
  name: string;          // 用户名（用于 URL）
  displayName: string;   // 显示名称
  avatar?: string;       // 头像 URL（可选）
  bio?: string;         // 个人简介（可选）
  email: string;        // 邮箱
}
```

### ContributorVo（文章中的作者信息）

```typescript
interface ContributorVo {
  avatar: string;        // 头像 URL
  bio: string;          // 个人简介
  displayName: string;  // 显示名称
  name: string;         // 用户名
  metadata: Metadata;   // 元数据
}
```

## 注意事项

1. **认证要求**：用户信息 API 需要通过 Core API（需要 PAT Token）访问
2. **服务端调用**：这些 API 只能在服务端组件中调用
3. **错误处理**：所有函数在失败时返回 `null`，请做好空值检查
4. **缓存策略**：建议配合 Next.js 的缓存机制使用，避免频繁请求

## 示例：完整的关于页面

```typescript
// src/app/about/page.tsx
import { getSiteOwner } from "@/lib/halo/users";
import { getPageBySlug, getPageContent } from "@/lib/halo/pages";

export const revalidate = 3600; // 1 小时 ISR

export default async function AboutPage() {
  const [owner, page] = await Promise.all([
    getSiteOwner(),
    getPageBySlug("about"),
  ]);

  const content = page ? await getPageContent(page.metadata.name) : "";

  if (!owner) {
    return <div>无法获取站长信息</div>;
  }

  return (
    <article>
      <header>
        <img src={owner.avatar} alt={owner.displayName} />
        <h1>关于 {owner.displayName}</h1>
        <p>{owner.bio}</p>
      </header>

      {page && (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </article>
  );
}
```
