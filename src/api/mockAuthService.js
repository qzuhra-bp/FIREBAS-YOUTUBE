// MOCK AUTH SERVICE - для разработки без Firebase
// Данные сохраняются в localStorage браузера

// Ключи для localStorage
const STORAGE_KEYS = {
  USERS: 'mock_users',
  CURRENT_USER: 'mock_current_user',
  SESSION: 'mock_session'
};

// Инициализация хранилища
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Создаем тестового пользователя для демонстрации
    const testUser = {
      id: 'test123',
      name: 'Алексей',
      email: 'test@example.com',
      password: '123456',
      createdAt: new Date().toISOString(),
      progress: 75,
      enrolledCourses: [
        { id: 1, title: 'Основы программирования', progress: 45 },
        { id: 2, title: 'Цифровой Маркетинг', progress: 60 },
        { id: 3, title: 'Английский для Начальников', progress: 25 }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([testUser]));
  }
};

// Получить всех пользователей
const getUsers = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

// Сохранить пользователей
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Регистрация
export const registerUser = async (name, email, password) => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  
  // Проверка на существующего пользователя
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return { 
      success: false, 
      error: "Этот email уже зарегистрирован" 
    };
  }
  
  // Создание нового пользователя
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // В реальном приложении пароль хешируется!
    createdAt: new Date().toISOString(),
    progress: 0,
    enrolledCourses: []
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Сохраняем сессию
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  localStorage.setItem(STORAGE_KEYS.SESSION, 'active');
  
  return { 
    success: true, 
    user: userWithoutPassword 
  };
};

// Вход
export const loginUser = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_KEYS.SESSION, 'active');
    return { success: true, user: userWithoutPassword };
  }
  
  return { 
    success: false, 
    error: "Неверный email или пароль" 
  };
};

// Выход
export const logoutUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  return { success: true };
};

// Получить текущего пользователя
export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Проверить авторизацию
export const isAuthenticated = () => {
  return localStorage.getItem(STORAGE_KEYS.SESSION) === 'active' && getCurrentUser() !== null;
};

// Обновить прогресс пользователя
export const updateUserProgress = async (userId, courseId, progress) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    // Обновляем прогресс курса
    const courseIndex = users[userIndex].enrolledCourses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      users[userIndex].enrolledCourses[courseIndex].progress = progress;
    }
    
    // Обновляем общий прогресс
    const totalProgress = users[userIndex].enrolledCourses.reduce((sum, c) => sum + c.progress, 0);
    users[userIndex].progress = Math.floor(totalProgress / users[userIndex].enrolledCourses.length);
    
    saveUsers(users);
    
    // Обновляем текущую сессию
    const { password: _, ...userWithoutPassword } = users[userIndex];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, error: "Пользователь не найден" };
};

// Записать пользователя на курс
export const enrollCourse = async (userId, course) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    // Проверяем, не записан ли уже
    const alreadyEnrolled = users[userIndex].enrolledCourses.some(c => c.id === course.id);
    
    if (!alreadyEnrolled) {
      users[userIndex].enrolledCourses.push({
        id: course.id,
        title: course.title,
        progress: 0
      });
      
      saveUsers(users);
      
      // Обновляем текущую сессию
      const { password: _, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: "Вы уже записаны на этот курс" };
  }
  
  return { success: false, error: "Пользователь не найден" };
};

// Получить все курсы пользователя
export const getUserCourses = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (user) {
    return { success: true, courses: user.enrolledCourses };
  }
  
  return { success: false, error: "Пользователь не найден", courses: [] };
};

// Сбросить все данные (для тестирования)
export const resetMockData = () => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  initStorage();
  return { success: true };
};

// Получить список всех пользователей (только для отладки)
export const getAllUsersDebug = () => {
  return getUsers().map(({ password, ...user }) => user);
};