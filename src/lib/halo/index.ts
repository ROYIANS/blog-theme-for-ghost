// Export API clients
export { publicApiClient, coreApiClient } from "./client";

// Export Posts API
export {
  getPosts,
  getPostByName,
  getPostBySlug,
  getPostContent,
  searchPosts,
  getPostsByYearMonth,
  getPostYears,
} from "./posts";

export type { PostQueryParams, PagedPostResponse } from "./posts";

// Export Categories API
export {
  getCategories,
  getCategoryByName,
  getCategoryBySlug,
  getCategoryPostCount,
} from "./categories";

// Export Tags API
export { getTags, getTagByName, getTagBySlug, getTagPostCount } from "./tags";

// Export Pages API
export { getAllPages, getPageByName, getPageBySlug, getPageContent } from "./pages";