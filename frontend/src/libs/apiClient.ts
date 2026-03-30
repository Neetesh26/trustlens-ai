import axios from "axios";
import { store } from "../app/store";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
   console.log("TOKEN FROM REDUX:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});