import { useNavigate } from "react-router-dom";
import { logoutOwner } from "../services1/ownerAuthService";
import { useAuth } from "../context/AuthContext";

function OwnerNavbar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {

        try {

            await logoutOwner();

            logout();

            navigate("/login");

        } catch (error) {
            console.log(error);
        }

    };

    return (
    <div className="h-16 bg-zinc-900 border-b border-red-700 flex items-center px-8">
        <h2 className="text-white text-xl font-semibold">
            Theatre Owner Panel
        </h2>

        <div className="flex items-center gap-3 ml-auto">
            <button
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
            >
                Browse Movies
            </button>

            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
            >
                Logout
            </button>
        </div>
    </div>
);

}

export default OwnerNavbar;