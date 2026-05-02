import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';

function AnalyticsMobile() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkDesktop = () => {
      if (window.innerWidth > 768) navigate('/analytics');
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
    <div style={styles.page}>
      <h1 style={styles.title}>Анализ расходов</h1>

      <div style={styles.summary}>
        <div style={styles.total}>{totalAmount.toLocaleString()} ₽</div>
        <div style={styles.periodLabel}>
          <span style={styles.periodText}>Расходы за </span>
          <span style={styles.periodDate}>{formatDate()}</span>
        </div>
      </div>

      <div style={styles.chartContainer}>
        {categories.map((cat, idx) => (
          <div key={cat} style={styles.barWrapper}>
            <div style={styles.barValue}>{categoryAmounts[idx].toLocaleString()} ₽</div>
            <div style={{ ...styles.bar, height: `${getColumnHeight(categoryAmounts[idx])}px`, backgroundColor: categoryColors[idx] }} />
            <div style={styles.barLabel}>{cat}</div>
          </div>
        ))}
      </div>

      <button style={styles.button} onClick={() => navigate('/calendar')}>
        Выбрать другой период
      </button>
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    maxWidth: '375px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px 16px 40px 16px',
    boxSizing: 'border-box',
  },
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '100%',
    textAlign: 'left',
    color: '#000000',
    margin: '0 0 24px 0',
  },
  summary: {
    textAlign: 'left',
    marginBottom: '24px',
  },
  total: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
    marginBottom: '8px',
  },
  periodLabel: {
    textAlign: 'left',
    marginBottom: '24px',
  },
  periodText: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#999999',
  },
  periodDate: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#999999',
  },
  chartContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    gap: '6px',
    width: '100%',
    overflowX: 'hidden',
    marginBottom: '24px',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    width: '52px',
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  barValue: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '100%',
    textAlign: 'center',
    color: '#000000',
  },
  bar: {
    width: '40px',
    borderRadius: '12px',
    transition: 'height 0.3s ease',
  },
  barLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    fontSize: '10px',
    textAlign: 'center',
    color: '#000000',
  },
  button: {
    width: '343px',
    height: '39px',
    backgroundColor: '#7334EA',
    borderRadius: '6px',
    padding: '12px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '100%',
    color: '#ffffff',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    margin: '0 auto',
    display: 'block',
  },
};

export default AnalyticsMobile;