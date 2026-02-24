import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({
                    id: payload.user_id,
                    username: payload.username,
                    role: payload.role,
                });
            } catch {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const isAdmin = () => user?.role === "admin";
    const isAuthenticated = () => !!token && !!user;

    return (
        <AuthContext.Provider
            value={{ token, user, loading, login, logout, isAdmin, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
