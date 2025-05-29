import axios, { AxiosRequestConfig } from "axios";
import { AuthActions } from "@/app/auth/utils";
import publicPaths from "@/publicPaths";
import toast from 'react-hot-toast';

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
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error)))
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const isPublicPath = publicPaths.includes(window.location.pathname);
      try {
        const { access } = (await handleJWTRefresh()).data as { access: string };
        storeToken(access, "access");
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        if (!isPublicPath) {
          window.location.replace("/login");
        }
        // Rethrow the original error to avoid swallowing exceptions
        throw err;
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
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
      const errorFromBackend = error.response ? error.response?.data?.error : "Network Error";

      const isAuthRelatedError = error.request.responseURL.includes("/auth/jwt/refresh");

      if (!isAuthRelatedError) {
        toast.error(errorFromBackend);
      }

      console.log("=========== Fetcher ===========");
      console.log("Backend error:", errorFromBackend);
      console.log("Axios error:", error);
      console.log("===============================\n");
      throw new Error(error.response?.data?.message ?? "An error occurred while fetching data.");
    } else {
      console.error("Unexpected error [other than AXIOS]:", error);
      throw new Error("An unexpected error occurred [other than AXIOS]");
    }
  }
};
