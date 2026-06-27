import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
    getWishlist,
    toggleWishlist,
} from "../services/bookingService";

function WishlistPage() {

    const navigate = useNavigate();

    const [movies, setMovies] =
        useState([]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {

        try {

            const response =
                await getWishlist();

            setMovies(
                response.data.wishlist
            );

        } catch (error) {

            console.log(error);

        }

    };

    const handleRemove =
        async (movie) => {

            try {

                await toggleWishlist(
                    movie.tmdbMovieId,
                    movie
                );

                setMovies(
                    movies.filter(
                        (m) =>
                            m.tmdbMovieId !==
                            movie.tmdbMovieId
                    )
                );

            } catch (error) {

                console.log(error);

            }

        };

    return (

        <div className="bg-zinc-950 min-h-screen text-white">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h1 className="text-4xl font-bold mb-8">

                    My Wishlist

                </h1>

                {
                    movies.length === 0 ?

                        (

                            <div className="text-center mt-24">

                                <h2 className="text-3xl">

                                    ❤️ Wishlist is Empty

                                </h2>

                                <button
                                    onClick={() => navigate("/")}
                                    className="
                                    mt-8
                                    bg-red-500
                                    px-6
                                    py-3
                                    rounded-lg
                                    "
                                >
                                    Browse Movies
                                </button>

                            </div>

                        )

                        :

                        (

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

                                {

                                    movies.map((movie) => (

                                        <div
                                            key={movie.tmdbMovieId}
                                            className="
                                            bg-zinc-900
                                            rounded-xl
                                            overflow-hidden
                                            "
                                        >

                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                                alt={movie.title}
                                                className="w-full h-80 object-cover cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/movie/${movie.tmdbMovieId}`
                                                    )
                                                }
                                            />

                                            <div className="p-4">

                                                <h2 className="font-semibold">

                                                    {movie.title}

                                                </h2>

                                                <p className="text-yellow-400 mt-2">

                                                    ⭐ {movie.voteAverage}

                                                </p>

                                                <p className="text-zinc-400">

                                                    {movie.releaseDate}

                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleRemove(
                                                            movie
                                                        )
                                                    }
                                                    className="
                                                    mt-4
                                                    w-full
                                                    bg-red-500
                                                    py-2
                                                    rounded-lg
                                                    "
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                }

            </div>

        </div>

    );

}

export default WishlistPage;