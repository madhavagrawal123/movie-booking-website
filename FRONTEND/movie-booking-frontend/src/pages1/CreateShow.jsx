import { useState ,useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createShow } from "../services1/showService";

function CreateShow() {

    const { theatreId, screenId } = useParams();

    const navigate = useNavigate();

    const { state } = useLocation();
useEffect(() => {
    if (!state?.movie) {
        navigate(
            `/owner/theatres/${theatreId}/screens/${screenId}/shows/search`,
            { replace: true }
        );
    }
}, [state, navigate, theatreId, screenId]);

       

    const movie = state.movie;

    const [formData, setFormData] = useState({
        date: "",
        time: "",
    });

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const data = {
                movieId: movie.id,
                movieTitle: movie.title,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                date: formData.date,
                time: formData.time,
            };

            await createShow(
                theatreId,
                screenId,
                data
            );

            toast.success("Show created successfully!");

            navigate(
                `owner/theatres/${theatreId}/screens/${screenId}/shows`
            );

        } catch (error) {

            console.log(error);

            toast.error("Failed to create show.");

        }

    }

    return (

        <div className="max-w-2xl mx-auto">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white"
            >
                ← Back
            </button>

            <h1 className="text-3xl font-bold text-white mb-8">

                Create Show

            </h1>

            <div className="bg-zinc-900 border border-red-700 rounded-xl p-8">

                <div className="flex gap-6 mb-8">

                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-36 rounded-lg"
                    />

                    <div className="flex flex-col justify-center">

                        <h2 className="text-2xl font-bold text-white">

                            {movie.title}

                        </h2>

                        <p className="text-gray-400 mt-2">

                            Release Date: {movie.release_date}

                        </p>

                    </div>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div>

                        <label className="block text-gray-300 mb-2">

                            Show Date

                        </label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
                        />

                    </div>

                    <div>

                        <label className="block text-gray-300 mb-2">

                            Show Time

                        </label>

                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
                        />

                    </div>

                    <button
                        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white"
                    >
                        Create Show
                    </button>

                </form>

            </div>

        </div>

    );

}

export default CreateShow;