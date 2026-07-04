import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api"
});

export const getPopularMovies = () =>
    API.get("/movies/popular");

export const getTopRatedMovies = () =>
    API.get("/movies/top-rated");

export const getUpcomingMovies = () =>
    API.get("/movies/upcoming");
export const getMovieDetails = (id) =>
  API.get(`/movies/movie/${id}`);
export const searchMovies = (query) =>
    API.get(`/movies/search?query=${query}`);