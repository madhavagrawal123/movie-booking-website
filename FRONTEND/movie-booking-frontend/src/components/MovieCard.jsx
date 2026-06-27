import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="cursor-pointer transition-transform hover:scale-105"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded-lg w-full h-[300px] object-cover"
      />

      <h3 className="mt-2 font-semibold text-white truncate">
        {movie.title}
      </h3>

      <p className="text-yellow-400">
        ⭐ {movie.vote_average?.toFixed(1)}
      </p>
    </div>
  );
}

export default MovieCard;