import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import { getBookingHistory, cancelBooking } from "../services/bookingService";

import { toast } from "react-toastify";

function MyBookings() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        try {

            const response =
                await getBookingHistory();
            console.log(response.data.bookings);
            setBookings(response.data.bookings);
            console.log(bookings);

        } catch (error) {

            console.log(error);

        }

    };
    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        try {

            const response =
                await cancelBooking(bookingId);

            toast.success(response.data.message);

            fetchBookings();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel booking"
            );

        }
    };

    
    return (

        <div className="bg-zinc-950 min-h-screen text-white">

            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-8">

                <h1 className="text-4xl font-bold mb-8">
                    My Bookings
                </h1>

                {
                    bookings.length === 0 ?

                        (
                            <div className="text-center text-zinc-400">

                                No bookings found.

                            </div>
                        )

                        :

                        bookings.map((booking) => (

                            <div
                                key={booking._id}
                                className="
                                bg-zinc-900
                                rounded-xl
                                overflow-hidden
                                mb-8
                                flex
                                "
                            >

                                {booking.showId?.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${booking.showId.posterPath}`}

                                        alt={booking.showId?.movieTitle || "Movie"}
                                        className="w-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-40 bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm">
                                        No Image (ID: {booking.showId?.movieId || booking.movieId || "N/A"})
                                    </div>
                                )}

                                <div className="flex-1 p-6">

                                    <div className="flex justify-between">

                                        <div>

                                            <h2 className="text-2xl font-bold">

                                                {booking.showId?.movieTitle
                                                    ? booking.showId.movieTitle
                                                    : `Movie ID: ${booking.showId?.movieId || booking.movieId || "Unknown"}`}

                                            </h2>

                                            <p className="text-zinc-400 mt-2">

                                                📍 {booking.showId.theatreId.name}

                                            </p>

                                            <p>

                                                {booking.showId.theatreId.city}

                                            </p>

                                            <p className="mt-2">

                                                📅 {booking.showId.showDate.slice(0, 10)}

                                            </p>

                                            <p>

                                                🕒 {booking.showId.showTime}

                                            </p>

                                            <p>

                                                🎟 Seats :

                                                {" "}

                                                {booking.seats.join(", ")}

                                            </p>

                                            <p>

                                                Screen :

                                                {" "}

                                                {booking.showId.screenId.screenName}

                                            </p>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-green-400 font-semibold">

                                                {booking.status.toUpperCase()}

                                            </p>

                                            <h2 className="text-3xl mt-4">

                                                ₹{booking.totalAmount}

                                            </h2>
                                            {
                                                booking.status === "confirmed" && (

                                                    <button
                                                        onClick={() =>
                                                            handleCancelBooking(booking._id)
                                                        }
                                                        className="
                mt-6
                bg-red-500
                hover:bg-red-600
                px-5
                py-2
                rounded-lg
                transition
                "
                                                    >
                                                        Cancel Booking
                                                    </button>

                                                )
                                            }

                                        </div>

                                    </div>

                                    <div
                                        className="
                                        border-t
                                        border-dashed
                                        border-zinc-600
                                        mt-6
                                        pt-4
                                        flex
                                        justify-between
                                        items-center
                                        "
                                    >

                                        <p className="text-zinc-400">

                                            Booking ID

                                        </p>

                                        <p>

                                            {booking._id}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))

                }

            </div>

        </div>

    );

}

export default MyBookings;