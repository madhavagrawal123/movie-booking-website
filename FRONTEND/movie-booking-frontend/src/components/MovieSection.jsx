import MovieCard from "./MovieCard";

function MovieSection({ title, movies }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
}

export default MovieSection;