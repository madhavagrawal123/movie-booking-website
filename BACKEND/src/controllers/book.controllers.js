const threatremodel = require("../models/theatre.model");
const showmodel = require("../models/show.model");
const mongoose = require("mongoose");
const ShowSeat = require("../models/availablityseat.model");
const bookingmodel = require("../models/booking.model");
const Wishlist = require("../models/wishlist.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const showModel = require("../models/show.model");
const { getIO } = require("../socket/socket");



async function Allshows(req, res) {
  try {
    const { movieId } = req.params;
    const { city, date } = req.body;
    const searchDate = new Date(date);
    const availableTheatres = await threatremodel.find({ city });
    if (availableTheatres.length === 0) {
      return res.status(404).json({ message: "No theatres found in the specified city." });
    }

    const theatreIds = availableTheatres.map(theatre => theatre._id);

    const shows = await showmodel.find({
      theatreId: { $in: theatreIds },
      tmdbMovieId: movieId,
      showDate: searchDate
    }).populate('theatreId');


    const grouped = {};
    for (const show of shows) {
      const theatreId = show.theatreId._id.toString();

      if (!grouped[theatreId]) {
        grouped[theatreId] = {
          theatreName: show.theatreId.name,

          timings: []
        };
      }


      grouped[theatreId].timings.push({
        showId: show._id,
        time: show.showTime
      });
    }
    const result = Object.values(grouped);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all shows:", error.message);
    res.status(500).json({
      error: error.message
    });
  }
};

async function holdSeats(req, res) {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.id;
    const { showId } = req.params;
    const { seatNumbers } = req.body;

    if (!seatNumbers || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No seats selected"
      });
    }

    session.startTransaction();

    
    const showExists = await showmodel.exists({ _id: showId }).session(session);

    if (!showExists) {
      throw new Error("Show does not exist");
    }

    
    const totalSeats = await ShowSeat.countDocuments({
      showId,
      seatNumber: { $in: seatNumbers }
    }).session(session);

    if (totalSeats !== seatNumbers.length) {
      throw new Error("One or more selected seats do not exist");
    }

    const holdExpiry = new Date(Date.now() + 5 * 60 * 1000);

    
    const result = await ShowSeat.updateMany(
      {
        showId,
        seatNumber: { $in: seatNumbers },
        status: "available"
      },
      {
        $set: {
          status: "held",
          heldBy: userId,
          heldUntil: holdExpiry
        }
      },
      { session }
    );

    
    if (result.modifiedCount !== seatNumbers.length) {
      throw new Error("One or more seats are no longer available");
    }

    await session.commitTransaction();
    const io = getIO();
    io.to(showId).emit("seatsHeld", {
      showId,
      seats: seatNumbers,
    });

    return res.status(200).json({
      success: true,
      message: "Seats held successfully",
      expiresAt: holdExpiry
    });

  } catch (error) {
    await session.abortTransaction();

    return res.status(400).json({
      success: false,
      message: error.message
    });

  } finally {
    session.endSession();
  }
}


async function confirmBooking(req, res) {
  const session = await mongoose.startSession();

  try {

    const userId = req.user.id;
    const { showId } = req.params;
    const { seatNumbers, totalAmount } = req.body;

    session.startTransaction();

    const seats = await ShowSeat.find({
      showId,
      seatNumber: { $in: seatNumbers }
    }).session(session);

    if (seats.length !== seatNumbers.length) {
      throw new Error("Some seats do not exist");
    }

    const invalidSeat = seats.find(
      seat =>
        seat.status !== "held"
      // || seat.heldBy?.toString() !== userId.toString()
    );

    if (invalidSeat) {
      throw new Error(
        `Seat ${invalidSeat.seatNumber} cannot be booked`
      );
    }

    const updateResult = await ShowSeat.updateMany(
      {
        showId,
        seatNumber: { $in: seatNumbers }
      },
      {
        $set: {
          status: "booked"
        },
        $unset: {
          heldUntil: "",
          heldBy: ""
        }
      },
      { session }
    );

    if (updateResult.modifiedCount !== seatNumbers.length) {
      throw new Error("Failed to book all seats");
    }

    const booking = await bookingmodel.create(
      [{
        userId,
        showId,
        seats: seatNumbers,
        totalAmount,
        status: "confirmed"
      }],
      { session }
    );

    await session.commitTransaction();

    const io = getIO();

    io.to(showId).emit("bookingConfirmed", {
      showId,
      seats: seatNumbers,
    });
    res.status(200).json({
      success: true,
      message: "Booking confirmed",
      booking: booking[0]
    });

  } catch (error) {

      console.error(error);   

  if (session.inTransaction()) {
    await session.abortTransaction();
  }

    res.status(400).json({
      success: false,
      message: error.message
    });

  } finally {

    session.endSession();

  }
}

