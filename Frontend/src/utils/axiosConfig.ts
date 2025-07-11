// src/utils/axiosConfig.ts
import axios from "axios";
import { getToken } from "../services/authService";

const apiURL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: apiURL,
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
    