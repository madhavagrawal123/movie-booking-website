import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

export const getAllShows = (
  movieId,
  city,
  date
) =>
  API.post(`/book/Allshows/${movieId}`, {
    city,
    date,
  });

export const getShowSeats = (showId) =>
  API.get(`/book/getShowSeats/${showId}`);

export const holdSeats = (
  showId,
  seatNumbers
) =>
  API.post(
    `/book/holdSeats/${showId}`,
    {
      seatNumbers,
    }
  );

export const confirmBooking = (
  showId,
  seatNumbers,
  totalAmount
) =>
  API.post(
    `/book/confirmBooking/${showId}`,
    {
      seatNumbers,
      totalAmount,
    }
  );  

export const getBookingHistory = () =>
  API.get("/book/history");

export const cancelBooking = (bookingId) =>
  API.post(`/book/cancelBooking/${bookingId}`);

export const getWishlist = () =>
    API.get("/book/wishlist");

export const getdates = (movieId,city) =>
   API.get(`/book/available-dates/${movieId}?city=${city}`)

export const toggleWishlist = (
    movieId,
    movieData
) =>
    API.post(
        `/book/wishlist/${movieId}`,
        movieData
    );

export const checkWishlist = (
    movieId
) =>
    API.get(
        `/book/wishlist/check/${movieId}`
    );

export const releaseSeats = (
  showId,
  seatNumbers
) =>
  API.post(
    `/book/release-seats/${showId}`,
    { seatNumbers },
    {
      withCredentials: true,
    }
  );