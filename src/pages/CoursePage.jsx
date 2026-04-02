import { useParams, useNavigate } from "react-router-dom";
import LessonList from "../components/LessonList";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      <button 
        onClick={() => navigate("/dashboard")}
        className={styles.backButton}
      >
        ← Назад
      </button>
      <LessonList courseId={id} />
    </div>
  );
};

export default CoursePage;