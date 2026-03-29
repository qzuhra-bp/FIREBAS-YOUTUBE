import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser, getUserCourses } from "../api/mockAuthService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    
    // Загружаем курсы пользователя
    loadUserCourses(currentUser.id);
  }, [navigate]);

  const loadUserCourses = async (userId) => {
    const result = await getUserCourses(userId);
    if (result.success) {
      setCourses(result.courses);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className="dashboard-container">
      <h1>Добро пожаловать, {user.name}!</h1>
      <div className="stats">
        <div className="progress-circle">
          <div className="progress-value">{user.progress}%</div>
          <div>Завершено</div>
        </div>
      </div>
      
      <div className="courses-list">
        <h2>Ваши курсы</h2>
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <span>{course.progress}%</span>
          </div>
        ))}
      </div>
      
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Dashboard;