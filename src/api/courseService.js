const COURSE_IMAGES = {
  "1": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "2": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "3": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
};

const WATCHED_STORAGE_KEY = "watched_lessons_data";

// Mock данные курсов
const mockCourses = [
  {
    id: "1",
    title: "Основы программирования",
    description: "Введение в программирование",
    image: COURSE_IMAGES["1"],
  },
  {
    id: "2",
    title: "Цифровой Маркетинг",
    description: "Основы digital маркетинга",
    image: COURSE_IMAGES["2"],
  },
  {
    id: "3",
    title: "Английский для Начинающих",
    description: "Базовый курс английского",
    image: COURSE_IMAGES["3"],
  },
];
const mockLessons = {
  "1": [
    {
      id: "1",
      title: "Введение в React",
      videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
      courseId: "1"
    },
    {
      id: "2",
      title: "JSX",
      videoUrl: "https://youtu.be/w7ejDZ8SWv8",
      courseId: "1"
    },
    {
      id: "3",
      title: "Компоненты",
      videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
      courseId: "1"
    }
  ],
  "2": [
    {
      id: "4",
      title: "Что такое маркетинг",
      videoUrl: "https://www.youtube.com/watch?v=8KaJRw-rfn8",
      courseId: "2"
    }
  ],
  "3": [
    {
      id: "5",
      title: "Алфавит",
      videoUrl: "https://www.youtube.com/watch?v=75p-N9YKqNo",
      courseId: "3"
    }
  ]
};


const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getWatchedData = () => {
  try {
    const data = localStorage.getItem(WATCHED_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Ошибка чтения просмотренных уроков:", error);
    return {};
  }
};

const setWatchedData = (data) => {
  try {
    localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Ошибка сохранения просмотренных уроков:", error);
  }
};

const enrichLesson = (lesson) => {
  const watchedData = getWatchedData();
  const watchedInfo = watchedData[lesson.id];

  return {
    ...lesson,
    watched: !!watchedInfo,
    watchedAt: watchedInfo ? watchedInfo.watchedAt : null,
  };
};

export const getCourses = async () => {
  await delay();

  return mockCourses.map((course) => {
    const lessons = (mockLessons[course.id] || []).map(enrichLesson);

    return {
      ...course,
      lessons,
    };
  });
};

export const getLessonsByCourse = async (courseId) => {
  await delay();
  return (mockLessons[courseId] || []).map(enrichLesson);
};

export const markLessonAsWatched = async (lessonId) => {
  await delay(100);

  const watchedData = getWatchedData();

  watchedData[lessonId] = {
    watchedAt: new Date().toISOString(),
  };

  setWatchedData(watchedData);
  return true;
};