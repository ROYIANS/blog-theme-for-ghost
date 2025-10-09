import { getMenuPages, getPageMetadata } from "@/lib/halo/pages";
import type { SinglePage } from "@halo-dev/api-client";

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  order: number;
}

/**
 * Build navigation menu from Halo pages
 * Pages with menu.icon annotation will appear in the navigation
 */
export async function buildNavigationMenu(): Promise<MenuItem[]> {
  try {
    const pages = await getMenuPages();

    const menuItems: MenuItem[] = pages
      .map((page) => {
        if (!page.spec) return null;

        const metadata = getPageMetadata(page);

        return {
          path: `/page/${page.spec.slug}`,
          label: page.spec.title,
          icon: metadata.menuIcon || "document",
          order: metadata.menuOrder || 999,
        };
      })
      .filter((item): item is MenuItem => item !== null);

    // Sort by order
    menuItems.sort((a, b) => a.order - b.order);

    return menuItems;
  } catch (error) {
    console.error("Failed to build navigation menu:", error);
    return [];
  }
}

/**
 * Get static menu items (blog, etc)
 */
export function getStaticMenuItems(): MenuItem[] {
  return [
    {
      path: "/",
      label: "Home",
      icon: "home",
      order: 0,
    },
    {
      path: "/blog",
      label: "Blog",
      icon: "book",
      order: 100,
    },
  ];
}

/**
 * Merge static and dynamic menu items
 */
export async function getFullNavigationMenu(): Promise<MenuItem[]> {
  const staticItems = getStaticMenuItems();
  const dynamicItems = await buildNavigationMenu();

  const allItems = [...staticItems, ...dynamicItems];

  // Sort by order
  allItems.sort((a, b) => a.order - b.order);

  return allItems;
}
