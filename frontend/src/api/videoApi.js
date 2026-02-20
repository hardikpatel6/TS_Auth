import API from "./axios";

export const getVideosApi = () =>
  API.get("/videos/");

export const getVideoByIdApi = (id) =>
  API.get(`/videos/${id}`);

export const uploadVideoApi = (data) =>
  API.post("/videos/upload-video", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const searchVideosApi = (query) =>
  API.get(`/videos/search?title=${query}`);

export const likeVideoApi = (id) =>
  API.post(`/videos/like/${id}`);

export const dislikeVideoApi = (id) =>
  API.post(`/videos/dislike/${id}`);

export const subscribeVideoApi = (videoId) =>
  API.post(`/videos/subscribe/${videoId}`);

export const unsubscribeVideoApi = (videoId) =>
  API.post(`/videos/unsubscribe/${videoId}`);
