import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  getShowSeats,
  holdSeats,
  confirmBooking,
} from "../services/bookingService";
import axios from "axios";
import { releaseSeats } from "../services/bookingService";
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

  useEffect(() => {
    const joinRoom = () => {
      console.log("Connected:", socket.id);

      socket.emit("joinShow", showId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("bookingConfirmed", ({ showId: updatedShowId, seats: bookedSeats }) => {

      if (updatedShowId !== showId) return;

      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          bookedSeats.includes(seat.seatNumber)
            ? { ...seat, status: "booked" }
            : seat
        )
      );


      setSelectedSeats((prevSelected) =>
        prevSelected.filter(
          (seatNumber) => !bookedSeats.includes(seatNumber)
        )
      );
    });

    socket.on("seatsHeld", ({ showId: updatedShowId, seats: heldSeats }) => {

      if (updatedShowId !== showId) return;

      setSeats(prev =>
        prev.map(seat =>
          heldSeats.includes(seat.seatNumber)
            ? { ...seat, status: "held" }
            : seat
        )
      );
    });

    socket.on("seatsReleased", ({ showId: updatedShowId, seats: releasedSeats }) => {
      console.log("Received seatsReleased", updatedShowId, releasedSeats);
      if (updatedShowId !== showId) return;
       
      setSeats(prev =>
        prev.map(seat =>
          releasedSeats.includes(seat.seatNumber)
            ? { ...seat, status: "available" }
            : seat
        )
      );
    });

    return () => {
      socket.off("connect", joinRoom);
      socket.off("disconnect");
      socket.off("bookingConfirmed");
      socket.off("seatsHeld");
      socket.off("seatsReleased");
    };
  }, [showId]);

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

  const handleBooking = async () => {
    try {
      // Hold the selected seats
      await holdSeats(showId, selectedSeats);

      const totalAmount = selectedSeats.length * seatPrice;

      // Create Razorpay order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          showId,
          seatNumbers: selectedSeats,
        },
        {
          withCredentials: true,
        }
      );

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Movie Booking",
        description: "Seat Booking",

        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              }
            );

            if (!verifyRes.data.success) {
              await releaseSeats(
                showId,
                selectedSeats
              );

              toast.error("Payment Verification Failed");
              return;
            }

            // Payment verified, now confirm booking
            await confirmBooking(
              showId,
              selectedSeats,
              totalAmount
            );

            toast.success("Booking Successful");

            navigate("/my-bookings");
          } catch (error) {
            console.error(error);
            await releaseSeats(
              showId,
              selectedSeats
            );
            toast.error(
              error.response?.data?.message ||
              "Payment Verification Failed"
            );
          }
        },

        modal: {
          ondismiss: async () => {
            try {
              await releaseSeats(
                showId,
                selectedSeats
              );

              toast.info("Payment Cancelled");

            } catch (err) {
              console.error(err);
            }
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
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
        <h1 className="text-4xl font-bold text-center mb-12">
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

                      ${seat.status === "booked"
                        ? "bg-red-500 cursor-not-allowed"
                        : seat.status === "held"
                          ? "bg-yellow-500 cursor-not-allowed"
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