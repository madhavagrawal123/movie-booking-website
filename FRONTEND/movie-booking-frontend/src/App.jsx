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

function App() {
  return (
    <BrowserRouter>
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