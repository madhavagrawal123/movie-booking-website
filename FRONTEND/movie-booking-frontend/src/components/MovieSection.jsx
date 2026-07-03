import MovieCard from "./MovieCard";

function MovieSection({ title, movies,loading }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6">
        {title}
      </h2>

{loading ? (
  <div className="flex justify-center py-10">
    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
       
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
)}
    </section>
  );
}

export default MovieSection;