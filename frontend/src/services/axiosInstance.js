import axios from "axios";
import { CONFIG } from "../config";

const axiosInstance = axios.create({
  baseURL: CONFIG.BASE_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;