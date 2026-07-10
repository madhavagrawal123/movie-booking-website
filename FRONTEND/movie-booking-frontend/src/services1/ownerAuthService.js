import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

export const logoutOwner = () =>
    API.post("/auth/user/logout");