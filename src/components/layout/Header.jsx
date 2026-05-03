import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAddExpensePage = location.pathname === '/add-expense';
  const isAnalyticsPage = location.pathname === '/analytics-mobile' || location.pathname === '/analytics';

  const buttonText = isAddExpensePage 
    ? 'Новый расход' 
    : (isAnalyticsPage ? 'Анализ расходов' : 'Мои расходы');

  const handleLogout = () => {
    localStorage.removeItem('skypro_wallet_current_user');
    localStorage.removeItem('skypro_wallet_token');
    localStorage.removeItem('skypro_wallet_user');
    localStorage.removeItem('skypro_wallet_users');
    navigate('/login');
  };

  if (isAuthPage) return null;

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img alt="Skypro.Wallet" src="/image/Vector.svg" />
      </Link>

      {!isMobile && (
        <div className={styles.desktopNav}>
          <Link to="/" className={location.pathname === '/' ? styles.activeLink : styles.link}>
            Мои расходы
          </Link>
          <Link to="/analytics" className={location.pathname === '/analytics' ? styles.activeLink : styles.link}>
            Анализ расходов
          </Link>
        </div>
      )}

      {isMobile && (
        <div className={styles.mobileNav}>
          <div className={styles.dropdownWrapper}>
            <button 
              className={styles.activeLink}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{buttonText}</span>
              <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ''}`}></span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <Link to="/" className={styles.dropdownItem}>Мои расходы</Link>
                <Link to="/analytics-mobile" className={styles.dropdownItem}>Анализ расходов</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.userInfo}>
        {!isMobile && !isAddExpensePage && <span className={styles.username}>test</span>}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
}

export default Header;