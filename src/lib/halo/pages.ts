import { coreApiClient, publicApiClient } from "./client";
import type { SinglePage } from "@halo-dev/api-client";

/**
 * Get all published and public pages
 * Note: SinglePage API is in coreApiClient.content.singlePage, requires authentication
 */
export async function getAllPages(): Promise<SinglePage[]> {
  try {
    // Try without fieldSelector first - filter in memory instead
    const response = await coreApiClient.content.singlePage.listSinglePage({
      page: 0,
      size: 100,
      sort: ["metadata.creationTimestamp,desc"],
    });

    // Filter published and public pages in code
    const items = response.data.items || [];
    return items.filter(
      (page) => page.spec?.publish === true && page.spec?.visible === "PUBLIC"
    );
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return [];
  }
}

/**
 * Get page by name
 */
export async function getPageByName(name: string): Promise<SinglePage | null> {
  try {
    const response = await coreApiClient.content.singlePage.getSinglePage({
      name,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch page with name: ${name}`, error);
    return null;
  }
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string): Promise<SinglePage | null> {
  try {
    const pages = await getAllPages();
    return pages.find((page) => page.spec.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch page with slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get page content by name
 * Uses the same approach as posts - get the page and extract content from it
 */
export async function getPageContent(name: string): Promise<string> {
  try {
    const response = await coreApiClient.content.singlePage.getSinglePage({
      name,
    });
    const page = response.data as SinglePage;
    return page.spec.excerpt.raw || '';
  } catch (error) {
    console.error(`Failed to fetch content for page: ${name}`, error);
    throw new Error("Failed to fetch page content");
  }
}

/**
 * Get menu-enabled pages for navigation
 * Filters pages that have menuIcon in metadata
 */
export async function getMenuPages(): Promise<SinglePage[]> {
  try {
    const pages = await getAllPages();
    // Filter pages that have menuIcon in metadata and are published
    return pages.filter(
      (page) =>
        page.spec?.publish &&
        page.spec?.visible === "PUBLIC" &&
        page.metadata?.annotations?.["menu.icon"]
    );
  } catch (error) {
    console.error("Failed to fetch menu pages:", error);
    return [];
  }
}

/**
 * Extract page metadata from annotations
 */
export interface PageMetadata {
  menuIcon?: string;
  menuOrder?: number;
  pageType?: "article" | "gallery" | "custom";
  customTemplate?: string;
}

export function getPageMetadata(page: SinglePage): PageMetadata {
  const annotations = page.metadata?.annotations || {};

  return {
    menuIcon: annotations["menu.icon"],
    menuOrder: annotations["menu.order"] ? parseInt(annotations["menu.order"]) : 999,
    pageType: (annotations["page.type"] as PageMetadata["pageType"]) || "article",
    customTemplate: annotations["page.template"],
  };
}