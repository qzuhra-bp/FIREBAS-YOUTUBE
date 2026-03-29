import { useEffect } from "react";
import { getCourses } from "../api/courseService";

useEffect(() => {
  getCourses().then(data => console.log(data));
}, []);