# 部署指南 - Halo Blog Theme

本文档提供了 Halo Blog Theme 的各种部署方式。

## 前置要求

- Node.js 20+
- Halo CMS 实例（2.0+）
- Halo Personal Access Token

## 1. Docker 部署（推荐）

### 1.1 使用 Docker Compose

**步骤 1**: 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填写你的 Halo 配置：

```env
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=pat_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-blog.com
NEXT_PUBLIC_SITE_NAME=My Blog
```

**步骤 2**: 构建并启动

```bash
docker-compose up -d
```

**步骤 3**: 访问应用

打开浏览器访问 `http://localhost:3000`

### 1.2 使用 Docker 单独构建

**构建镜像**：

```bash
docker build -t halo-blog-theme .
```

**运行容器**：

```bash
docker run -d \
  --name halo-blog \
  -p 3000:3000 \
  -e NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com \
  -e HALO_API_TOKEN=pat_xxxxxxxxxxxxx \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_SITE_NAME="Halo Blog" \
  halo-blog-theme
```

### 1.3 使用环境变量文件

```bash
docker run -d \
  --name halo-blog \
  -p 3000:3000 \
  --env-file .env.local \
  halo-blog-theme
```

## 2. Vercel 部署

Vercel 是 Next.js 应用的最佳部署平台。

### 2.1 通过 GitHub 部署

**步骤 1**: 推送代码到 GitHub

```bash
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

**步骤 2**: 导入到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 配置环境变量（见下方）
5. 点击 "Deploy"

**步骤 3**: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```
NEXT_PUBLIC_HALO_API_URL=https://your-halo-instance.com
HALO_API_TOKEN=pat_xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-blog.vercel.app
NEXT_PUBLIC_SITE_NAME=My Blog
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_COMMENTS=true
```

### 2.2 通过 Vercel CLI 部署

```bash
npm install -g vercel
vercel login
vercel
```

## 3. 传统服务器部署

### 3.1 使用 PM2

**步骤 1**: 安装依赖

```bash
npm install
```

**步骤 2**: 构建项目

```bash
npm run build
```

**步骤 3**: 安装 PM2

```bash
npm install -g pm2
```

**步骤 4**: 创建 PM2 配置文件 `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'halo-blog-theme',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
```

**步骤 5**: 启动应用

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3.2 使用 Nginx 反向代理

创建 Nginx 配置文件 `/etc/nginx/sites-available/blog`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3.3 配置 SSL（使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 4. Kubernetes 部署

### 4.1 创建 Deployment

创建 `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: halo-blog-theme
  labels:
    app: halo-blog
spec:
  replicas: 3
  selector:
    matchLabels:
      app: halo-blog
  template:
    metadata:
      labels:
        app: halo-blog
    spec:
      containers:
      - name: blog
        image: your-registry/halo-blog-theme:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_HALO_API_URL
          valueFrom:
            configMapKeyRef:
              name: blog-config
              key: halo-api-url
        - name: HALO_API_TOKEN
          valueFrom:
            secretKeyRef:
              name: blog-secrets
              key: halo-api-token
        - name: NEXT_PUBLIC_SITE_URL
          valueFrom:
            configMapKeyRef:
              name: blog-config
              key: site-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: halo-blog-service
spec:
  selector:
    app: halo-blog
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### 4.2 创建 ConfigMap

```bash
kubectl create configmap blog-config \
  --from-literal=halo-api-url=https://your-halo-instance.com \
  --from-literal=site-url=https://your-blog.com
```

### 4.3 创建 Secret

```bash
kubectl create secret generic blog-secrets \
  --from-literal=halo-api-token=pat_xxxxxxxxxxxxx
```

### 4.4 应用配置

```bash
kubectl apply -f k8s-deployment.yaml
```

## 5. 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_HALO_API_URL` | Halo API 地址 | `https://halo.example.com` |
| `HALO_API_TOKEN` | Halo Personal Access Token | `pat_xxxxxxxxxxxxx` |
| `NEXT_PUBLIC_SITE_URL` | 博客公开访问地址 | `https://blog.example.com` |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_SITE_NAME` | 站点名称 | `Halo Blog` |
| `NEXT_PUBLIC_ENABLE_SEARCH` | 启用搜索功能 | `true` |
| `NEXT_PUBLIC_ENABLE_COMMENTS` | 启用评论功能 | `false` |

## 6. 性能优化建议

### 6.1 启用 CDN

将静态资源托管到 CDN：

1. **Vercel**: 自动启用 Edge Network
2. **Cloudflare**: 添加站点到 Cloudflare 并配置 DNS
3. **其他 CDN**: 配置源站为你的服务器地址

### 6.2 配置缓存

在 `next.config.mjs` 中配置：

```javascript
const nextConfig = {
  // ...其他配置
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

### 6.3 图片优化

确保在 Halo 后台上传的图片格式为 WebP，并配置合适的尺寸。

## 7. 监控和日志

### 7.1 查看 Docker 日志

```bash
docker logs -f halo-blog
```

### 7.2 查看 PM2 日志

```bash
pm2 logs halo-blog-theme
```

### 7.3 性能监控

推荐使用：
- **Vercel Analytics**: Vercel 部署自带
- **Google Analytics**: 添加到 `layout.tsx`
- **Umami**: 开源自托管分析工具

## 8. 故障排查

### 8.1 构建失败

检查 Node.js 版本：
```bash
node --version  # 应该是 20+
```

### 8.2 API 连接失败

检查环境变量：
```bash
echo $NEXT_PUBLIC_HALO_API_URL
echo $HALO_API_TOKEN
```

测试 Halo API：
```bash
curl -H "Authorization: Bearer $HALO_API_TOKEN" \
  $NEXT_PUBLIC_HALO_API_URL/apis/api.console.halo.run/v1alpha1/posts
```

### 8.3 页面加载慢

1. 检查 Halo API 响应时间
2. 启用 ISR 缓存（已在项目中配置）
3. 配置 CDN 加速静态资源

## 9. 更新部署

### 9.1 Docker 更新

```bash
docker-compose down
git pull
docker-compose up -d --build
```

### 9.2 Vercel 更新

推送代码到 GitHub，Vercel 自动部署：

```bash
git add .
git commit -m "Update content"
git push
```

### 9.3 PM2 更新

```bash
git pull
npm install
npm run build
pm2 restart halo-blog-theme
```

## 10. 安全建议

1. **使用 HTTPS**: 生产环境必须启用 SSL/TLS
2. **保护 API Token**: 不要将 Token 提交到代码仓库
3. **定期更新依赖**: `npm audit` 检查安全漏洞
4. **限制 API 访问**: 在 Halo 后台配置 Token 权限
5. **启用 WAF**: 使用 Cloudflare 或其他 WAF 防护

## 11. 备份策略

1. **代码备份**: 使用 Git 版本控制
2. **内容备份**: 定期备份 Halo 数据库
3. **配置备份**: 备份环境变量和配置文件

---

**需要帮助？**

- [项目文档](./README.md)
- [技术架构](./ai-context.md)
- [开发规范](./ai-guideline.md)