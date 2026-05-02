import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CATEGORIES } from '../constants/categories';

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
        type: 'day',
        startDate: new Date(currentYear, currentMonth, currentDay),
        endDate: new Date(currentYear, currentMonth, currentDay),
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [rangeStart, setRangeStart] = useState(null);
    const [isSelectingRange, setIsSelectingRange] = useState(false);
    const [currentCalendarYear, setCurrentCalendarYear] = useState(currentYear);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(currentMonth);

   
    useEffect(() => {
        const saved = localStorage.getItem('expenses');
        if (saved) {
            setExpenses(JSON.parse(saved));
        } else {
           
            setExpenses([
                { id: 1, description: 'Пятерочка', category: 'Еда', date: '03.07.2024', amount: 3500 },
                { id: 2, description: 'Индекс Такси', category: 'Транспорт', date: '03.07.2024', amount: 730 },
                { id: 3, description: 'Аптека Вита', category: 'Другое', date: '03.07.2024', amount: 1200 },
                { id: 4, description: 'Бургер Кинг', category: 'Еда', date: '03.07.2024', amount: 950 },
                { id: 5, description: 'Деливери', category: 'Еда', date: '02.07.2024', amount: 1320 },
                { id: 6, description: 'Кофейня №1', category: 'Еда', date: '02.07.2024', amount: 400 },
                { id: 7, description: 'Бильярд', category: 'Развлечения', date: '29.06.2024', amount: 600 },
                { id: 8, description: 'Перекресток', category: 'Еда', date: '29.06.2024', amount: 2360 },
            ]);
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
        if (!selectedPeriod) return 'выберите период';
        const start = selectedPeriod.startDate;
        const end = selectedPeriod.endDate;
        if (start.toDateString() === end.toDateString()) {
            return `${start.getDate()} ${start.toLocaleString('ru', { month: 'long' })} ${start.getFullYear()} г.`;
        }
        return `${start.getDate()} – ${end.getDate()} ${end.toLocaleString('ru', { month: 'long' })} ${end.getFullYear()} г.`;
    };

    // Календарные функции
    const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

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
                setIsCalendarOpen(false);
            }
        } else {
            setSelectedPeriod({ type: 'day', startDate: clickedDate, endDate: clickedDate });
            setIsCalendarOpen(false);
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
        setIsCalendarOpen(false);
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

    const enableRangeSelection = () => {
        setIsSelectingRange(true);
        setRangeStart(null);
    };

    // Вёрстка
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

            {isCalendarOpen && (
                <div style={styles.calendarOverlay}>
                    <div style={styles.calendarCard}>
                        <div style={{ ...styles.periodTitle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={goToPreviousMonth} style={styles.calendarNavButton}>←</button>
                            <span onClick={enableRangeSelection}>
                                Период {isSelectingRange && (rangeStart === null ? ' выберите начало' : ' выберите конец')}
                            </span>
                            <button onClick={goToNextMonth} style={styles.calendarNavButton}>→</button>
                        </div>
                        <div style={styles.weekDaysRow}>
                            {weekDays.map(day => <div key={day} style={styles.weekDay}>{day}</div>)}
                        </div>
                        <div style={styles.monthTitle}>
                            {new Date(currentCalendarYear, currentCalendarMonth).toLocaleString('ru', { month: 'long', year: 'numeric' })}
                        </div>
                        {generateMonthGrid(currentCalendarYear, currentCalendarMonth).map((week, weekIdx) => (
                            <div key={weekIdx} style={styles.weekRow} onClick={() => handleWeekClick(week, currentCalendarMonth, currentCalendarYear)}>
                                {week.map((day, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        style={{
                                            ...styles.calendarDay,
                                            backgroundColor: day
                                                ? isDateInRange(day, currentCalendarMonth, currentCalendarYear)
                                                    ? '#D9B6FF'
                                                    : isDateSelected(day, currentCalendarMonth, currentCalendarYear)
                                                        ? '#7334EA'
                                                        : '#F4F5F6'
                                                : 'transparent',
                                            color: day && isDateSelected(day, currentCalendarMonth, currentCalendarYear) ? '#FFFFFF' : '#000000',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (day) handleDayClick(day, currentCalendarMonth, currentCalendarYear);
                                        }}
                                    >
                                        {day || ''}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
    calendarOverlay: {
        marginTop: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '30px',
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    calendarCard: {
        width: '100%',
    },
    periodTitle: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontSize: '18px',
        textAlign: 'center',
        color: '#000000',
        marginBottom: '16px',
        cursor: 'pointer',
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
        fontWeight: 400,
        fontSize: '12px',
        color: '#999999',
    },
    monthTitle: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 600,
        fontSize: '16px',
        margin: '16px 0 12px 0',
        color: '#000000',
    },
    weekRow: {
        display: 'flex',
        gap: '6px',
        cursor: 'pointer',
        marginBottom: '6px',
    },
    calendarDay: {
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
        fontSize: '12px',
        borderRadius: '60px',
    },
    calendarNavButton: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0 8px',
        color: '#7334EA',
    },
};

export default AnalyticsMobile;