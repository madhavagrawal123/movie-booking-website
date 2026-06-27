const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tmdbMovieId: {
      type: Number,
      required: true,
    },
    title: String,

    posterPath: String,

    backdropPath: String,

    voteAverage: Number,

    releaseDate: String
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate wishlist entries
wishlistSchema.index(
  {
    userId: 1,
    tmdbMovieId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);