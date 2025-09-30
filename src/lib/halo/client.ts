import axios from "axios";
import { createPublicApiClient, createCoreApiClient } from "@halo-dev/api-client";

// Axios instance for public API (no authentication required)
const publicAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL || "http://localhost:8090",
  timeout: 10000,
});

// Axios instance for Core API (requires authentication - server-side only)
const coreAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL || "http://localhost:8090",
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`,
  },
  timeout: 10000,
});

// Request interceptors
publicAxiosInstance.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Halo Public API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

coreAxiosInstance.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Halo Core API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptors
publicAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Halo Public API Error]:", error.message);
    return Promise.reject(error);
  }
);

coreAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Halo Core API Error]:", error.message);
    if (error.response?.status === 401) {
      console.error("API 认证失败，请检查 HALO_API_TOKEN 环境变量");
    }
    return Promise.reject(error);
  }
);

// Export API clients
export const publicApiClient = createPublicApiClient(publicAxiosInstance);
export const coreApiClient = createCoreApiClient(coreAxiosInstance);