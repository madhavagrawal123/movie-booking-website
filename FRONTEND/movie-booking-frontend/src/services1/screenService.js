import axios from "axios";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

export const getScreens = (theatreId) =>
    API.get(`/build/screens/${theatreId}`);

export const createScreen = (theatreId, data) =>
    API.post(`/build/createscreen/${theatreId}`, data);

export const updateScreen = (
    theatreId,
    screenId,
    data
) =>
    API.put(
        `/build/updatescreen/${theatreId}/${screenId}`,
        data
    );

export const deleteScreen = (
    theatreId,
    screenId
) =>
    API.delete(
        `/build/deletescreen/${theatreId}/${screenId}`
    );

export const getScreenById = (theatreId, screenId) =>
    API.get(`/build/screens/${theatreId}/${screenId}`);
