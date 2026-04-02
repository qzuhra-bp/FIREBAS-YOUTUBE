import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonsByCourse } from "../api/courseService";
import VideoPlayer from "../components/VideoPlayer";
import LessonList from "../components/LessonList";

const LessonPage = () => {
  const params = useParams();
  const courseId = params.courseId || params.id;

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await getLessonsByCourse(courseId);
      setLessons(data);

      if (data.length > 0) {
        const selectedLesson = data.find((item) => item.id === currentLesson?.id);
        setCurrentLesson(selectedLesson || data[0]);
      } else {
        setCurrentLesson(null);
      }
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
      setLessons([]);
      setCurrentLesson(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadLessons();
    }
  }, [courseId]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <div>
          <VideoPlayer lesson={currentLesson} onWatched={loadLessons} />
        </div>

        <div>
          <LessonList
            lessons={lessons}
            currentLesson={currentLesson}
            onSelectLesson={setCurrentLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPage;