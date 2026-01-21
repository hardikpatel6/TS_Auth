// src/api/authApi.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupApi = (data) => API.post("/users/register", data);
export const loginApi = (data) => API.post("/users/login", data);
export const refreshTokenApi = () => API.post("/users/refreshToken");
export const logoutApi = () => API.post("/users/logout");
export const getProfileApi = () => API.get("/users/profile");
