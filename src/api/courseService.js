import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// все курсы
export const getCourses = async () => {
  const snapshot = await getDocs(collection(db, "courses"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// уроки по курсу
export const getLessonsByCourse = async (courseId) => {
  const q = query(
    collection(db, "lessons"),
    where("courseId", "==", courseId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};