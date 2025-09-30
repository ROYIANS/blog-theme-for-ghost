import { publicApiClient } from "./client";
import type { ListedPostVo, PostVo, ListedPostVoList } from "@halo-dev/api-client";

export interface PostQueryParams {
  page?: number;
  size?: number;
  sort?: string[];
  labelSelector?: string[];
  fieldSelector?: string[];
}

export interface PagedPostResponse {
  items: ListedPostVo[];
  page: number;
  size: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Get paginated list of published posts
 * Uses publicApiClient.content.post.queryPosts (no authentication required)
 */
export async function getPosts(params?: PostQueryParams): Promise<PagedPostResponse> {
  try {
    const response = await publicApiClient.content.post.queryPosts({
      page: params?.page ?? 1,
      size: params?.size ?? 10,
      sort: params?.sort,
      labelSelector: params?.labelSelector,
      fieldSelector: params?.fieldSelector,
    });

    const data: ListedPostVoList = response.data;

    return {
      items: data.items,
      page: data.page,
      size: data.size,
      total: data.total,
      hasNext: data.hasNext,
      hasPrevious: data.hasPrevious,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

/**
 * Get single post by name
 */
export async function getPostByName(name: string): Promise<PostVo | null> {
  try {
    const response = await publicApiClient.content.post.queryPostByName({
      name,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch post with name: ${name}`, error);
    return null;
  }
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<ListedPostVo | null> {
  try {
    const response = await publicApiClient.content.post.queryPosts({
      page: 1,
      size: 1000,
    });

    return response.data.items.find((postVo: ListedPostVo) => postVo.spec?.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch post with slug: ${slug}`, error);
    return null;
  }
}

/**
 * Get post content by name
 */
export async function getPostContent(name: string): Promise<string> {
  try {
    const response = await publicApiClient.content.post.queryPostByName({
      name,
    });
    return response.data.content?.content || "";
  } catch (error) {
    console.error(`Failed to fetch content for post: ${name}`, error);
    throw new Error("Failed to fetch post content");
  }
}

/**
 * Search posts by keyword using fieldSelector
 * Note: Search is implemented client-side by filtering results
 */
export async function searchPosts(
  keyword: string,
  params?: PostQueryParams
): Promise<PagedPostResponse> {
  const result = await getPosts({ ...params, size: params?.size ?? 100 });

  if (!keyword) return result;

  const lowerKeyword = keyword.toLowerCase();
  const filteredItems = result.items.filter((postVo) => {
    const title = postVo.spec?.title?.toLowerCase() || "";
    const excerpt = postVo.spec?.excerpt?.autoGenerate ? "" : (postVo.spec?.excerpt?.raw?.toLowerCase() || "");
    return title.includes(lowerKeyword) || excerpt.includes(lowerKeyword);
  });

  return {
    ...result,
    items: filteredItems,
    total: filteredItems.length,
  };
}

/**
 * Get posts by year and month for archives
 */
export async function getPostsByYearMonth(
  year: number,
  month?: number
): Promise<ListedPostVo[]> {
  try {
    const { items } = await getPosts({ size: 1000 });

    return items.filter((postVo) => {
      if (!postVo.spec?.publishTime) return false;

      const publishDate = new Date(postVo.spec.publishTime);
      const postYear = publishDate.getFullYear();
      const postMonth = publishDate.getMonth() + 1;

      if (month) {
        return postYear === year && postMonth === month;
      }
      return postYear === year;
    });
  } catch (error) {
    console.error(`Failed to fetch posts for ${year}/${month || "all"}`, error);
    return [];
  }
}

/**
 * Get all unique years that have posts
 */
export async function getPostYears(): Promise<number[]> {
  try {
    const { items } = await getPosts({ size: 1000 });

    const years = new Set<number>();
    items.forEach((postVo) => {
      if (postVo.spec?.publishTime) {
        const year = new Date(postVo.spec.publishTime).getFullYear();
        years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  } catch (error) {
    console.error("Failed to fetch post years", error);
    return [];
  }
}