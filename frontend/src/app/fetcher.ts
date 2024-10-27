// src/app/fetcher.ts

import axios from "axios";
import { AuthActions } from "@/app/auth/utils";

// Extract necessary functions from the AuthActions utility.
const { handleJWTRefresh, storeToken, getToken } = AuthActions();

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${getToken("access")}`, // Set the initial access token
  },
});

// Request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = getToken("access");
    if (token) {
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
    if (error.response.status === 401) {
      try {
        const { access } = (await handleJWTRefresh()).data as {
          access: string;
        };

        // Store the new access token
        storeToken(access, "access");

        // Set the new token in the original request's headers
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (err) {
        // If refreshing fails, redirect to login
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

// Fetcher function to make GET requests
export const fetcher = (url: string): Promise<any> => {
  return api.get(url).then((response) => response.data);
};
