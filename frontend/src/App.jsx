import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DevPlatform from "./pages/DevPlatform";
import ArgoCD from "./pages/ArgoCD";
import AdminDashboard from "./pages/AdminDashboard";
import RequestDetail from "./pages/RequestDetail";
import { useAuth } from "./context/AuthContext";

function RootRedirect() {
  const { isAdmin } = useAuth();
  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <RootRedirect />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/namespace"
            element={
              <ProtectedRoute>
                <Layout><DevPlatform /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/argocd"
            element={
              <ProtectedRoute>
                <Layout><ArgoCD /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/requests/:id"
            element={
              <ProtectedRoute adminOnly>
                <Layout><RequestDetail /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
