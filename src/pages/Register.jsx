import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register(form.name, form.email, form.password);
      setSuccess('Регистрация успешна! Перенаправление на вход...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-title">Регистрация</div>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Эл. почта"
          value={form.email}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className="register-input"
          required
        />

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <button type="submit" className="register-button">Зарегистрироваться</button>

        <div className="register-footer">
          <span className="register-footer-text">Уже есть аккаунт?</span>
          <Link to="/login" className="register-link">Войдите здесь</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;