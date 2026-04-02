import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/mockAuthService";
import styles from "./Login.module.css";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      setUser(result.user);
      navigate("/dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>EduLearn</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <p className={styles.authSubtitle}>Войдите в свой аккаунт</p>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.authLabel}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.authInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.authLabel}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.authInput}
            />
          </div>

          {error && <div className={styles.authError}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.authButton}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Нет аккаунта?{" "}
            <Link to="/register" className={styles.authLink}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;