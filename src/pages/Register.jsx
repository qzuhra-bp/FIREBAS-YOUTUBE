import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../api/mockAuthService"; тут firebase нету
import { registerUser } from "../api/authService";
import styles from "./Register.module.css";

const Register = ({ setUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError("Пожалуйста, примите условия использования");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    const result = await registerUser(
      formData.name,
      formData.email,
      formData.password
    );

    if (result.success) {
      setUser(result.user);
      navigate("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <header className={styles.topbar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>📘</span>
            <span className={styles.logoText}>EduLearn</span>
          </div>

          <div className={styles.topActions}>
            <Link to="/login" className={styles.loginTopLink}>
              Войти в аккаунт
            </Link>
            <button className={styles.topRegisterButton}>Регистрация</button>
          </div>
        </header>

        <div className={styles.hero}>
          <div className={styles.overlay}></div>

          <div className={styles.leftContent}>
            <h1 className={styles.title}>Начните обучение онлайн</h1>
            <p className={styles.subtitle}>
              Изучайте курсы в любое время
              <br />
              и в любом месте
            </p>

            <div className={styles.features}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📚</span>
                <span>Более 100+ курсов</span>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>📊</span>
                <span>Прогресс обучения</span>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>🎯</span>
                <span>Квалифицированные инструкторы</span>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Регистрация</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />

              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.input}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={styles.input}
              />

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>Я принимаю условия использования</span>
              </label>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>

            <p className={styles.footerText}>
              Уже есть аккаунт?{" "}
              <Link to="/login" className={styles.loginLink}>
                Войти в аккаунт
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;