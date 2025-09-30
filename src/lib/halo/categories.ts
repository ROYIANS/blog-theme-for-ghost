import { coreApiClient } from "./client";
import type { Category } from "@halo-dev/api-client";

/**
 * Get all published categories
 * Note: Category API is in coreApiClient.content.category, requires authentication
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await coreApiClient.content.category.listCategory({
      page: 0,
      size: 100,
      sort: ["metadata.creationTimestamp,desc"],
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Get category by name
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const response = await coreApiClient.content.category.getCategory({
      name,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch category with name: ${name}`, error);
    return null;
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await getCategories();
    return categories.find((cat) => cat.spec.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch category with slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get post count for a category
 */
export async function getCategoryPostCount(categoryName: string): Promise<number> {
  try {
    const response = await coreApiClient.content.post.listPost({
      page: 0,
      size: 1,
      fieldSelector: [`spec.categories=${categoryName}`],
    });

    return response.data.total || 0;
  } catch (error) {
    console.error(`Failed to fetch post count for category: ${categoryName}`, error);
    return 0;
  }
}