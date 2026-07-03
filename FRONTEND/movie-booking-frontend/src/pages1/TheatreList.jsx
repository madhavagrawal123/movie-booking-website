import { useEffect, useState } from "react";
import { getMyTheatres } from "../services1/theatreService";
import { useNavigate } from "react-router-dom";

function TheatreList() {
    const navigate = useNavigate();
    const [theatres, setTheatres] = useState([]);

    useEffect(() => {

        fetchTheatres();

    }, []);

    async function fetchTheatres() {

        try {

            const response = await getMyTheatres();
            console.log(response.data);

            setTheatres(response.data || []);

        } catch (error) {

            console.log(error);

        }

    }

    return (

        <div>

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold text-white">
                    My Theatres
                </h1>

               <button
    onClick={() => navigate("/owner/theatres/create")}
    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white"
>
                    + Create Theatre
                </button>

            </div>

            {
                theatres.length === 0
                ?
                <div className="bg-zinc-900 rounded-lg p-8 text-center text-gray-400">
                    No theatres found.
                </div>
                :
                <div className="grid md:grid-cols-2 gap-6">

                    {
                        theatres.map(theatre => (

                            <div
                                key={theatre._id}
                                onClick={() =>
                                    navigate(`/owner/theatres/${theatre._id}`)
                                }
                                className="cursor-pointer bg-zinc-900 border border-red-700 rounded-xl p-6 hover:border-red-500 transition"
                            >

                                <h2 className="text-2xl font-bold text-white">
                                    {theatre.name}
                                </h2>

                                <p className="text-gray-400 mt-2">
                                    {theatre.city}
                                </p>

                                <p className="text-gray-500">
                                    {theatre.address}
                                </p>

                            </div>

                        ))
                    }

                </div>
            }

        </div>

    );

}

export default TheatreList;