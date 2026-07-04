import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login"
import Register from "./pages/Register"
import BookingPage from "./pages/BookingPage.jsx"
import ProtectedRoute from "./components/ProtectedRoute"
import SeatSelectionPage from "./pages/SeatSelectionPage.jsx"
import MyBookings from "./pages/MyBookings.jsx"
import WishlistPage from "./pages/WishlistPage.jsx"
import OwnerDashboard from "./pages1/OwnerDashboard";
import OwnerProtectedRoute from "./components1/OwnerProtectedRoute";
import OwnerLayout from "./components1/OwnerLayout";
import ThreatreList from "./pages1/TheatreList";
import CreateTheatre from "./pages1/CreateTheatre";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import TheatreDetails from "./pages1/TheatreDetails.jsx";
import ScreenList from "./pages1/ScreenList.jsx"
import CreateScreen from "./pages1/CreateScreen.jsx"
import ScreenDetails from "./pages1/ScreenDetails.jsx"
import ShowList from "./pages1/ShowLIst.jsx"
import MovieSearch from "./pages1/MovieSearch.jsx"
import CreateShow from "./pages1/CreateShow.jsx"
import ShowDetails from "./pages1/ShowDetails.jsx"

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
          hideProgressBar={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/booking/:movieId"
          element={ <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>}
        />
        <Route
  path="/my-bookings"
  element={
    <ProtectedRoute>
      <MyBookings />
    </ProtectedRoute>
  }
/>
        <Route
  path="/seats/:showId"
  element={  <ProtectedRoute>
  <SeatSelectionPage />
  </ProtectedRoute>
  }
/>
       <Route
    path="/owner"
    element={
        <OwnerProtectedRoute>
            <OwnerLayout />
        </OwnerProtectedRoute>
    }
>
    <Route index element={<OwnerDashboard />} />
    <Route path="theatres" element={<ThreatreList />} />
    <Route
    path="theatres/create"
    element={<CreateTheatre />}
/>

<Route
    path="theatres/:theatreId"
    element={<TheatreDetails />}
/>
<Route
    path="theatres/:theatreId/screens"
    element={<ScreenList />}
/>
<Route
    path="theatres/:theatreId/screens/create"
    element={<CreateScreen />}
/>
<Route
    path="screens/:theatreId/:screenId"
    element={<ScreenDetails />}
/>
<Route
    path="theatres/:theatreId/screens/:screenId/shows"
    element={<ShowList />}

/>
<Route 
    path="theatres/:theatreId/screens/:screenId/shows/search"
    element={<MovieSearch />}
/>
<Route
    path="theatres/:theatreId/screens/:screenId/shows/create"
    element={<CreateShow />}
/>
<Route
    path="shows/:showId"
    element={<ShowDetails />}
/>

</Route>


       {/* <Route path="/owner" element={<OwnerDashboard />} /> */}
<Route
    path="/wishlist"
    element={
        <ProtectedRoute>
            <WishlistPage />
        </ProtectedRoute>
    }
/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;