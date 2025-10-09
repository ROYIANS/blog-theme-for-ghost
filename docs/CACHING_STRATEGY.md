# 数据同步与缓存策略

本项目使用 Next.js 的 ISR (Incremental Static Regeneration) + On-Demand Revalidation 实现数据同步。

## 缓存策略

### 1. ISR（增量静态再生成）

所有页面都配置了自动重新验证：

| 页面类型 | 重新验证周期 | 说明 |
|---------|------------|------|
| 首页 (`/`) | 30 秒 | 显示最新博客文章 |
| 博客列表 (`/blog`) | 30 秒 | 博客文章列表 |
| 博客详情 (`/blog/[slug]`) | 60 秒 | 单篇文章内容 |
| 动态页面 (`/page/[slug]`) | 60 秒 | 自定义页面内容 |

**工作原理：**
- 第一次访问时生成静态页面并缓存
- 在指定时间（如 60 秒）后，下一次访问会触发后台重新生成
- 用户仍然看到缓存页面（不会等待）
- 后台生成完成后，后续访问看到新内容

### 2. On-Demand Revalidation（按需重新验证）

通过 API 接口立即刷新指定页面的缓存，无需等待 ISR 周期。

## 按需重新验证 API

### 端点

```
POST /api/revalidate
```

### 认证

使用 Header 传递密钥：

```
x-revalidate-token: YOUR_SECRET_TOKEN
```

密钥在 `.env.local` 中配置：

```bash
REVALIDATE_SECRET_TOKEN=your_random_secret_token_here
```

### 请求格式

#### 1. 重新验证特定文章

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_SECRET_TOKEN" \
  -d '{
    "type": "post",
    "slug": "my-article-slug"
  }'
```

#### 2. 重新验证所有博客页面

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_SECRET_TOKEN" \
  -d '{
    "type": "post"
  }'
```

#### 3. 重新验证特定页面

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_SECRET_TOKEN" \
  -d '{
    "type": "page",
    "slug": "about"
  }'
```

#### 4. 重新验证所有页面（包括菜单）

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_SECRET_TOKEN" \
  -d '{
    "type": "page"
  }'
```

#### 5. 重新验证所有内容

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_SECRET_TOKEN" \
  -d '{
    "type": "all"
  }'
```

### 响应示例

成功：
```json
{
  "success": true,
  "revalidated": ["/blog/my-article"],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

错误：
```json
{
  "error": "Invalid token"
}
```

## Halo Webhook 配置

### 1. 生成密钥

```bash
# 使用 OpenSSL 生成随机密钥
openssl rand -base64 32
```

将生成的密钥添加到 `.env.local`：

```bash
REVALIDATE_SECRET_TOKEN=生成的密钥
```

### 2. 在 Halo 后台配置 Webhook

**Halo 2.0+ 支持 Webhook 功能**

1. 进入 Halo 管理后台
2. 导航到：**设置 → Webhooks**
3. 点击 **添加 Webhook**

#### 配置示例 1：文章发布/更新

- **名称：** 重新验证博客文章
- **URL：** `https://your-site.com/api/revalidate`
- **方法：** POST
- **Headers：**
  ```
  Content-Type: application/json
  x-revalidate-token: YOUR_SECRET_TOKEN
  ```
- **Body 模板：**
  ```json
  {
    "type": "post",
    "slug": "{{ post.spec.slug }}"
  }
  ```
- **触发事件：**
  - ✅ 文章发布
  - ✅ 文章更新

#### 配置示例 2：页面更新

- **名称：** 重新验证自定义页面
- **URL：** `https://your-site.com/api/revalidate`
- **方法：** POST
- **Headers：**
  ```
  Content-Type: application/json
  x-revalidate-token: YOUR_SECRET_TOKEN
  ```
- **Body 模板：**
  ```json
  {
    "type": "page",
    "slug": "{{ page.spec.slug }}"
  }
  ```
- **触发事件：**
  - ✅ 页面发布
  - ✅ 页面更新

### 3. 测试 Webhook

在 Halo 后台的 Webhook 配置页面，点击 **测试** 按钮，确保返回成功。

## 数据更新流程

### 自动更新（ISR）

```
Halo 更新内容
    ↓
等待 30-60 秒
    ↓
用户访问页面
    ↓
Next.js 后台重新生成
    ↓
下次访问看到新内容
```

### 即时更新（Webhook）

```
Halo 更新内容
    ↓
触发 Webhook
    ↓
调用 /api/revalidate
    ↓
Next.js 立即清除缓存
    ↓
下次访问生成新页面
```

## 最佳实践

### 1. 结合使用 ISR 和 Webhook

- **ISR：** 作为兜底机制，确保即使 Webhook 失败，内容也会在 30-60 秒后更新
- **Webhook：** 提供即时更新，用户发布后立即看到新内容

### 2. 调整 ISR 周期

根据内容更新频率调整：

```typescript
// 高频更新内容（如新闻）
export const revalidate = 30; // 30 秒

// 中频更新内容（如博客）
export const revalidate = 60; // 1 分钟

// 低频更新内容（如关于页面）
export const revalidate = 3600; // 1 小时
```

### 3. 监控 Webhook

在 Halo 后台查看 Webhook 执行日志，确保正常工作。

### 4. 错误处理

如果 Webhook 失败：
- ISR 会在指定时间后自动更新
- 可以手动调用 `/api/revalidate` API

## 常见问题

### Q: 为什么更新后还是看到旧内容？

**A:** 可能的原因：
1. 浏览器缓存 - 清除浏览器缓存或使用隐私模式
2. CDN 缓存 - 如果使用了 CDN，需要清除 CDN 缓存
3. Webhook 未配置 - 检查 Halo Webhook 配置
4. ISR 周期未到 - 等待或手动调用 revalidate API

### Q: 如何立即看到更新？

**A:** 两种方法：
1. 配置 Halo Webhook（推荐）
2. 手动调用 revalidate API

### Q: Webhook 失败怎么办？

**A:**
1. 检查网络连接和防火墙
2. 验证 `REVALIDATE_SECRET_TOKEN` 配置正确
3. 查看 Next.js 日志
4. 使用 Postman 等工具测试 API

### Q: 可以缩短 ISR 周期到 1 秒吗？

**A:** 不推荐，原因：
- 增加服务器负载
- Halo API 请求频繁
- 可能触发 API 限流
- 建议最短 30 秒

## 生产环境部署注意事项

### Vercel 部署

Vercel 完全支持 ISR 和 On-Demand Revalidation，无需额外配置。

### 自托管部署

确保 Next.js 运行在 `next start` 模式（不是 `next export`），否则 ISR 不会工作。

### Docker 部署

使用 standalone 模式：

```dockerfile
# next.config.mjs
output: 'standalone'
```

## 监控和调试

### 查看重新验证日志

在 Next.js 开发模式下，会输出重新验证信息：

```bash
pnpm dev
```

### 测试 API

```bash
# 健康检查
curl https://your-site.com/api/revalidate

# 测试重新验证
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: YOUR_TOKEN" \
  -d '{"type": "all"}'
```
