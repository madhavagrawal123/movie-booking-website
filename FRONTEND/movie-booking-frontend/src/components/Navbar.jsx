import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";


function Navbar() {
     const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();

      logout();

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                <div className="flex items-center gap-4">
            <Link
                to="/"
                className="text-red-500 text-2xl font-bold"
            >
                Showly
            </Link>

            <Link
                to="/owner"
                className="bg-red-500 px-4 py-2 rounded"
            >
                Manage Theatres
            </Link>
        </div>
                <span className="text-white">
                    {user?.name}
                </span>
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-white hover:text-red-500"
                    >
                        Home
                    </Link>

                    

                    {!user ? (
                        <Link
                            to="/login"
                            className="bg-red-500 px-4 py-2 rounded"
                        >
                            Login
                        </Link>
                    ) : (<>
                     <Link
                        to="/wishlist"
                        className="text-white hover:text-red-500"
                    >
                        Wishlist
                    </Link>
                    <Link
    to="/my-bookings"
    className="text-white hover:text-red-500"
>
    My Bookings
</Link>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </>
                        
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;