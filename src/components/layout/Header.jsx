import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src="/image/Vector.png" alt="Skypro.Wallet" style={styles.logoImg} />
      </div>

      <div style={styles.navContainer}>
        <Link
          to="/"
          style={location.pathname === '/' ? styles.activeNavLink : styles.navLink}
          onMouseEnter={(e) => {
            e.target.style.color = '#7334EA';
            e.target.style.fontWeight = '600';
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/') {
              e.target.style.color = '#000000';
              e.target.style.fontWeight = '400';
            } else {
              e.target.style.color = '#7334EA';
              e.target.style.fontWeight = '600';
            }
          }}
        >
          Мои расходы
        </Link>

        <Link
          to="/analytics"
          style={location.pathname === '/analytics' ? styles.activeNavLink : styles.navLink}
          onMouseEnter={(e) => {
            e.target.style.color = '#7334EA';
            e.target.style.fontWeight = '600';
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/analytics') {
              e.target.style.color = '#000000';
              e.target.style.fontWeight = '400';
            } else {
              e.target.style.color = '#7334EA';
              e.target.style.fontWeight = '600';
            }
          }}
        >
          Анализ расходов
        </Link>
      </div>

      <Link to="/login" style={styles.logoutLink}>
        Выйти 
      </Link>
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
  logoutLink: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '170%',
    color: '#000000',
    textDecoration: 'none',
    position: 'absolute',
    top: '20px',
    right: '120px',
  },
};

export default Header;