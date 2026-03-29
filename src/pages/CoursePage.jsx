import { useParams, useNavigate } from "react-router-dom";
import LessonList from "../components/LessonList";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <button 
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        ← Назад
      </button>
      <LessonList courseId={id} />
    </div>
  );
};

export default CoursePage;