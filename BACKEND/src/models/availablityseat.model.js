const mongoose = require("mongoose");

const showSeatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "held", "booked"],
      default: "available",
    },

    heldUntil: {
      type: Date,
      default: null,
    },

    heldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

showSeatSchema.index(
  {
    showId: 1,
    seatNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("ShowSeat", showSeatSchema);