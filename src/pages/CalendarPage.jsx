import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import stylesCalendar from './CalendarPage.module.css';

function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [currentCalendarYear, setCurrentCalendarYear] = useState(currentYear);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(currentMonth);

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

  const goToPreviousMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarYear(prev => prev - 1);
      setCurrentCalendarMonth(11);
    } else {
      setCurrentCalendarMonth(prev => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarYear(prev => prev + 1);
      setCurrentCalendarMonth(0);
    } else {
      setCurrentCalendarMonth(prev => prev + 1);
    }
  };

  const isDateInRange = (day, month, year) => {
    if (!rangeStart || !rangeEnd) return false;
    const date = new Date(year, month, day);
    return date > rangeStart && date < rangeEnd;
  };

  const isDateStart = (day, month, year) => {
    if (!rangeStart) return false;
    const date = new Date(year, month, day);
    return rangeStart.toDateString() === date.toDateString();
  };

  const isDateEnd = (day, month, year) => {
    if (!rangeEnd) return false;
    const date = new Date(year, month, day);
    return rangeEnd.toDateString() === date.toDateString();
  };

  const handleDayClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);
    if (!isRangeMode) {
      
      localStorage.setItem('selectedPeriodStart', clickedDate.toISOString());
      localStorage.setItem('selectedPeriodEnd', clickedDate.toISOString());
      navigate('/analytics-mobile');
    } else {
      
      if (!rangeStart) {
        setRangeStart(clickedDate);
        setRangeEnd(null);
      } else if (!rangeEnd) {
        let start, end;
        if (rangeStart > clickedDate) {
          start = clickedDate;
          end = rangeStart;
        } else {
          start = rangeStart;
          end = clickedDate;
        }
        setRangeEnd(end);
        localStorage.setItem('selectedPeriodStart', start.toISOString());
        localStorage.setItem('selectedPeriodEnd', end.toISOString());
        navigate('/analytics-mobile');
      }
    }
  };

  const handleWeekClick = (week, month, year) => {
    const validDays = week.filter(d => d !== null);
    if (validDays.length === 0) return;
    const startDay = validDays[0];
    const endDay = validDays[validDays.length - 1];
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    localStorage.setItem('selectedPeriodStart', startDate.toISOString());
    localStorage.setItem('selectedPeriodEnd', endDate.toISOString());
    navigate('/analytics-mobile');
  };

  const getMonthsList = () => {
    const months = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentCalendarYear, currentCalendarMonth + i, 1);
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  };

  const monthsList = getMonthsList();

  return (
    <div className={stylesCalendar.page}>
      <div className={stylesCalendar.header}>
        <Link to="/analytics-mobile" className={stylesCalendar.backLink}>
          <img
            src="/image/Vector-new.svg"
            alt="Назад"
            className={stylesCalendar.backIcon}
          />
          <span className={stylesCalendar.backText}>Анализ расходов</span>
        </Link>
      </div>

      <div
        className={stylesCalendar.periodTitle}
        onClick={() => {
          setIsRangeMode(!isRangeMode);
          setRangeStart(null);
          setRangeEnd(null);
        }}
      >
        {isRangeMode ? 'Выбор диапазона' : 'Выбор дня'}
        {isRangeMode && (
          <span style={{ fontSize: '12px', marginLeft: '8px', color: '#7334EA' }}>
            {!rangeStart ? ' выберите начало' : !rangeEnd ? ' выберите конец' : ''}
          </span>
        )}
      </div>

      <div className={stylesCalendar.weekDaysRow}>
        {weekDays.map(day => <div key={day} className={stylesCalendar.weekDay}>{day}</div>)}
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {monthsList.map(({ year, month }, idx) => {
          const monthGrid = generateMonthGrid(year, month);
          const monthName = new Date(year, month).toLocaleString('ru', { month: 'long', year: 'numeric' });
          const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
          return (
            <div key={idx}>
              <div className={stylesCalendar.monthTitle}>{capitalizedMonthName}</div>
              {monthGrid.map((week, weekIdx) => (
                <div key={weekIdx} className={stylesCalendar.weekRow} onClick={() => handleWeekClick(week, month, year)}>
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={stylesCalendar.calendarDay}
                      style={{
                        backgroundColor: day
                          ? isDateInRange(day, month, year)
                            ? '#D9B6FF'
                            : isDateStart(day, month, year) || isDateEnd(day, month, year)
                            ? '#7334EA'
                            : '#F4F5F6'
                          : 'transparent',
                        color: day && (isDateStart(day, month, year) || isDateEnd(day, month, year)) ? '#FFFFFF' : '#000000',
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
  );
}

export default CalendarPage;