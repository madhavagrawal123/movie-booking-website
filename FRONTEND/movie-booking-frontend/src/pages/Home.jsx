import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieSection from "../components/MovieSection";

import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../services/movieService";

function Home() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [popularRes, topRatedRes, upcomingRes] =
        await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);

      setPopular(popularRes.data.results);
      setTopRated(topRatedRes.data.results);
      setUpcoming(upcomingRes.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black min-h-screen px-6 py-8">
         <Navbar />

    <HeroBanner movie={popular[0]} />
      <MovieSection
        title="Popular Movies"
        movies={popular}
      />

      <MovieSection
        title="Top Rated Movies"
        movies={topRated}
      />

      <MovieSection
        title="Upcoming Movies"
        movies={upcoming}
      />
    </div>
  );
}

export default Home;