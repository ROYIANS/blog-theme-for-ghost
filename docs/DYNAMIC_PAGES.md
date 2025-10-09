# 动态页面和菜单系统

本项目支持从 Halo CMS 动态拉取页面并渲染到菜单栏。

## 页面 Metadata 配置

在 Halo 后台创建页面时，可以在页面的 `metadata.annotations` 中配置以下字段：

### 菜单相关配置

#### `menu.icon` (必需，用于显示在菜单中)
页面图标，支持 Once UI 的图标名称。

**示例值：**
- `person` - 关于页面
- `grid` - 作品集
- `gallery` - 相册
- `document` - 文档
- `email` - 联系方式

**配置方法：**
在 Halo 后台页面编辑界面，在 metadata annotations 中添加：
```
menu.icon: person
```

#### `menu.order` (可选)
菜单显示顺序，数字越小越靠前。

**默认值：** 999

**示例值：**
- `10` - 显示在前面
- `50` - 显示在中间
- `100` - 显示在后面

**配置方法：**
```
menu.order: 20
```

### 页面类型配置

#### `page.type` (可选)
页面渲染类型，决定使用哪个组件来渲染页面内容。

**支持的值：**
- `article` (默认) - 文章类型，类似博客文章布局
- `gallery` - 相册类型，以网格形式展示图片
- `custom` - 自定义类型（需要扩展）

**默认值：** `article`

**配置方法：**
```
page.type: gallery
```

#### `page.template` (可选)
自定义模板名称，用于扩展新的页面类型。

**配置方法：**
```
page.template: my-custom-template
```

## 完整配置示例

### 示例 1: 关于页面
在 Halo 后台创建页面，设置以下 annotations：

```yaml
menu.icon: person
menu.order: 10
page.type: article
```

这将创建一个带有"人像"图标的关于页面，显示在菜单第 10 位，使用文章布局。

### 示例 2: 相册页面
```yaml
menu.icon: gallery
menu.order: 30
page.type: gallery
```

这将创建一个带有"相册"图标的页面，显示在菜单第 30 位，使用相册布局（图片网格）。

### 示例 3: 作品集页面
```yaml
menu.icon: grid
menu.order: 20
page.type: article
```

## 页面类型说明

### Article 类型
- 默认页面类型
- 显示标题、作者、发布时间
- 支持封面图片
- 内容使用富文本渲染
- 适用于：关于页面、文档页面、一般内容页面

### Gallery 类型
- 从内容中提取所有图片
- 以 3 列网格显示（响应式）
- 图片带边框和圆角
- 适用于：相册、作品集展示

## 菜单显示规则

页面需要满足以下条件才会显示在菜单中：

1. ✅ `spec.publish` = `true` (已发布)
2. ✅ `spec.visible` = `PUBLIC` (公开可见)
3. ✅ 存在 `menu.icon` annotation

**注意：** 没有设置 `menu.icon` 的页面不会显示在菜单中，但仍可通过 `/page/[slug]` 路径访问。

## 路由规则

- **静态菜单项：** `/` (首页), `/blog` (博客)
- **动态页面：** `/page/[slug]`
- **示例：**
  - Halo 中 slug 为 `about` 的页面 → 访问 `/page/about`
  - Halo 中 slug 为 `portfolio` 的页面 → 访问 `/page/portfolio`

## 扩展新的页面类型

如果需要添加新的页面类型，可以按照以下步骤：

1. 在 `src/components/page/` 下创建新的组件，例如 `CustomPage.tsx`
2. 在 `src/components/page/PageRenderer.tsx` 中添加新的 case
3. 在 Halo 页面的 `page.type` 中使用新类型名称

**示例：**

```typescript
// src/components/page/CustomPage.tsx
export function CustomPage({ page, content }: PageProps) {
  // 你的自定义渲染逻辑
}

// src/components/page/PageRenderer.tsx
switch (metadata.pageType) {
  case "gallery":
    return <GalleryPage page={page} content={content} />;
  case "custom":
    return <CustomPage page={page} content={content} />;
  case "article":
  default:
    return <ArticlePage page={page} content={content} />;
}
```

## 图标列表

常用的 Once UI 图标：

- `home` - 首页
- `person` - 关于/个人
- `grid` - 网格/作品
- `gallery` - 相册
- `document` - 文档
- `book` - 书籍/博客
- `email` - 邮件/联系
- `settings` - 设置
- `star` - 收藏/特色
- `heart` - 喜欢
- `link` - 链接

更多图标请参考 Once UI 文档。
