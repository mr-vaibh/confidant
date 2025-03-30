import axios, { AxiosRequestConfig } from "axios";
import { AuthActions } from "@/app/auth/utils";
import publicPaths from "@/publicPaths";

const { handleJWTRefresh, storeToken, getToken } = AuthActions();

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = getToken("access");
    if (token && !config.headers.noAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      try {
        const { access } = (await handleJWTRefresh()).data as { access: string };
        storeToken(access, "access");
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        const isPublicPath = publicPaths.includes(window.location.pathname);
        if (!isPublicPath) {
          window.location.replace("/login");
        }
        return Promise.reject(new Error("Unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generalized fetcher function supporting all HTTP methods.
 * @param url - API endpoint.
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE).
 * @param data - Optional payload for POST, PUT, PATCH.
 * @param noAuth - Whether to bypass authentication.
 * @returns Response data.
 */
export const fetcher = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data?: any,
  noAuth: boolean = false
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: { noAuth },
      data: ["GET", "POST", "PUT", "PATCH"].includes(method) ? data : undefined,
    };

    const response = await api(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "An error occurred while fetching data.");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
