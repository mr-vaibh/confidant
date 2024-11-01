// src/app/auth/utils.ts
import axios from "axios";
import Cookies from "js-cookie";

// Base API setup for making HTTP requests
const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        Accept: "application/json",
    },
});

// Stores a token in cookies
/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of the token (access or refresh).
 */
const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
};

/**
 * Retrieves a token from cookies.
 * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
 * @returns {string | undefined} The token, if found.
 */
const getToken = (type: string) => {
    return Cookies.get(type + "Token");
};

/**
 * Removes both access and refresh tokens from cookies.
 */
const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};

// APIs for authentication
const register = (email: string, password: string, re_password: string) => {
    return api.post("/auth/users/", { email, password, re_password });
};

const login = (email: string, password: string) => {
    return api.post("/auth/jwt/create/", { email, password });
};

const logout = () => {
    const refreshToken = getToken("refresh");
    return api.post("/auth/logout/", { refresh: refreshToken });
};

const handleJWTRefresh = () => {
    const refreshToken = getToken("refresh");
    return api.post("/auth/jwt/refresh/", { refresh: refreshToken });
};

const verifyToken = (token: string) => {
    return api.post("/auth/jwt/verify/", { token });
};

const resetPassword = (email: string) => {
    return api.post("/auth/users/reset_password/", { email });
};

const resetPasswordConfirm = (
    new_password: string,
    re_new_password: string,
    token: string,
    uid: string
) => {
    return api.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password,
        re_new_password,
    });
};

export const AuthActions = () => {
    return {
        login,
        resetPasswordConfirm,
        handleJWTRefresh,
        verifyToken,
        register,
        resetPassword,
        storeToken,
        getToken,
        logout,
        removeTokens,
    };
};
