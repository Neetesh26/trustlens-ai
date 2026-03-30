import axios from "axios";
import { CONFIG } from "../config/index";

const axiosInstance = axios.create({
  baseURL: CONFIG.BASE_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("token",token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;