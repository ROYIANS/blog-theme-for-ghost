import { coreApiClient } from "./client";
import type { Tag } from "@halo-dev/api-client";

/**
 * Get all published tags
 * Note: Tag API is in coreApiClient.content.tag, requires authentication
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await coreApiClient.content.tag.listTag({
      page: 0,
      size: 100,
      sort: ["metadata.creationTimestamp,desc"],
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}

/**
 * Get tag by name
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  try {
    const response = await coreApiClient.content.tag.getTag({
      name,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch tag with name: ${name}`, error);
    return null;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const tags = await getTags();
    return tags.find((tag) => tag.spec.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch tag with slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get post count for a tag
 */
export async function getTagPostCount(tagName: string): Promise<number> {
  try {
    const response = await coreApiClient.content.post.listPost({
      page: 0,
      size: 1,
      fieldSelector: [`spec.tags=${tagName}`],
    });

    return response.data.total || 0;
  } catch (error) {
    console.error(`Failed to fetch post count for tag: ${tagName}`, error);
    return 0;
  }
}