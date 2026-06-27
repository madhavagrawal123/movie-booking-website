import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getShowSeats,
  holdSeats,
  confirmBooking,
} from "../services/bookingService";

function SeatSelectionPage() {
  const { showId } = useParams();
  console.log("showId:", showId);

  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);

  const [selectedSeats, setSelectedSeats] =
    useState([]);

  const seatPrice = 200;

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response =
        await getShowSeats(showId);

      setSeats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "available")
      return;

    const exists =
      selectedSeats.includes(
        seat.seatNumber
      );

    if (exists) {
      setSelectedSeats(
        selectedSeats.filter(
          (s) =>
            s !== seat.seatNumber
        )
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat.seatNumber,
      ]);
    }
  };

  const handleBooking =
    async () => {
      try {
        await holdSeats(
          showId,
          selectedSeats
        );

        const totalAmount =
          selectedSeats.length *
          seatPrice;

        await confirmBooking(
          showId,
          selectedSeats,
          totalAmount
        );

        alert(
          "Booking Successful"
        );

        navigate("/");
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Booking Failed"
        );
      }
    };

  const groupedSeats = {};

  seats.forEach((seat) => {
    const row =
      seat.seatNumber[0];

    if (!groupedSeats[row]) {
      groupedSeats[row] = [];
    }

    groupedSeats[row].push(seat);
  });

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className= "text-4xl font-bold text-center mb-12">
          Select Seats
        </h1>

        <div className="flex justify-center mb-10">
          <div
            className="
            w-[600px]
            h-3
            bg-white
            rounded-full
            "
          />
        </div>

        <p className="text-center mb-10 text-zinc-400">
          SCREEN
        </p>

        <div className="flex flex-col gap-4 items-center">
          {Object.keys(
            groupedSeats
          ).map((row) => (
            <div
              key={row}
              className="flex gap-3"
            >
              <span className="w-6">
                {row}
              </span>

              {groupedSeats[
                row
              ].map((seat) => {
                const isSelected =
                  selectedSeats.includes(
                    seat.seatNumber
                  );

                return (
                  <button
                    key={
                      seat.seatNumber
                    }
                    onClick={() =>
                      toggleSeat(
                        seat
                      )
                    }
                    disabled={
                      seat.status !==
                      "available"
                    }
                    className={`
                      w-10
                      h-10
                      rounded

                      ${
                        seat.status ===
                        "booked"
                          ? "bg-red-500 cursor-not-allowed"
                          : isSelected
                          ? "bg-green-500"
                          : "border border-green-500"
                      }
                    `}
                  >
                    {seat.seatNumber.slice(
                      1
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-8 mt-12">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border border-green-500"></div>
            <span>
              Available
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500"></div>
            <span>
              Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <h2 className="text-2xl mb-4">
            Selected Seats:
          </h2>

          <p>
            {selectedSeats.join(
              ", "
            ) || "None"}
          </p>

          <p className="mt-4 text-xl">
            Total: ₹
            {selectedSeats.length *
              seatPrice}
          </p>

          <button
            disabled={
              selectedSeats.length ===
              0
            }
            onClick={
              handleBooking
            }
            className="
              mt-6
              bg-red-500
              px-8
              py-3
              rounded-lg
              disabled:bg-zinc-700
            "
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;