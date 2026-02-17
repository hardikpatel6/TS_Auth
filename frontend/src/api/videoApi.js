import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getVideosApi = () =>
  API.get("/videos/");

export const getVideoByIdApi = (id) =>
  API.get(`/videos/${id}`);

export const likeVideoApi = (id) =>
  API.post(`/videos/like/${id}`);

export const dislikeVideoApi = (id) =>
  API.post(`/videos/dislike/${id}`);

export const subscribeVideoApi = (videoId) =>
  API.post(`/videos/subscribe/${videoId}`);

export const unsubscribeVideoApi = (videoId) =>
  API.post(`/videos/unsubscribe/${videoId}`);
