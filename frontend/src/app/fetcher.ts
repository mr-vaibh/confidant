// src/app/fetcher.ts

import axios from "axios";
import { AuthActions } from "@/app/auth/utils";

import publicPaths from "@/publicPaths";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

// Create an Axios instance with default settings
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
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401, try to refresh the token
    // Inside the response interceptor
    if (error.response.status === 401) {
      try {
        const { access } = (await handleJWTRefresh()).data as { access: string };
        storeToken(access, "access");
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        // If the refresh token is expired, log the user out
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

// Fetcher function
export const fetcher = async <T>(url: string, method: 'GET' | 'POST' = 'GET', data?: any, noAuth: boolean = false): Promise<T> => {
  try {
    const response = method === 'POST'
      ? await api.post<T>(url, data, { headers: { noAuth } })
      : await api.get<T>(url, { headers: { noAuth } });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'An error occurred while fetching data.');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
};