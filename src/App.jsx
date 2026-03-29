
// src/App.jsx
import React from "react";
import LessonList from "./components/LessonList.jsx";

export default function App() {
  const courseId = "JltHTHMBQYFkDQ7m0ZgU"; // тот же ID курса из Firestore
  return (
    <div>
      <h1>Мой курс</h1>
      <LessonList courseId={courseId} />
    </div>
  );
}

