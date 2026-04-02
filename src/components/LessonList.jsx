import React, { useEffect, useState } from "react";
import { getLessonsByCourse } from "../api/courseService";
import styles from "./LessonList.module.css";

const getYouTubeId = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : "";
};

export default function LessonList({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    async function fetchLessons() {
      const data = await getLessonsByCourse(courseId);
      setLessons(data);
      if (data.length > 0) setActiveLesson(data[0]);
    }
    fetchLessons();
  }, [courseId]);

  return (
    <div className={styles.lessonContainer}>
      
      <div className={styles.videoWrapper}>
        {activeLesson && (
          <>
            <h2>{activeLesson.title}</h2>
            <iframe
              className={styles.videoIframe}
              src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}`}
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </>
        )}
      </div>

      <div className={styles.lessonSide}>
        <h3>Уроки курса</h3>
        <ul className={styles.lessonList}>
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`${styles.lessonItem} ${activeLesson?.id === lesson.id ? styles.activeLesson : ""}`}
            >
              {index + 1}. {lesson.title}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}