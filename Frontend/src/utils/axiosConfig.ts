// src/utils/axiosConfig.ts
import axios from "axios";
import { getToken } from "../services/authService";

const instance = axios.create({
  baseURL: "http://localhost:4000/",
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
    