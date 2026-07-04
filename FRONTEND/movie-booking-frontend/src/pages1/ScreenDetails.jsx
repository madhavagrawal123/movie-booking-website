import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getScreenById,
    updateScreen,
    deleteScreen,
} from "../services1/screenService";

function ScreenDetails() {
    const { theatreId, screenId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [screen, setScreen] = useState(null);

    const [formData, setFormData] = useState({
        screenName: "",
        rows: "",
        seatsPerRow: "",
    });

    useEffect(() => {
        fetchScreen();
    }, []);

    async function fetchScreen() {
        try {
            const response = await getScreenById(theatreId, screenId);

            setScreen(response.data.screen);

            setFormData({
                screenName: response.data.screen.screenName,
                rows: response.data.screen.rows,
                seatsPerRow: response.data.screen.seatsPerRow,
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
            const response = await updateScreen(
                theatreId,
                screenId,
                formData
            );

            setScreen(response.data.screen);

            setIsEditing(false);

            toast.success("Screen updated successfully.");
        } catch (error) {
            console.log(error);
            toast.error("Unable to update screen.");
        }
    }

    async function handleDelete() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this screen?"
        );

        if (!confirmDelete) return;

        try {
            await deleteScreen(theatreId, screenId);

            toast.success("Screen deleted successfully.");

            navigate(-1);
        } catch (error) {
            console.log(error);
            toast.error("Unable to delete screen.");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!screen) {
        return (
            <div className="text-red-500 text-xl">
                Screen not found.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto text-white">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
            >
                ← Back
            </button>

            <div className="bg-zinc-900 border border-red-700 rounded-xl p-8">

                <h1 className="text-3xl font-bold text-red-500 mb-8">
                    Screen Details
                </h1>

                <div className="space-y-6">

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Screen Name
                        </label>

                        {isEditing ? (
                            <input
                                type="text"
                                name="screenName"
                                value={formData.screenName}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {screen.screenName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Rows
                        </label>

                        {isEditing ? (
                            <input
                                type="number"
                                name="rows"
                                value={formData.rows}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {screen.rows}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Seats Per Row
                        </label>

                        {isEditing ? (
                            <input
                                type="number"
                                name="seatsPerRow"
                                value={formData.seatsPerRow}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />
                        ) : (
                            <p className="text-xl">
                                {screen.seatsPerRow}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-400">
                            Total Seats
                        </label>

                        <p className="text-xl">
                            {screen.rows * screen.seatsPerRow}
                        </p>
                    </div>

                    <div>
                        <label className="block mb-4 text-gray-400">
                            Seat Layout
                        </label>

                        <div className="grid grid-cols-6 gap-3">
                            {screen.seats.map((seat) => (
                                <div
                                    key={seat._id}
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-center"
                                >
                                    <p>{seat.seatNumber}</p>

                                    <p className="text-xs text-gray-400">
                                        {seat.type}
                                    </p>
                                </div>
                            ))}
                        </div>
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
                                        screenName: screen.screenName,
                                        rows: screen.rows,
                                        seatsPerRow: screen.seatsPerRow,
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
                                Edit Screen
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
                            >
                                Delete Screen
                            </button>
                            <button
                                onClick={() =>
                                    navigate(`/owner/theatres/${theatreId}/screens/${screenId}/shows`)
                                }
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
                            >
                                Manage Shows
                            </button>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
}

export default ScreenDetails;