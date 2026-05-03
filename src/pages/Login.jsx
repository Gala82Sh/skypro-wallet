import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../services/authService';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAPI(form.login, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-title">Вход</div>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="login"
          placeholder="Логин"
          value={form.login}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="login-input"
          required
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button">Войти</button>

        <div className="login-footer">
          <span className="login-footer-text">Нет аккаунта?</span>
          <Link to="/register" className="login-link">Зарегистрируйтесь</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;