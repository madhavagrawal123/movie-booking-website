import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export const registerUser = (data) =>
  API.post("/auth/user/register", data);

export const loginUser = (data) =>
  API.post("/auth/user/login", data);

export const logoutUser = () =>
  API.post("/auth/user/logout");

export const getDashboard = () =>
  API.get("/build/dashboard");