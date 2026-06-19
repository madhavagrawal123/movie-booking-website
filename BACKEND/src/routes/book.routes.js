const express = require('express');
const bookController = require("../controllers/book.controllers");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");

// book APIs
// apiurl -> /api/book->...
router.get('/Allshows/:movieId', bookController.Allshows);
router.post('/holdSeats/:showId', auth, bookController.holdSeats);
router.post('/confirmBooking/:showId', auth, bookController.confirmBooking);
router.post('/cancelBooking/:bookingId', auth, bookController.cancelBooking);
router.post('/saveBooking/:showId', auth, bookController.saveBooking);
router.post('/wishlist/:tmdbMovieId', auth, bookController.wishlistcontroller);
router.post('/createReview/:tmdbMovieId', auth, bookController.createReview);
router.get('/getReview/:userId/:tmdbMovieId',  bookController.getReview);
router.put('/updateReview/:reviewId', auth, bookController.updateReview);
router.get('/getShowSeats/:showId', bookController.getShowSeats);

module.exports = router;