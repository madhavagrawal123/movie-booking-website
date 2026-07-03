import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
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

export const getScreenById = (screenId) =>
    API.get(`/screen/${screenId}`);
