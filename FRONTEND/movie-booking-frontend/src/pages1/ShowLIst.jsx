import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShows } from "../services1/showService";

function ShowList() {

    const { theatreId, screenId } = useParams();

    const navigate = useNavigate();

    const [shows, setShows] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShows();
    }, []);

    async function fetchShows() {

        try {

            const response = await getShows(screenId);

            setShows(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    }

    return (

        <div className="max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-8">

                <button
                    onClick={() => navigate(-1)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg"
                >
                    ← Back
                </button>

                <button
                    onClick={() =>
                        navigate(`/owner/theatres/${theatreId}/screens/${screenId}/shows/search`)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                    + Create Show
                </button>

            </div>

            <h1 className="text-4xl font-bold text-red-500 mb-8">

                Manage Shows

            </h1>

            {

                shows.length === 0 ?

                    (

                        <div className="bg-zinc-900 border border-red-700 rounded-xl p-12 text-center">

                            <h2 className="text-2xl text-white mb-3">

                                No Shows Found

                            </h2>

                            <p className="text-gray-400">

                                Click "Create Show" to add your first show.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {

                                shows.map((show) => (

                                    <div
                                        key={show._id}
                                        onClick={() =>
                                            navigate(`/owner/shows/${show._id}`)
                                        }
                                        className="cursor-pointer bg-zinc-900 border border-red-700 rounded-xl p-6 hover:border-red-500 hover:scale-[1.02] transition-all duration-300"
                                    >
                                        
                                        <h2 className="text-2xl font-bold text-white mb-4">

                                            {show.movieTitle}

                                        </h2>

                                        <div className="space-y-2 text-gray-300">

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Date :

                                                </span>

                                                {" "}

                                                {new Date(show.showDate).toLocaleDateString()}

                                            </p>

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Time :

                                                </span>

                                                {" "}

                                                {"200"}

                                            </p>

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Price :

                                                </span>

                                                {" "}

                                                ₹{show.ticketPrice}

                                            </p>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

}

export default ShowList;