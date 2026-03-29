import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/mockAuthService";
import "./Auth.css";

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    if (!agreeTerms) { setError("Пожалуйста, примите условия использования"); return; }
    if (formData.password !== formData.confirmPassword) { setError("Пароли не совпадают"); return; }
    if (formData.password.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }
    
    setLoading(true);
    const result = await registerUser(formData.name, formData.email, formData.password);
    
    if (result.success) {
      setUser(result.user); // ← обновляем пользователя
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ОБРАЗОВАНИЕ <span>ОНЛАЙН</span></h1>
          <p className="auth-subtitle">Создайте аккаунт, чтобы начать обучение</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input type="text" name="name" placeholder="Имя" value={formData.name} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="input-group">
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="input-group">
            <input type="password" name="confirmPassword" placeholder="Подтвердите пароль" value={formData.confirmPassword} onChange={handleChange} required className="auth-input" />
          </div>
          <div className="terms-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span>Я принимаю условия использования</span>
            </label>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <div className="auth-footer">
          <p>Уже есть аккаунт? <Link to="/login" className="auth-link">«Войти»</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;