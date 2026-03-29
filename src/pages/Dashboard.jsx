import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../api/mockAuthService";
import { getCourses } from "../api/courseService";
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
    loadCourses();
  }, [navigate]);

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
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
        {courses.length === 0 && <p>Курсы не найдены</p>}
        {courses.map(course => (
          <div 
            key={course.id} 
            className="course-card"
            onClick={() => navigate(`/course/${course.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
      
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Dashboard;