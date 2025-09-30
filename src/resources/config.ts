// 站点配置
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
  name: "Halo Blog",
  title: "Halo Blog - Powered by Next.js and Halo CMS",
  description: "A modern blog theme built with Next.js 15 and Halo CMS",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  author: {
    name: "Blog Author",
    email: "author@example.com",
    avatar: "/avatar.jpg",
    bio: "A passionate developer and writer",
  },
  social: [
    { name: "GitHub", icon: "github", url: "https://github.com" },
    { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
  ],
  features: {
    search: false,
    comments: false,
    newsletter: false,
    darkMode: true,
  },
  pagination: {
    perPage: 10,
  },
};

// 固定路由配置
export const FIXED_ROUTES = {
  about: "/about",
  contact: "/contact",
} as const;

export type FixedRouteName = keyof typeof FIXED_ROUTES;