import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

export const getMyTheatres = () =>
    API.get("/build/mytheatres");

export const createTheatre = (data) =>
    API.post("/build/createthreatre", data);

export const updateTheatre = (theatreId, data) =>
    API.put(`/build/updatethreatre/${theatreId}`, data);

export const deleteTheatre = (theatreId) =>
    API.delete(`/build/deletethreatre/${theatreId}`);
export const getTheatre = (theatreId) =>
    API.get(`/build/theatre/${theatreId}`);

