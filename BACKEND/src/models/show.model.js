const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    tmdbMovieId: {
      type: String,
      required: true,
    },

    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true,
    },

    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    showDate: {
      type: Date,
      required: true,
    },

    showTime: {
      type: String,
      required: true,
    },
     movieTitle: {
        type: String,
        required: true,
    },

    posterPath: {
        type: String,
        required: true,
    },

    backdropPath: {
        type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Show", showSchema);