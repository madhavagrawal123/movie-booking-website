const express = require('express');
const bookController = require("../controllers/book.controllers");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");

// book APIs
// apiurl -> /api/book->...
router.post('/Allshows/:movieId', bookController.Allshows);
router.post('/holdSeats/:showId', auth, bookController.holdSeats);
router.post('/confirmBooking/:showId', auth, bookController.confirmBooking);
router.post('/cancelBooking/:bookingId', auth, bookController.cancelBooking);
router.post('/saveBooking/:showId', auth, bookController.saveBooking);
router.get('/wishlist',bookController.getWishlist);
router.get('/wishlist/check/:tmdbMovieId',bookController.checkWishlist)
router.post('/wishlist/:tmdbMovieId', auth, bookController.wishlistcontroller);
router.get("/history",auth,bookController.getBookingHistory);
router.post('/createReview/:tmdbMovieId', auth, bookController.createReview);
router.get('/getReview/:userId/:tmdbMovieId',  bookController.getReview);
router.put('/updateReview/:reviewId', auth, bookController.updateReview);
router.get('/getShowSeats/:showId', bookController.getShowSeats);
router.post ('/release-seats/:showId', auth, bookController.releaseSeats );
module.exports = router;