import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../services/authService';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src="/image/Vector.png" alt="Skypro.Wallet" style={styles.logoImg} />
      </div>

      {!isAuthPage && currentUser && (
        <>
          <div style={styles.navContainer}>
            <Link to="/" style={location.pathname === '/' ? styles.activeNavLink : styles.navLink}>
              Мои расходы
            </Link>
            <Link to="/analytics" style={location.pathname === '/analytics' ? styles.activeNavLink : styles.navLink}>
              Анализ расходов
            </Link>
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{currentUser.name}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>ВЫЙТИ</button>
          </div>
        </>
      )}
    </header>
  );
}

const styles = {
  header: {
    width: '1440px',
    height: '64px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: '23px',
    left: '120px',
  },
  logoImg: {
    width: '143.68px',
    height: '19px',
  },
  navContainer: {
    display: 'flex',
    gap: '48px',
    position: 'absolute',
    top: '20px',
    left: '583px',
  },
  navLink: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '170%',
    color: '#000000',
    textDecoration: 'none',
  },
  activeNavLink: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '170%',
    color: '#7334EA',
    textDecoration: 'underline',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'absolute',
    top: '20px',
    right: '120px',
  },
  userName: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '500',
    fontSize: '14px',
    color: '#000000',
  },
  logoutButton: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    color: '#000000',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Header;