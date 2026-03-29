import React, { useEffect, useState } from "react";
import { getLessonsByCourse } from "../api/courseService";

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
    <div style={{ display: "flex", gap: "20px" }}>
      
      {/* Видео плеер */}
      <div style={{ flex: 2 }}>
        {activeLesson && (
          <>
            <h2>{activeLesson.title}</h2>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.videoUrl)}`}
              title={activeLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </>
        )}
      </div>

      {/* Сабактардын тизмеси */}
      <div style={{ flex: 1 }}>
        <h3>Уроки курса</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              style={{
                padding: "10px",
                marginBottom: "8px",
                cursor: "pointer",
                borderRadius: "8px",
                background: activeLesson?.id === lesson.id ? "#667eea" : "#f0f0f0",
                color: activeLesson?.id === lesson.id ? "white" : "black",
                fontWeight: activeLesson?.id === lesson.id ? "bold" : "normal"
              }}
            >
              {index + 1}. {lesson.title}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}