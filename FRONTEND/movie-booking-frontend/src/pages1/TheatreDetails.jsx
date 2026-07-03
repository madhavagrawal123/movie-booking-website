import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getTheatre,
    updateTheatre,
    deleteTheatre,
} from "../services1/theatreService";

function TheatreDetails() {
    const { theatreId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [theatre, setTheatre] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: "",
    });

    useEffect(() => {
        fetchTheatre();
    }, []);

    async function fetchTheatre() {
        try {
            const response = await getTheatre(theatreId);

            setTheatre(response.data.theatre);

            setFormData({
                name: response.data.theatre.name,
                city: response.data.theatre.city,
                address: response.data.theatre.address,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleUpdate() {
        try {
            const response = await updateTheatre(
                theatreId,
                formData
            );

            setTheatre(response.data.theatre);

            setIsEditing(false);

            toast.success("Theatre updated successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Unable to update theatre.");
        }
    }

    async function handleDelete() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this theatre?"
        );

        if (!confirmDelete) return;

        try {
            await deleteTheatre(theatreId);

            toast.success("Theatre deleted successfully.");

            navigate("/owner/theatres");
        } catch (error) {
            console.log(error);
            toast.error("Unable to delete theatre.");
        }
    }

    if (loading) {
        return (
           
             <div className="flex justify-center py-10">
    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
        );
    }

    if (!theatre) {
        return (
            <div className="text-red-500 text-xl">
                Theatre not found.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto text-white">

            <button
                onClick={() => navigate("/owner/theatres")}
                className="mb-6 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
            >
                ← Back
            </button>

            <div className="bg-zinc-900 border border-red-700 rounded-xl p-8">

                <h1 className="text-3xl font-bold text-red-500 mb-8">
                    Theatre Details
                </h1>

                <div className="space-y-6">

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Theatre Name
                        </label>

                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {theatre.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-400">
                            City
                        </label>

                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {theatre.city}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Address
                        </label>

                        {isEditing ? (
                            <textarea
                                rows="4"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {theatre.address}
                            </p>
                        )}
                    </div>

                </div>

                <div className="flex flex-wrap gap-4 mt-10">

                    {isEditing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setFormData({
                                        name: theatre.name,
                                        city: theatre.city,
                                        address: theatre.address,
                                    });

                                    setIsEditing(false);
                                }}
                                className="bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg"
                            >
                                Edit Theatre
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
                            >
                                Delete Theatre
                            </button>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/owner/theatres/${theatreId}/screens`
                                    )
                                }
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
                            >
                                Manage Screens
                            </button>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

export default TheatreDetails;