async function releaseSeats(req, res) {
    try {
      console.log("releaseSeats called");
        const userId = req.user.id;
        const { showId } = req.params;
        const { seatNumbers } = req.body;

        await ShowSeat.updateMany(
            {
                showId,
                seatNumber: { $in: seatNumbers },
                status: "held",
                heldBy: userId,
            },
            {
                $set: {
                    status: "available",
                    heldBy: null,
                    holdExpiresAt: null,
                },
            }
        );
        const io = getIO();
 console.log("Emitting seatsReleased");
io.to(showId).emit("seatsReleased", {
    showId,
    seats: seatNumbers,
});

        return res.json({
            success: true,
            message: "Seats released",
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

async function releaseExpiredSeats(showId) {
  console.log("Releasing expired seats for showId:", showId);
  
  const result = await ShowSeat.updateMany(
        {
            showId,
            status: "held",
            heldUntil: {
                $lt: new Date(),
            },
        },
        {
            $set: {
                status: "available",
                heldBy: null,
                holdExpiresAt: null,
            },
        }
    );
    
}

async function getShowSeats(req, res) {
  try {
    const { showId } = req.params;
    await releaseExpiredSeats(showId);
    const seats = await ShowSeat.find({ showId });
    res.status(200).json(seats);
  } catch (error) {
    console.error("Error fetching show seats:", error);
    res.status(500).json({
      error: error.message
    });


  }
}
async function saveBooking(req, res) {


  const userId = req.user.id;



  const { showId } = req.params;
  const { seatNumbers, totalAmount } = req.body;
  console.log("req.user =", req.user);
  console.log("userId =", userId);

  try {
    const currBooking = await bookingmodel.create({
      userId,
      showId,
      seats: seatNumbers,
      totalAmount,
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Booking saved successfully",
      booking: currBooking,
    });

  } catch (error) {
    console.error("Error saving booking:", error);

    res.status(500).json({
      error: error.message,
    });
  }
}

async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const booking = await bookingmodel.findById(bookingId);
    const showId = booking.showId;
    const seatNumbers = booking.seats;

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }
    const show = await showmodel.findById(booking.showId);
    

    const showDateTime = new Date(
      `${show.date}T${show.time}`
    );

    if (showDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Show already started"
      });
    }


    await ShowSeat.updateMany(
      {
        showId: booking.showId,
        seatNumber: { $in: booking.seats },
      },
      {
        $set: {
          status: "available",
        },
        $unset: {
          heldBy: "",
          heldUntil: "",
        },
      }
    );

    booking.status = "cancelled";
    await booking.save();
         const io = getIO();
console.log("Emitting seatsReleased event for showId:", showId, "seats:", seatNumbers);
io.to(showId.toString()).emit("seatsReleased", {
    showId,
    seats: seatNumbers,
});

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    console.error("Error cancelling booking:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getBookingHistory(req, res) {
  try {

    const userId = req.user.id;

    const bookings = await bookingmodel
      .find({ userId })
      .populate({
        path: "showId",
        select:
          "tmdbMovieId movieTitle posterPath backdropPath showDate showTime theatreId screenId",
        populate: [
          {
            path: "theatreId",
            select: "name city address"
          },
          {
            path: "screenId",
            select: "screenName"
          }
        ]
      })
      .sort({ createdAt: -1 });
      
const validBookings = bookings.filter(
  booking => booking.showId !== null
);

res.json({
  success: true,
  bookings: validBookings
});


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

async function wishlistcontroller(req, res) {
  const userId = req.user.id;
  const { tmdbMovieId } = req.params;
  const {
    title,
    posterPath,
    backdropPath,
    voteAverage,
    releaseDate
  } = req.body;
  try {
    const existingEntry = await Wishlist.findOne({ userId, tmdbMovieId });
    if (existingEntry) {
      await Wishlist.deleteOne({ userId, tmdbMovieId });

      return res.status(200).json({
        success: true,
        message: "Movie removed from wishlist",
      });
    }
    const newEntry = await Wishlist.create({
      userId,
      tmdbMovieId,
      title,
      posterPath,
      backdropPath,
      voteAverage,
      releaseDate
    });
    res.status(201).json({
      success: true,
      message: "Movie added to wishlist",
      wishlistItem: newEntry,
    });

  }
  catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

async function getWishlist(req, res) {
  try {

    const userId = req.user.id;

    const wishlist = await Wishlist.find({ userId });

    res.status(200).json({
      success: true,
      wishlist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

async function checkWishlist(req, res) {

  try {

    const userId = req.user.id;

    const { tmdbMovieId } = req.params;

    const exists = await Wishlist.findOne({
      userId,
      tmdbMovieId
    });

    res.status(200).json({
      success: true,
      exists: !!exists
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

}

async function createReview(req, res) {
  const { userId } = req.user;
  const { tmdbMovieId } = req.params;
  const { rating, comment } = req.body;

  try {

    const existingReview = await Review.findOne({
      userId,
      tmdbMovieId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review already exists",
      });
    }

    const review = await Review.create({
      userId,
      tmdbMovieId,
      rating,
      comment,
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function getReview(req, res) {

  const { userId, tmdbMovieId } = req.params;

  try {
    const review = await Review.findOne({
      userId,
      tmdbMovieId
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    res.status(200).json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
async function updateReview(req, res) {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(reviewId);

  review.rating = rating;
  review.comment = comment;

  await review.save();
}

module.exports = {
  Allshows,
  holdSeats,
  confirmBooking,
  saveBooking,
  cancelBooking,
  wishlistcontroller,
  createReview,
  getReview,
  updateReview,
  getShowSeats,
  getBookingHistory,
  getWishlist,
  checkWishlist,
  releaseSeats
};