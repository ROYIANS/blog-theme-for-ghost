import { Text, Row, Line } from "@once-ui-system/core";

export const person = {
  firstName: "ROYIANS",
  lastName: "",
  name: "ROYIANS",
  role: "Developer",
  avatar: "/images/avatar.jpg", // 默认头像，实际会从 Halo 获取
  email: "royians@vidorra.life",
  location: "Asia/Shanghai",
  languages: ["中文", "English"],
};

export const newsletter = {
  display: false,
  title: <>Subscribe to Newsletter</>,
  description: <>Weekly updates about technology and development</>,
};

export const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/ROYIANS",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

export const home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `ROYIANS's Blog`,
  description: `A modern blog powered by Halo CMS and Next.js`,
  headline: <>Welcome to my blog</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Featured</strong>
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Latest post
        </Text>
      </Row>
    ),
    href: "/blog",
  },
  subline: <>Sharing thoughts on technology, development, and life.</>,
};

export const about = {
  path: "/about",
  label: "About",
  title: `About – ROYIANS`,
  description: `Learn more about ROYIANS`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: <>This is the about page.</>,
  },
};

export const blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog",
  description: "Read my latest articles",
};

export const work = {
  path: "/work",
  label: "Work",
  title: "My Work",
  description: "Explore my projects",
};

export const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery",
  description: "View my gallery",
};