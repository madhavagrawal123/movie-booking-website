import { useEffect, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    toggleWishlist,
    checkWishlist,
} from "../services/bookingService";
import Navbar from "../components/Navbar";

import { getMovieDetails } from "../services/movieService";

function MovieDetails() {
  const { id } = useParams();
   const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [inWishlist, setInWishlist] =
    useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);
  useEffect(() => {

    fetchWishlistStatus();

}, [id]);

const fetchWishlistStatus =
    async () => {

        try {

            const response =
                await checkWishlist(id);

            setInWishlist(
                response.data.exists
            );

        } catch (error) {

            console.log(error);

        }

    };
  const fetchMovie = async () => {
    try {
      const response =
        await getMovieDetails(id);

      setMovie(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleBookTicket = () => {
  if (!user) {
   navigate("/login", {
  state: {
    redirectTo: `/booking/${movie.id}`,
  },
});
    return;
  }

  navigate(`/booking/${movie.id}`);
};

  if (!movie)
    return (
      <div className="text-white">
        Loading...
      </div>
    );
  
    const handleWishlist =
    async () => {

        try {

            await toggleWishlist(
                movie.id,
                {
                    title: movie.title,
                    posterPath:
                        movie.poster_path,
                    backdropPath:
                        movie.backdrop_path,
                    voteAverage:
                        movie.vote_average,
                    releaseDate:
                        movie.release_date,
                }
            );

            setInWishlist(
                !inWishlist
            );

        } catch (error) {

            console.log(error);

        }

    };




 return (
  <div className="bg-zinc-950 min-h-screen text-white">
    <Navbar />

    <div className="relative h-[50vh]">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="
          w-full
          h-full
          object-cover
        "
      />

      <div
        className="
        absolute
        inset-0
        bg-black/60
        "
      />
    </div>

    <div
      className="
      max-w-7xl
      mx-auto
      px-6
      py-8
      flex
      gap-8
      "
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="
          w-72
          rounded-xl
        "
      />

      <div>
        <h1
          className="
          text-5xl
          font-bold
          mb-4
          "
        >
          {movie.title}
        </h1>

        <p className="mb-3">
          ⭐ {movie.vote_average}
        </p>

        <p className="mb-3">
          Release Date:
          {" "}
          {movie.release_date}
        </p>

        <p className="mb-3">
          Runtime:
          {" "}
          {movie.runtime}
          min
        </p>

        <div className="flex gap-2 mb-6">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="
              bg-red-500
              px-3
              py-1
              rounded-full
              "
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p
          className="
          text-zinc-300
          max-w-3xl
          "
        >
          {movie.overview}
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleBookTicket}
            className="
            bg-red-500
            px-6
            py-3
            rounded-lg
            "
          >
            Book Tickets
          </button>

          <button
    onClick={handleWishlist}
    className="
    border
    border-red-500
    px-6
    py-3
    rounded-lg
    "
>

    {
        inWishlist
            ? "❤️ Remove from Wishlist"
            : "🤍 Add to Wishlist"
    }

</button>
        </div>
      </div>
    </div>
  </div>
);
}

export default MovieDetails;