import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../api"; // Используем наш переключатель API
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CoursePage from "../pages/CoursePage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем есть ли пользователь в localStorage (для mock)
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    checkUser();
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
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    </BrowserRouter>
  );
};

export default AppRouter;