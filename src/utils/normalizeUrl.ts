/**
 * Normalize image URL - add Halo base URL if it's a relative path
 */
export function normalizeImageUrl(url?: string): string | undefined {
  if (!url) return undefined;

  // If already a full URL (http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a data URL, return as is
  if (url.startsWith('data:')) {
    return url;
  }

  // If it's a relative path, prepend Halo API base URL
  const baseUrl = process.env.NEXT_PUBLIC_HALO_API_URL || 'http://localhost:8090';
  // Remove trailing slash from baseUrl and leading slash from url if exists
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  return `${cleanBaseUrl}${cleanUrl}`;
}

/**
 * Normalize avatar URL - alias for normalizeImageUrl
 */
export const normalizeAvatarUrl = normalizeImageUrl;
