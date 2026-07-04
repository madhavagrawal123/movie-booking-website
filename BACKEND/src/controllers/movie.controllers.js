const axios = require("axios");
const axiosRetry = require("axios-retry").default;

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
        error.code === "ECONNRESET"
});

async function getPopularMovies(req, res) {
    console.log("backend-hitting")
   
    try {
        
        
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/popular",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                },
                 timeout: 10000
            }
        );
        res.status(200).json(response.data);
    } catch (error) {

    console.log("STATUS:",
        error.response?.status);

    console.log("DATA:",
        error.response?.data);

    console.log("MESSAGE:",
        error.message);
    console.log("code",error.code);
    res.status(500).json({
        error: error.message
    });
}
}
async function getTopRatedMovies(req, res) {
    try {   
        
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/top_rated",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }, 
                 timeout: 10000
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching top rated movies:", error.message);
        console.log(error.response?.status);
console.log(error.response?.data);
        res.status(500).json({
            error: error.message
        });
    }
}
async function getUpcomingMovies(req, res) {
    try {   
        const response = await axios.get(     
        "https://api.themoviedb.org/3/movie/upcoming",
        {
            params: {
                api_key: process.env.TMDB_API_KEY
            },
             timeout: 10000
        }
    );
    res.status(200).json(response.data);
} catch (error) {
    console.error("Error fetching upcoming movies:", error.message);
    console.log("error-code",error.code);
    res.status(500).json({
        error: error.message
    });
}
}
async function getMovieDetails(req, res) {
    const movieId = req.params.id;
    try {
        const response = await axios.get(           
            `https://api.themoviedb.org/3/movie/${movieId}`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                },
                 timeout: 10000
            }
        );
        res.status(200).json(response.data);
    } catch (error) {console.log("MESSAGE:", error.message);
console.log("CODE:", error.code);

if (error.response) {
    console.log("STATUS:", error.response.status);
    console.log("DATA:", error.response.data);
}
    }
}
async function searchMovies(req, res) {
    try {
        const { query } = req.query;

        const response = await axios.get(
            "https://api.themoviedb.org/3/search/movie",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    query,
                },
            }
        );

        res.json(response.data.results);
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.error("Error searching movies:", err.message);
    }
}
module.exports = {
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getMovieDetails,
    searchMovies
}