import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../api/firebaseConfig.js";// 🔹 исправленный импорт

export default function LessonList({ courseId }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    async function fetchLessons() {
      const q = query(
        collection(db, "lessons"),
        where("courseId", "==", courseId),
        orderBy("order")
      );
      const querySnapshot = await getDocs(q);
      const lessonsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
      console.log("Lessons fetched:", lessonsData);
    }

    fetchLessons();
  }, [courseId]);

  return (
    <div>
      <h2>Уроки курса</h2>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <strong>{lesson.order}. {lesson.title}</strong> - 
            <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Смотреть видео</a>
          </li>
        ))}
      </ul>
    </div>
  );
}