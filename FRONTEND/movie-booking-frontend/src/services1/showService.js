import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const getShows = (screenId) =>
    API.get(`/build/shows/${screenId}`);

export const createShow = (theatreId, screenId, data) =>
    API.post(
        `/build/createshow/${theatreId}/${screenId}`,
        data
    );


export const getShow  = (showId) =>
    API.get(`/build/show/${showId}`); 
export const updateShow = (showId, data) =>
    API.put(`/build/updateshow/${showId}`, data);
export const deleteShow = (showId) =>
    API.delete(`/build/deleteshow/${showId}`);