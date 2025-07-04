// src/services/authService.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api/auth";

export type DecodedToken = {
  id: number;
  email: string;
  role: string;
  fullName?: string;
  exp: number;
};

export const login = async (email: string, password: string): Promise<DecodedToken> => {
  const res = await axios.post(`${API}/login`, { email, password });
  const { token } = res.data;

  const decoded: DecodedToken = jwtDecode(token);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(decoded));

  return decoded;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");

export const getUser = (): DecodedToken | null => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};
