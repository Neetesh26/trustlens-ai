import axiosInstance from "../../services/axiosInstance";

export const loginAPI = (data) =>
  axiosInstance.post("/auth/login", data);

export const registerAPI = (data) =>
  axiosInstance.post("/auth/register", data);