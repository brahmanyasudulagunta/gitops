import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>Platform Control Plane</h1>
        </div>
        <nav className="header-nav">
          {!isAdmin() ? (
            <>
              <NavLink to="/" end>Dashboard</NavLink>
              <NavLink to="/namespace">Namespace</NavLink>
              <NavLink to="/argocd">ArgoCD</NavLink>
            </>
          ) : (
            <NavLink to="/admin" className="admin-link">Admin Dashboard</NavLink>
          )}
          <div className="header-user">
            <span className="username">{user?.username}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
