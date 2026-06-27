import { useNavigate } from "react-router-dom";
function HeroBanner({ movie }) {
  if (!movie) return null;
 const navigate = useNavigate();
  const backdrop =
    `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <section
      className="
      relative
      h-[70vh]
      bg-cover
      bg-center
      flex
      items-center
      "
      style={{
        backgroundImage: `url(${backdrop})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-3xl px-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          {movie.title}
        </h1>

        <p className="text-zinc-300 mb-6 line-clamp-4">
          {movie.overview}
        </p>

        <button
          className="
          bg-red-500
          hover:bg-red-600
          px-6
          py-3
          rounded-lg
          text-white
          font-semibold
          "
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          View Details
        </button>
      </div>
    </section>
  );
}

export default HeroBanner;