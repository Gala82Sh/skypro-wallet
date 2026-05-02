import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';

function Analytics() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) navigate('/analytics-mobile');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

 
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) setExpenses(JSON.parse(saved));
    else {
      setExpenses([
        { id: 1, description: 'Пятерочка', category: 'Еда', date: '03.07.2024', amount: 3500 },
        { id: 2, description: 'Индекс Такси', category: 'Транспорт', date: '03.07.2024', amount: 730 },
        { id: 3, description: 'Аптека Вита', category: 'Другое', date: '03.07.2024', amount: 1200 },
      ]);
    }
  }, []);

 
  const [selectedPeriod, setSelectedPeriod] = useState({
    startDate: new Date(currentYear, currentMonth, currentDay),
    endDate: new Date(currentYear, currentMonth, currentDay),
  });

  const [rangeStart, setRangeStart] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  
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

  const filteredExpenses = getExpensesForPeriod();

  const categories = CATEGORIES.map(cat => cat.name);
  const categoryColors = CATEGORIES.map(cat => cat.color);
  const maxHeight = 328;

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
    if (!selectedPeriod) return 'выберите период';
    const start = selectedPeriod.startDate;
    const end = selectedPeriod.endDate;
    if (start.toDateString() === end.toDateString())
      return `${start.getDate()} ${start.toLocaleString('ru', { month: 'long' })} ${start.getFullYear()} г.`;
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleString('ru', { month: 'long' })} ${end.getFullYear()} г.`;
  };

  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateMonthGrid = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayIndex(year, month);
    const daysGrid = [];
    let dayCounter = 1;
    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < firstDayIndex) weekRow.push(null);
        else if (dayCounter <= daysInMonth) weekRow.push(dayCounter++);
        else weekRow.push(null);
      }
      daysGrid.push(weekRow);
      if (dayCounter > daysInMonth) break;
    }
    return daysGrid;
  };

  const getAllMonths = () => {
    const months = [];
    for (let i = -6; i <= 6; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      months.push({ year: monthDate.getFullYear(), month: monthDate.getMonth() });
    }
    return months;
  };

  const monthsList = getAllMonths();

  const enableRangeSelection = () => {
    setIsSelectingRange(prev => !prev);
    setRangeStart(null);
  };

  const handleDayClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);
    if (isSelectingRange) {
      if (!rangeStart) setRangeStart(clickedDate);
      else {
        const start = rangeStart;
        const end = clickedDate;
        if (start > end) setSelectedPeriod({ startDate: end, endDate: start });
        else setSelectedPeriod({ startDate: start, endDate: end });
        setIsSelectingRange(false);
        setRangeStart(null);
      }
    } else {
      setSelectedPeriod({ startDate: clickedDate, endDate: clickedDate });
    }
  };

  const handleWeekClick = (week, month, year) => {
    const validDays = week.filter(d => d !== null);
    if (!validDays.length) return;
    const startDate = new Date(year, month, validDays[0]);
    const endDate = new Date(year, month, validDays[validDays.length - 1]);
    setSelectedPeriod({ startDate, endDate });
    setIsSelectingRange(false);
    setRangeStart(null);
  };

  const isDateInRange = (day, month, year) => {
    if (!isSelectingRange || !rangeStart) return false;
    const current = new Date(year, month, day);
    const start = new Date(rangeStart);
    const end = new Date(rangeStart);
    return current >= start && current <= end;
  };

  const isDateSelected = (day, month, year) => {
    const date = new Date(year, month, day);
    return selectedPeriod.startDate.toDateString() === date.toDateString();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Анализ расходов</h1>

      <div style={styles.container}>
        <div style={styles.leftColumn}>
          <div style={styles.calendarCard}>
            <div
              style={{ ...styles.periodTitle, cursor: 'pointer' }}
              onClick={enableRangeSelection}
            >
              Период
              {isSelectingRange && (rangeStart ? ' выберите конец' : ' выберите начало')}
            </div>

            <div style={styles.weekDaysRow}>
              {weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}
            </div>

            <div className="calendar-scroll" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {monthsList.map(({ year, month }, idx) => {
                const monthGrid = generateMonthGrid(year, month);
                const monthName = new Date(year, month).toLocaleString('ru', { month: 'long', year: 'numeric' });
                const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                return (
                  <div key={idx}>
                    <div style={styles.monthTitle}>{capitalized}</div>
                    {monthGrid.map((week, weekIdx) => (
                      <div key={weekIdx} style={styles.weekRow} onClick={() => handleWeekClick(week, month, year)}>
                        {week.map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            style={{
                              ...styles.calendarDay,
                              backgroundColor: day
                                ? isDateInRange(day, month, year)
                                  ? '#D9B6FF'
                                  : isDateSelected(day, month, year)
                                  ? '#7334EA'
                                  : '#F4F5F6'
                                : 'transparent',
                              color: day && isDateSelected(day, month, year) ? '#FFF' : '#000',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (day) handleDayClick(day, month, year);
                            }}
                          >
                            {day || ''}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.statsCard}>
            <div style={styles.totalAmount}>{totalAmount.toLocaleString()} ₽</div>
            <div style={styles.totalLabel}>Расходы за {formatDate()}</div>
            <div style={styles.chartContainer}>
              {categories.map((cat, idx) => (
                <div key={cat} style={styles.barWrapper}>
                  <div style={styles.barValue}>{categoryAmounts[idx].toLocaleString()} ₽</div>
                  <div style={{ ...styles.bar, height: `${getColumnHeight(categoryAmounts[idx])}px`, backgroundColor: categoryColors[idx] }} />
                  <div style={styles.barLabel}>{cat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { width: '1440px', margin: '0 auto', minHeight: '100vh', paddingTop: '100px' },
  pageTitle: { width: '301px', height: '48px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '32px', color: '#000000', margin: '0 0 32px 120px' },
  container: { display: 'flex', gap: '34px', padding: '0 120px' },
  leftColumn: { width: '379px' },
  rightColumn: { width: '789px' },
  calendarCard: { width: '379px', height: '540px', backgroundColor: '#FFFFFF', borderRadius: '30px', padding: '32px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
  periodTitle: { width: '101px', height: '29px', fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '24px', textAlign: 'center', color: '#000000', marginBottom: '24px' },
  weekDaysRow: { display: 'flex', gap: '6px', marginBottom: '12px', borderBottom: '0.5px solid #999999', paddingBottom: '12px' },
  weekDay: { width: '40px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: '12px', color: '#999999' },
  monthTitle: { width: '313px', fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '16px', color: '#000000', margin: '24px 0 16px 0' },
  weekRow: { display: 'flex', gap: '6px', cursor: 'pointer', marginBottom: '6px' },
  calendarDay: { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: '12px', borderRadius: '60px', cursor: 'pointer' },
  statsCard: { width: '789px', height: '540px', backgroundColor: '#FFFFFF', borderRadius: '30px', padding: '32px', boxSizing: 'border-box' },
  totalAmount: { fontFamily: 'Montserrat, sans-serif', fontWeight: '700', fontSize: '32px', color: '#000000', marginBottom: '8px' },
  totalLabel: { fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: '14px', color: '#999999', marginBottom: '24px' },
  chartContainer: { display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', height: '100%' },
  barWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '94px', justifyContent: 'flex-end', marginBottom: '60px' },
  barValue: { fontFamily: 'Montserrat, sans-serif', fontWeight: '600', fontSize: '16px', textAlign: 'center', color: '#000000', marginBottom: '4px' },
  bar: { width: '94px', borderRadius: '12px', transition: 'height 0.3s ease' },
  barLabel: { fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: '12px', textAlign: 'center', color: '#000000' },
};

export default Analytics;
