import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../api";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CoursePage from "../pages/CoursePage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px",
        color: "#667eea"
      }}>
        Загрузка...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register setUser={setUser} />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute user={user}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/course/:id" 
        element={
          <ProtectedRoute user={user}>
            <CoursePage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRouter;