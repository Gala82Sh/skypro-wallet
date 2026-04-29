import { useState } from 'react';

function Analytics() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const expensesData = [
    { date: '2026-04-29', category: 'Еда', amount: 3590 },
    { date: '2026-04-29', category: 'Транспорт', amount: 1835 },
    { date: '2026-04-29', category: 'Жилье', amount: 0 },
    { date: '2026-04-29', category: 'Развлечения', amount: 1250 },
    { date: '2026-04-29', category: 'Образование', amount: 600 },
    { date: '2026-04-29', category: 'Другое', amount: 2306 },
  ];

  const categories = ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Образование', 'Другое'];
  const categoryColors = ['#D9B6FF', '#FFB53D', '#6EE4FE', '#B0AEFF', '#BCEC30', '#FFB9B8'];
  const maxHeight = 328;

  const [selectedPeriod, setSelectedPeriod] = useState({
    type: 'day',
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
    return expensesData.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= start && expDate <= end;
    });
  };

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
    if (!selectedPeriod) return 'выберите период';
    const start = selectedPeriod.startDate;
    const end = selectedPeriod.endDate;
    if (start.toDateString() === end.toDateString()) {
      return `${start.getDate()} ${start.toLocaleString('ru', { month: 'long' })} ${start.getFullYear()} г.`;
    }
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleString('ru', { month: 'long' })} ${end.getFullYear()} г.`;
  };

  const enableRangeSelection = () => {
    setIsSelectingRange(true);
    setRangeStart(null);
    setSelectedPeriod(null);
  };

  const handleDayClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);

    if (isSelectingRange) {
      if (rangeStart === null) {
        setRangeStart(clickedDate);
      } else {
        const start = new Date(rangeStart);
        const end = new Date(clickedDate);
        if (start > end) {
          setSelectedPeriod({ type: 'range', startDate: end, endDate: start });
        } else {
          setSelectedPeriod({ type: 'range', startDate: start, endDate: end });
        }
        setIsSelectingRange(false);
        setRangeStart(null);
      }
    } else {
      setSelectedPeriod({ type: 'day', startDate: clickedDate, endDate: clickedDate });
    }
  };

  const handleWeekClick = (week, month, year) => {
    const validDays = week.filter(d => d !== null);
    if (validDays.length === 0) return;
    const startDay = validDays[0];
    const endDay = validDays[validDays.length - 1];
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    setSelectedPeriod({ type: 'week', startDate, endDate });
    setIsSelectingRange(false);
    setRangeStart(null);
  };

  const isDateInRange = (day, month, year) => {
    if (!selectedPeriod || selectedPeriod.type !== 'range') return false;
    const date = new Date(year, month, day);
    return date >= selectedPeriod.startDate && date <= selectedPeriod.endDate;
  };

  const isDateSelected = (day, month, year) => {
    if (!selectedPeriod || selectedPeriod.type !== 'day') return false;
    const date = new Date(year, month, day);
    return selectedPeriod.startDate.toDateString() === date.toDateString();
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
        if (week === 0 && dayOfWeek < firstDayIndex) {
          weekRow.push(null);
        } else if (dayCounter <= daysInMonth) {
          weekRow.push(dayCounter);
          dayCounter++;
        } else {
          weekRow.push(null);
        }
      }
      daysGrid.push(weekRow);
      if (dayCounter > daysInMonth) break;
    }
    return daysGrid;
  };

  const currentMonthName = today.toLocaleString('ru', { month: 'long', year: 'numeric' });
  const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
  const currentMonthGrid = generateMonthGrid(currentYear, currentMonth);

  const nextMonth = currentMonth + 1;
  const nextMonthYear = nextMonth > 11 ? currentYear + 1 : currentYear;
  const nextMonthIndex = nextMonth > 11 ? 0 : nextMonth;
  const nextMonthName = new Date(nextMonthYear, nextMonthIndex, 1).toLocaleString('ru', { month: 'long', year: 'numeric' });
  const capitalizedNextMonth = nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1);

  const generateNextMonthContinuation = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayIndex(year, month);
    const lastWeekDays = [];
    let dayCounter = 1;
    for (let week = 0; week < 6; week++) {
      const weekRow = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < firstDayIndex) {
          weekRow.push(null);
        } else if (dayCounter <= daysInMonth) {
          weekRow.push(dayCounter);
          dayCounter++;
        } else {
          weekRow.push(null);
        }
      }
      lastWeekDays.push(weekRow);
      if (dayCounter > daysInMonth) break;
    }
    return lastWeekDays;
  };
  const nextMonthGrid = generateNextMonthContinuation(nextMonthYear, nextMonthIndex);

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
              {isSelectingRange && (
                <span style={{ fontSize: '12px', marginLeft: '8px', color: '#7334EA' }}>
                  {rangeStart === null ? ' выберите начало' : ' выберите конец'}
                </span>
              )}
            </div>
            <div style={styles.weekDaysRow}>
              {weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}
            </div>

            <div style={styles.monthTitle}>{capitalizedMonth}</div>
            <div style={styles.calendarGrid}>
              {currentMonthGrid.map((week, weekIdx) => (
                <div key={weekIdx} style={styles.weekRow} onClick={() => handleWeekClick(week, currentMonth, currentYear)}>
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      style={{
                        ...styles.calendarDay,
                        backgroundColor: day
                          ? isDateInRange(day, currentMonth, currentYear)
                            ? '#D9B6FF'
                            : isDateSelected(day, currentMonth, currentYear)
                            ? '#7334EA'
                            : '#F4F5F6'
                          : 'transparent',
                        color: day && isDateSelected(day, currentMonth, currentYear) ? '#FFFFFF' : '#000000',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (day) handleDayClick(day, currentMonth, currentYear);
                      }}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={styles.monthTitle}>{capitalizedNextMonth}</div>
            <div style={styles.calendarGrid}>
              {nextMonthGrid.slice(0, 2).map((week, weekIdx) => (
                <div key={weekIdx} style={styles.weekRow} onClick={() => handleWeekClick(week, nextMonthIndex, nextMonthYear)}>
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      style={{
                        ...styles.calendarDay,
                        backgroundColor: day
                          ? isDateInRange(day, nextMonthIndex, nextMonthYear)
                            ? '#D9B6FF'
                            : isDateSelected(day, nextMonthIndex, nextMonthYear)
                            ? '#7334EA'
                            : '#F4F5F6'
                          : 'transparent',
                        color: day && isDateSelected(day, nextMonthIndex, nextMonthYear) ? '#FFFFFF' : '#000000',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (day) handleDayClick(day, nextMonthIndex, nextMonthYear);
                      }}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              ))}
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
  page: {
    width: '1440px',
    margin: '0 auto',
    backgroundColor: '#F4F5F6',
    minHeight: '100vh',
    paddingTop: '100px',
  },
  pageTitle: {
    width: '301px',
    height: '48px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '150%',
    letterSpacing: '0px',
    color: '#000000',
    marginTop: '0',
    marginLeft: '120px',
    marginBottom: '32px',
  },
  container: {
    display: 'flex',
    gap: '34px',
    paddingLeft: '120px',
    paddingRight: '120px',
  },
  leftColumn: { width: '379px' },
  rightColumn: { width: '789px' },
  calendarCard: {
    width: '379px',
    height: '540px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    padding: '32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  periodTitle: {
    width: '101px',
    height: '29px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000000',
    marginBottom: '24px',
  },
  weekDaysRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px',
    borderBottom: '0.5px solid #999999',
    paddingBottom: '12px',
  },
  weekDay: {
    width: '40px',
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '100%',
    color: '#999999',
  },
  monthTitle: {
    width: '313px',
    height: '20px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
    marginTop: '24px',
    marginBottom: '16px',
  },
  calendarGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  weekRow: {
    display: 'flex',
    gap: '6px',
    cursor: 'pointer',
  },
  calendarDay: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '100%',
    borderRadius: '60px',
    cursor: 'pointer',
  },
  statsCard: {
    width: '789px',
    height: '540px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    padding: '32px',
    boxSizing: 'border-box',
  },
  totalAmount: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '100%',
    color: '#000000',
    marginBottom: '8px',
  },
  totalLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '14px',
    color: '#999999',
    marginBottom: '24px',
  },
  chartContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: '40px',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '94px',
  },
  barValue: {
    width: '94px',
    height: '20px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center',
    color: '#000000',
    marginBottom: '4px',
  },
  bar: {
    width: '94px',
    borderRadius: '12px',
    transition: 'height 0.3s ease',
  },
  barLabel: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    textAlign: 'center',
    color: '#000000',
  },
};

export default Analytics;