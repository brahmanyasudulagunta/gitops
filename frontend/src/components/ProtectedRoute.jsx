import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return children;
}
