import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import styles from './AnalyticsMobile.module.css';

function AnalyticsMobile() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkDesktop = () => {
      if (window.innerWidth > 768) {
        navigate('/analytics');
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [navigate]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const [expenses, setExpenses] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    startDate: new Date(currentYear, currentMonth, currentDay),
    endDate: new Date(currentYear, currentMonth, currentDay),
  });

  
  useEffect(() => {
    const loadExpenses = () => {
      const saved = localStorage.getItem('expenses');
      if (saved) {
        setExpenses(JSON.parse(saved));
      } else {
        setExpenses([
          { id: 1, description: 'Пятерочка', category: 'Еда', date: '03.04.2026', amount: 3500 },
          { id: 2, description: 'Индекс Такси', category: 'Транспорт', date: '29.04.2026', amount: 730 },
          { id: 3, description: 'Аптека Вита', category: 'Другое', date: '30.04.2026', amount: 1200 },
          { id: 4, description: 'Бургер Кинг', category: 'Еда', date: '01.05.2026', amount: 950 },
          { id: 5, description: 'Деливери', category: 'Еда', date: '01.05.2026', amount: 1320 },
          { id: 6, description: 'Кофейня №1', category: 'Еда', date: '30.04.2026', amount: 400 },
          { id: 7, description: 'Бильярд', category: 'Развлечения', date: '27.04.2026', amount: 600 },
          { id: 8, description: 'Перекресток', category: 'Еда', date: '29.04.2026', amount: 2360 },
        ]);
      }
    };
    loadExpenses();
  }, []);

  
  useEffect(() => {
    const savedStart = localStorage.getItem('selectedPeriodStart');
    const savedEnd = localStorage.getItem('selectedPeriodEnd');
    if (savedStart && savedEnd) {
      setSelectedPeriod({
        startDate: new Date(savedStart),
        endDate: new Date(savedEnd),
      });
    }
  }, []);

  const getExpensesForPeriod = () => {
    if (!selectedPeriod) return [];
    const start = new Date(selectedPeriod.startDate);
    const end = new Date(selectedPeriod.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return expenses.filter(exp => {
      const [day, month, year] = exp.date.split('.');
      const expDate = new Date(`${year}-${month}-${day}`);
      return expDate >= start && expDate <= end;
    });
  };

  const categories = CATEGORIES.map(cat => cat.name);
  const categoryColors = CATEGORIES.map(cat => cat.color);
  const maxHeight = 328;

  const filteredExpenses = getExpensesForPeriod();
  const categoryAmounts = categories.map(cat =>
    filteredExpenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0)
  );
  const totalAmount = categoryAmounts.reduce((sum, amt) => sum + amt, 0);
  const maxAmount = Math.max(...categoryAmounts, 1);

  const getColumnHeight = (amount) => {
    if (amount === 0) return 4;
    return Math.max(4, (amount / maxAmount) * maxHeight);
  };

  const formatDate = () => {
    const start = selectedPeriod.startDate;
    const end = selectedPeriod.endDate;
    if (start.toDateString() === end.toDateString()) {
      return `${start.getDate()} ${start.toLocaleString('ru', { month: 'long' })} ${start.getFullYear()} г.`;
    }
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleString('ru', { month: 'long' })} ${end.getFullYear()} г.`;
  };

  return (
    <div className={styles['mobile-analytics-page']}>
      <h1 className={styles['mobile-analytics-title']}>Анализ расходов</h1>

      <div className={styles['mobile-analytics-summary']}>
        <div className={styles['mobile-analytics-total']}>{totalAmount.toLocaleString()} ₽</div>
        <div className={styles['mobile-analytics-period']}>{formatDate()}</div>
      </div>

      <div className={styles['mobile-analytics-chart']}>
        {categories.map((cat, idx) => (
          <div key={cat} className={styles['mobile-analytics-bar-wrapper']}>
  <div className={styles['mobile-analytics-bar-value']}>{categoryAmounts[idx].toLocaleString()} ₽</div>
  <div className={styles['mobile-analytics-bar-container']}>
    <div
      className={styles['mobile-analytics-bar']}
      style={{
        height: `${getColumnHeight(categoryAmounts[idx])}px`,
        backgroundColor: categoryColors[idx],
      }}
    />
  </div>
  <div className={styles['mobile-analytics-bar-label']}>{cat}</div>
</div>
        ))}
      </div>

      <div className={styles['mobile-analytics-button-container']}>
        <button
          className={styles['mobile-analytics-button']}
          onClick={() => navigate('/calendar')}
        >
          Выбрать другой период
        </button>
      </div>
    </div>
  );
}

export default AnalyticsMobile;