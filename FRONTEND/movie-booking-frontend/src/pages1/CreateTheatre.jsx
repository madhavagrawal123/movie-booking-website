import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTheatre } from "../services1/theatreService";
import { toast } from "react-toastify";

function CreateTheatre() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        city: "",
        address: ""
    });

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await createTheatre(formData);
             toast.success("Theatre created successfully!");

            navigate("/owner/theatres");

        } catch (error) {
            toast.error("Failed to create theatre.");
            console.log(error);

        }

    }

    return (

        <div className="max-w-2xl mx-auto">

            <h1 className="text-3xl font-bold text-white mb-8">
                Create Theatre
            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-xl border border-red-700 space-y-6"
            >

                <div>

                    <label className="text-gray-300 block mb-2">
                        Theatre Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
                    />

                </div>

                <div>

                    <label className="text-gray-300 block mb-2">
                        City
                    </label>

                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
                    />

                </div>

                <div>

                    <label className="text-gray-300 block mb-2">
                        Address
                    </label>

                    <textarea
                        rows="4"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white"
                    />

                </div>

                <button
                    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"
                >
                    Create Theatre
                </button>

            </form>

        </div>

    );

}

export default CreateTheatre;