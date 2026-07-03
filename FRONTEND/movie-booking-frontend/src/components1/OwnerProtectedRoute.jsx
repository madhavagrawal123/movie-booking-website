import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OwnerProtectedRoute({ children }) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "owner") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default OwnerProtectedRoute;