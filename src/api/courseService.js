// Mock данные курсов
const mockCourses = [
  {
    id: "1",
    title: "Основы программирования",
    description: "Введение в программирование",
    image: "",
    lessons: []
  },
  {
    id: "2", 
    title: "Цифровой Маркетинг",
    description: "Основы digital маркетинга",
    image: "",
    lessons: []
  },
  {
    id: "3",
    title: "Английский для Начинающих",
    description: "Базовый курс английского",
    image: "",
    lessons: []
  }
];

const mockLessons = {
  "1": [
    { id: "1", title: "Введение в React", videoUrl: "https://www.youtube.com/watch?v=example1", courseId: "1" },
    { id: "2", title: "JSX", videoUrl: "https://www.youtube.com/watch?v=example2", courseId: "1" },
    { id: "3", title: "Компоненты", videoUrl: "https://www.youtube.com/watch?v=example3", courseId: "1" }
  ],
  "2": [
    { id: "4", title: "Что такое маркетинг", videoUrl: "https://www.youtube.com/watch?v=example4", courseId: "2" }
  ],
  "3": [
    { id: "5", title: "Алфавит", videoUrl: "https://www.youtube.com/watch?v=example5", courseId: "3" }
  ]
};

// Все курсы
export const getCourses = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCourses;
};

// Уроки по курсу
export const getLessonsByCourse = async (courseId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLessons[courseId] || [];
};