import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  
  const isMobile = window.innerWidth <= 768;
  const isAddExpensePage = location.pathname === '/add-expense';
  const buttonText = isAddExpensePage ? 'Новый расход' : 'Мои расходы';

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img alt="Skypro.Wallet" src="/image/Vector.svg" />
      </Link>

      {}
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

      {}
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
                <Link to="/analytics" className={styles.dropdownItem}>Анализ расходов</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.userInfo}>
        {!isMobile && !isAddExpensePage && <span className={styles.username}>test</span>}
        <button className={styles.logoutBtn}>Выйти</button>
      </div>
    </header>
  );
}

export default Header;