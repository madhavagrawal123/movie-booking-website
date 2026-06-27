import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const registerUser = (data) =>
  API.post("/auth/user/register", data);

export const loginUser = (data) =>
  API.post("/auth/user/login", data);

export const logoutUser = () =>
  API.post("/auth/user/logout");

