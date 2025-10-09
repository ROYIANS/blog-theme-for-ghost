import { coreAxiosInstance } from "./client";
import { normalizeAvatarUrl } from "@/utils/normalizeUrl";

/**
 * User information from Halo
 */
export interface UserInfo {
  name: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  email: string;
}

/**
 * Get user information by username
 * Uses Console API that requires authentication
 */
export async function getUserByName(username: string): Promise<UserInfo | null> {
  try {
    const response = await coreAxiosInstance.get(
      `/apis/api.console.halo.run/v1alpha1/users/${username}`
    );

    const user = response.data.user;

    return {
      name: user.metadata.name,
      displayName: user.spec.displayName,
      avatar: normalizeAvatarUrl(user.spec.avatar),
      bio: user.spec.bio,
      email: user.spec.email,
    };
  } catch (error) {
    console.error(`Failed to fetch user: ${username}`, error);
    return null;
  }
}

/**
 * Get current authenticated user information
 * Uses Console API that requires authentication
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await coreAxiosInstance.get(
      "/apis/api.console.halo.run/v1alpha1/users/-"
    );

    const user = response.data.user;

    return {
      name: user.metadata.name,
      displayName: user.spec.displayName,
      avatar: normalizeAvatarUrl(user.spec.avatar),
      bio: user.spec.bio,
      email: user.spec.email,
    };
  } catch (error) {
    console.error("Failed to fetch current user", error);
    return null;
  }
}

/**
 * Get site owner/admin information
 * You can configure the admin username in environment variable
 */
export async function getSiteOwner(): Promise<UserInfo | null> {
  const adminUsername = process.env.HALO_SITE_OWNER || "admin";
  return getUserByName(adminUsername);
}
