import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createScreen } from "../services1/screenService";
import { toast } from "react-toastify";

function CreateScreen() {

    const { theatreId } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        screenName: "",
        rows: "",
        seatsPerRow: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (
            !formData.screenName ||
            !formData.rows ||
            !formData.seatsPerRow
        ) {

            toast.error("Please fill all fields");

            return;
        }

        try {

            setLoading(true);

            await createScreen(theatreId, {
                ...formData,
                rows: Number(formData.rows),
                seatsPerRow: Number(formData.seatsPerRow)
            });

            toast.success("Screen created successfully");

            navigate(`/owner/theatres/${theatreId}/screens`);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to create screen"
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="max-w-2xl mx-auto">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2 rounded-lg"
            >
                ← Back
            </button>

            <div className="bg-zinc-900 border border-red-700 rounded-xl p-8">

                <h1 className="text-3xl font-bold text-red-500 mb-8">

                    Create Screen

                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div>

                        <label className="block text-gray-300 mb-2">

                            Screen Name

                        </label>

                        <input
                            type="text"
                            name="screenName"
                            value={formData.screenName}
                            onChange={handleChange}
                            placeholder="Screen 1"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                        />

                    </div>

                    <div>

                        <label className="block text-gray-300 mb-2">

                            Rows

                        </label>

                        <input
                            type="number"
                            name="rows"
                            value={formData.rows}
                            onChange={handleChange}
                            placeholder="10"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                        />

                    </div>

                    <div>

                        <label className="block text-gray-300 mb-2">

                            Seats Per Row

                        </label>

                        <input
                            type="number"
                            name="seatsPerRow"
                            value={formData.seatsPerRow}
                            onChange={handleChange}
                            placeholder="12"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "Creating..." : "Create Screen"}
                    </button>

                </form>

            </div>

        </div>

    );

}

export default CreateScreen;