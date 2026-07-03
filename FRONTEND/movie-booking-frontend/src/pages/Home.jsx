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

  const [popularLoading, setPopularLoading] = useState(true);
const [topRatedLoading, setTopRatedLoading] = useState(true);
const [upcomingLoading, setUpcomingLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);


  const fetchMovies = async () => {
  // Popular
  getPopularMovies()
    .then((res) => {
      setPopular(res.data.results);
    })
    .catch(console.log)
    .finally(() => {
      setPopularLoading(false);
    });

  // Top Rated
  getTopRatedMovies()
    .then((res) => {
      setTopRated(res.data.results);
    })
    .catch(console.log)
    .finally(() => {
      setTopRatedLoading(false);
    });

  // Upcoming
  getUpcomingMovies()
    .then((res) => {
      setUpcoming(res.data.results);
    })
    .catch(console.log)
    .finally(() => {
      setUpcomingLoading(false);
    });
};
  // const fetchMovies = async () => {
  //   try {
  //     const [popularRes, topRatedRes, upcomingRes] =
  //       await Promise.all([
  //         getPopularMovies(),
  //         getTopRatedMovies(),
  //         getUpcomingMovies(),
  //       ]);

  //     setPopular(popularRes.data.results);
  //     setTopRated(topRatedRes.data.results);
  //     setUpcoming(upcomingRes.data.results);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="bg-black min-h-screen px-6 py-8">
         <Navbar />

   {popular.length > 0 && (
  <HeroBanner movie={popular[0]} />
)}
      <MovieSection
  title="Popular Movies"
  movies={popular}
  loading={popularLoading}
/>

<MovieSection
  title="Top Rated Movies"
  movies={topRated}
  loading={topRatedLoading}
/>

<MovieSection
  title="Upcoming Movies"
  movies={upcoming}
  loading={upcomingLoading}
/>
    </div>
  );
}

export default Home;