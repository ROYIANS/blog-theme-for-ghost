import axios from "axios";
import { createCoreApiClient } from "@halo-dev/api-client";

// 服务端专用客户端（带认证）
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HALO_API_URL || "http://localhost:8090",
  headers: {
    Authorization: `Bearer ${process.env.HALO_API_TOKEN}`,
  },
  timeout: 10000,
});

// 添加请求拦截器
axiosInstance.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Halo API] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Halo API Error]:", error.message);
    if (error.response?.status === 401) {
      console.error("API 认证失败，请检查 HALO_API_TOKEN 环境变量");
    }
    return Promise.reject(error);
  }
);

export const coreApiClient = createCoreApiClient(axiosInstance);