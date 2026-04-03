import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Регистрация
export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Обновляем профиль с именем
    await updateProfile(user, { displayName: name });
    
    // Сохраняем данные в Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      progress: 0,
      enrolledCourses: []
    });
    
    return { success: true, user };
  } catch (error) {
    let message = "";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Этот email уже зарегистрирован";
        break;
      case "auth/weak-password":
        message = "Пароль должен быть не менее 6 символов";
        break;
      case "auth/invalid-email":
        message = "Неверный формат email";
        break;
      default:
        message = "Ошибка регистрации. Попробуйте снова.";
    }
    return { success: false, error: message };
  }
};

// Вход
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = "";
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "Неверный email или пароль";
        break;
      default:
        message = "Ошибка входа. Попробуйте снова.";
    }
    return { success: false, error: message };
  }
};

// Выход
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};