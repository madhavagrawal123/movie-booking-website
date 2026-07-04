import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import { getMovieDetails } from "../services/movieService";
import { getAllShows } from "../services/bookingService";

function BookingPage() {
  const { movieId } = useParams();

  const navigate = useNavigate();

  const [loadingMovie, setLoadingMovie] = useState(true);

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  const [city, setCity] = useState("Delhi");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    fetchShows();
  }, [city, date]);

  const fetchMovie = async () => {
    setLoadingMovie(true);

    try {
      const response = await getMovieDetails(movieId);
      setMovie(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMovie(false);
    }
  };

  const fetchShows = async () => {
    try {
      const response = await getAllShows(
        movieId,
        city,
        date
      );
      console.log(response.data);
      setShows(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingMovie ? (
          <div className="flex justify-center items-center h-72">
            <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          movie && (
            <div className="flex gap-8 mb-10">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 rounded-xl"
              />

              <div>
                <h1 className="text-4xl font-bold mb-3">
                  {movie.title}
                </h1>

                <p className="mb-2">
                  ⭐ {movie.vote_average}
                </p>

                <p className="mb-2">
                  Release Date: {movie.release_date}
                </p>

                <p className="text-zinc-400 max-w-3xl">
                  {movie.overview}
                </p>
              </div>
            </div>
          )
        )}

        <div className="flex gap-4 mb-8">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-zinc-800 p-3 rounded-lg text-white"
          >
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Indore</option>
            <option>Bhopal</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-zinc-800 p-3 rounded-lg text-white"
          />
        </div>

        {shows.length === 0 ? (
          <div className="text-zinc-400">
            No shows available.
          </div>
        ) : (
          shows.map((theatre) => (
            <div
              key={theatre.theatreName}
              className="bg-zinc-900 p-6 rounded-xl mb-5"
            >
              <h2 className="text-2xl font-semibold mb-4">
                {theatre.theatreName}
              </h2>

              <div className="flex flex-wrap gap-3">
                {theatre.timings.map((timing) => (
                  <button
                    key={timing.showId}
                    onClick={() =>
                      navigate(`/seats/${timing.showId}`)
                    }
                    className="
                      border
                      border-green-500
                      text-green-400
                      px-4
                      py-2
                      rounded-lg
                      hover:bg-green-500
                      hover:text-white
                      transition
                    "
                  >
                    {timing.time}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookingPage;