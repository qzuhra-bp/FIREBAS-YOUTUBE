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
    },
    {
      id: "6",
      title: "Props и State",
      videoUrl: "https://www.youtube.com/watch?v=IYvD9oBCuJI",
      courseId: "1"
    },
    {
      id: "7",
      title: "useState",
      videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
      courseId: "1"
    },
    {
      id: "8",
      title: "useEffect",
      videoUrl: "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
      courseId: "1"
    }
  ],

  "2": [
    {
      id: "4",
      title: "Что такое маркетинг",
      videoUrl: "https://www.youtube.com/watch?v=8KaJRw-rfn8",
      courseId: "2"
    },
    {
      id: "9",
      title: "Основы digital marketing",
      videoUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4",
      courseId: "2"
    },
    {
      id: "10",
      title: "SMM и продвижение",
      videoUrl: "https://www.youtube.com/watch?v=QYpB8Yz6H8Q",
      courseId: "2"
    },
    {
      id: "11",
      title: "Контент маркетинг",
      videoUrl: "https://www.youtube.com/watch?v=7iYqQxJ1K9Q",
      courseId: "2"
    },
    {
      id: "12",
      title: "Таргетированная реклама",
      videoUrl: "https://www.youtube.com/watch?v=Vw8lG9AfN0A",
      courseId: "2"
    }
  ],

  "3": [
    {
      id: "5",
      title: "Алфавит",
      videoUrl: "https://www.youtube.com/watch?v=75p-N9YKqNo",
      courseId: "3"
    },
    {
      id: "13",
      title: "Приветствие на английском",
      videoUrl: "https://www.youtube.com/watch?v=tVlcKp3bWH8",
      courseId: "3"
    },
    {
      id: "14",
      title: "Числа и даты",
      videoUrl: "https://www.youtube.com/watch?v=Dz6aL9cA9lc",
      courseId: "3"
    },
    {
      id: "15",
      title: "Базовые слова",
      videoUrl: "https://www.youtube.com/watch?v=0Hk3o6gGx5Q",
      courseId: "3"
    },
    {
      id: "16",
      title: "Простые предложения",
      videoUrl: "https://www.youtube.com/watch?v=JuKd26qkNAw",
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