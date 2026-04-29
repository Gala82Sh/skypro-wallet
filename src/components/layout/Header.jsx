import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Главная</Link>
      <Link to="/login" style={{ marginRight: '10px' }}>Вход</Link>
      <Link to="/register" style={{ marginRight: '10px' }}>Регистрация</Link>
      <Link to="/analytics" style={{ marginRight: '10px' }}>Аналитика</Link>
    </nav>
  );
}

export default Header;