import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getShow,
    updateShow,
    deleteShow,
} from "../services1/showService";

function ShowDetails() {

    const { showId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [show, setShow] = useState(null);

    const [formData, setFormData] = useState({
        date: "",
        time: "",
    });

    useEffect(() => {
        fetchShow();
    }, []);

    async function fetchShow() {

        try {

            const response = await getShow(showId);

            setShow(response.data.show);

            setFormData({
                date: response.data.show.showDate.slice(0, 10),
                time: response.data.show.showTime,
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

            const response = await updateShow(
                showId,
                formData
            );

            setShow(response.data.show);

            setIsEditing(false);

            toast.success("Show updated successfully.");

        } catch (error) {

            console.log(error);

            toast.error("Unable to update show.");

        }

    }

    async function handleDelete() {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this show?"
        );

        if (!confirmDelete) return;

        try {

            await deleteShow(showId);

            toast.success("Show deleted successfully.");

            navigate(-1);

        } catch (error) {

            console.log(error);

            toast.error("Unable to delete show.");

        }

    }

    if (loading) {

        return (
            <div className="flex justify-center items-center h-[80vh]">
                <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    }

    if (!show) {

        return (
            <div className="text-red-500 text-xl">
                Show not found.
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

                <div className="flex gap-8 mb-8">

                    <img
                        src={`https://image.tmdb.org/t/p/w500${show.posterPath}`}
                        alt={show.movieTitle}
                        className="w-40 rounded-lg"
                    />

                    <div className="flex flex-col justify-center">

                        <h1 className="text-3xl font-bold text-red-500">

                            {show.movieTitle}

                        </h1>

                    </div>

                </div>

                <div className="space-y-6">

                    <div>

                        <label className="block mb-2 text-gray-400">

                            Show Date

                        </label>

                        {isEditing ? (

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />

                        ) : (

                            <p className="text-xl">
                                {formData.date}
                            </p>

                        )}

                    </div>

                    <div>

                        <label className="block mb-2 text-gray-400">

                            Show Time

                        </label>

                        {isEditing ? (

                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3"
                            />

                        ) : (

                            <p className="text-xl">
                                {show.showTime}
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
                                        date: show.showDate.slice(0, 10),
                                        time: show.showTime,
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
                                Edit Show
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg"
                            >
                                Delete Show
                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default ShowDetails;