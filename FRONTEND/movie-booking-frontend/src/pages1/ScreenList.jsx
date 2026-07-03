import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScreens } from "../services1/screenService";

function ScreenList() {
     console.log("✅ ScreenList mounted");

    const { theatreId } = useParams();

    const navigate = useNavigate();

    const [screens, setScreens] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScreens();
    }, []);

    async function fetchScreens() {

        try {

            const response = await getScreens(theatreId);
            console.log(response.data);
            setScreens(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="text-white text-xl">
                Loading...
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
                        navigate(`/owner/theatres/${theatreId}/screens/create`)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                    + Create Screen
                </button>

            </div>

            <h1 className="text-4xl font-bold text-red-500 mb-8">

                Manage Screens

            </h1>

            {

                screens.length === 0 ?

                    (

                        <div className="bg-zinc-900 border border-red-700 rounded-xl p-12 text-center">

                            <h2 className="text-2xl text-white mb-3">

                                No Screens Found

                            </h2>

                            <p className="text-gray-400">

                                Click "Create Screen" to add your first screen.

                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {

                                screens.map((screen) => (

                                    <div
                                        key={screen._id}
                                        onClick={() =>
                                            navigate(`/owner/screens/${screen._id}`)
                                        }
                                        className="cursor-pointer bg-zinc-900 border border-red-700 rounded-xl p-6 hover:border-red-500 hover:scale-[1.02] transition-all duration-300"
                                    >

                                        <h2 className="text-2xl font-bold text-white mb-4">

                                            {screen.screenName}

                                        </h2>

                                        <div className="space-y-2 text-gray-300">

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Rows :

                                                </span>

                                                {" "}

                                                {screen.rows}

                                            </p>

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Seats / Row :

                                                </span>

                                                {" "}

                                                {screen.seatsPerRow}

                                            </p>

                                            <p>

                                                <span className="font-semibold text-red-500">

                                                    Total Seats :

                                                </span>

                                                {" "}

                                                {screen.rows * screen.seatsPerRow}

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

export default ScreenList;