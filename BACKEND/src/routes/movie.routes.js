// i am using express router to create routes for movies and using tmdb api to get movies data so make me a route page similar to auth.routes
const express = require('express');
const movieController = require("../controllers/movie.controllers");
//correct the moviecontroller path if it is wrong


const router = express.Router();

// movie APIs

router.get('/popular', movieController.getPopularMovies);
router.get('/top-rated', movieController.getTopRatedMovies);
router.get('/upcoming', movieController.getUpcomingMovies);
router.get('/movie/:id', movieController.getMovieDetails);  

module.exports = router;
