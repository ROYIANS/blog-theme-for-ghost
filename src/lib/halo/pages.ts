import { coreApiClient } from "./client";
import type { SinglePage } from "@halo-dev/api-client";

/**
 * Get all published and public pages
 * Note: SinglePage API is in coreApiClient.content.singlePage, requires authentication
 */
export async function getAllPages(): Promise<SinglePage[]> {
  try {
    const response = await coreApiClient.content.singlePage.listSinglePage({
      page: 0,
      size: 100,
      fieldSelector: ["spec.publish==true", "spec.visible==PUBLIC"],
      sort: ["metadata.creationTimestamp,desc"],
    });

    return response.data.items || [];
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
 * Note: Content is available in the SinglePage object itself
 */
export async function getPageContent(name: string): Promise<string> {
  try {
    const page = await getPageByName(name);
    if (!page || !page.spec.releaseSnapshot) {
      return "";
    }
    // The content is stored in the release snapshot
    // You may need to fetch it separately through content API
    // For now, return empty string as placeholder
    console.warn(`Content API for SinglePage needs to be implemented for: ${name}`);
    return "";
  } catch (error) {
    console.error(`Failed to fetch content for page: ${name}`, error);
    throw new Error("Failed to fetch page content");
  }
}