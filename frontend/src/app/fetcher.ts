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
    // Inside the response interceptor
    if (error.response.status === 401) {
      try {
        const { access } = (await handleJWTRefresh()).data as { access: string };
        storeToken(access, "access");
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(new Error("Unauthorized"));
      }
    }


    return Promise.reject(error);
  }
);

// Fetcher function to make GET requests
export const fetcher = (url: string): Promise<any> => {
  return api.get(url).then((response) => response.data);
};
