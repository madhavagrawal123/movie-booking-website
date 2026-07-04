import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchMovies } from "../services/movieService";

function MovieSearch() {

    const navigate = useNavigate();

    const { theatreId, screenId } = useParams();

    const [query, setQuery] = useState("");

    const [movies, setMovies] = useState([]);

    const [loading, setLoading] = useState(false);

    async function handleSearch(e) {

        e.preventDefault();

        if (!query.trim()) return;

        try {

            setLoading(true);

            const response = await searchMovies(query);

            setMovies(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-6xl mx-auto text-white">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
            >
                ← Back
            </button>

            <h1 className="text-4xl font-bold text-red-500 mb-8">

                Search Movie

            </h1>

            <form
                onSubmit={handleSearch}
                className="flex gap-4 mb-10"
            >

                <input
                    type="text"
                    placeholder="Search movie..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3"
                />

                <button
                    className="bg-red-600 hover:bg-red-700 px-6 rounded-lg"
                >
                    Search
                </button>

            </form>

            {

                loading &&

                <div className="flex justify-center items-center h-[80vh]">
                <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            }

            {

                !loading && movies.length === 0 &&

                <div className="text-gray-400 text-center">

                    Search for a movie to begin.

                </div>

            }

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

                {

                    movies.map((movie) => (

                        <div
                            key={movie.id}
                            onClick={() =>
                                navigate(
                                    `/owner/theatres/${theatreId}/screens/${screenId}/shows/create`,
                                    {
                                        state: {
                                            movie,
                                        },
                                    }
                                )
                            }
                            className="cursor-pointer bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 hover:border-red-500 hover:scale-105 transition-all"
                        >

                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-72 object-cover"
                            />

                            <div className="p-4">

                                <h2 className="font-semibold">

                                    {movie.title}

                                </h2>

                                <p className="text-gray-400 text-sm mt-2">

                                    {movie.release_date}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default MovieSearch;