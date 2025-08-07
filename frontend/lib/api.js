import axios from "axios";
import { getToken } from "./auth";
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
