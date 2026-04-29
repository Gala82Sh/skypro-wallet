import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

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
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>Регистрация</div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Эл. почта"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button type="submit" style={styles.button}>Зарегистрироваться</button>

          <div style={styles.footer}>
            <span style={styles.footerText}>Уже есть аккаунт?</span>
            <Link to="/login" style={styles.link}>Войдите здесь</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '1440px',
    margin: '0 auto',
    backgroundColor: '#F4F5F6',
    minHeight: '100vh',
    position: 'relative',
  },
  container: {
    position: 'absolute',
    top: '207px',
    left: '530px',
    width: '379px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    padding: '32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '100%',
    textAlign: 'center',
    color: '#000000',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    width: '100%',
    height: '39px',
    padding: '12px',
    fontSize: '12px',
    fontFamily: 'Montserrat, sans-serif',
    border: '0.5px solid #999999',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    height: '39px',
    backgroundColor: '#7334EA',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '12px',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    marginTop: '16px',
  },
  footerText: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '150%',
    color: '#999999',
  },
  link: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '150%',
    color: '#999999',
    textDecoration: 'underline',
  },
  error: {
    color: '#dc3545',
    fontSize: '12px',
    textAlign: 'center',
  },
  success: {
    color: '#28a745',
    fontSize: '12px',
    textAlign: 'center',
  },
};

export default Register;