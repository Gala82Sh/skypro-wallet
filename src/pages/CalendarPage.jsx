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

    const [selectedPeriod, setSelectedPeriod] = useState({
        startDate: new Date(currentYear, currentMonth, currentDay),
        endDate: new Date(currentYear, currentMonth, currentDay),
    });
    const [rangeStart, setRangeStart] = useState(null);
    const [isSelectingRange, setIsSelectingRange] = useState(false);
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
        if (!isSelectingRange || rangeStart === null) return false;
        const currentDate = new Date(year, month, day);
        const start = new Date(rangeStart);
        const end = new Date(rangeStart);
        if (currentDate >= start && currentDate <= end) return true;
        return false;
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
                    setSelectedPeriod({ startDate: end, endDate: start });
                } else {
                    setSelectedPeriod({ startDate: start, endDate: end });
                }
                setIsSelectingRange(false);
                setRangeStart(null);
            }
        } else {
            setSelectedPeriod({ startDate: clickedDate, endDate: clickedDate });
        }
    };

    const handleWeekClick = (week, month, year) => {
        const validDays = week.filter(d => d !== null);
        if (validDays.length === 0) return;
        const startDay = validDays[0];
        const endDay = validDays[validDays.length - 1];
        const startDate = new Date(year, month, startDay);
        const endDate = new Date(year, month, endDay);
        setSelectedPeriod({ startDate, endDate });
        setIsSelectingRange(false);
        setRangeStart(null);
    };

    const handleConfirm = () => {
        localStorage.setItem('selectedPeriodStart', selectedPeriod.startDate.toISOString());
        localStorage.setItem('selectedPeriodEnd', selectedPeriod.endDate.toISOString());
        navigate('/analytics-mobile');
    };

    const currentMonthGrid = generateMonthGrid(currentCalendarYear, currentCalendarMonth);
    const nextMonthGrid = generateMonthGrid(currentCalendarYear, currentCalendarMonth + 1);

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
                onClick={() => setIsSelectingRange(!isSelectingRange)}
            >
                Выбор периода
                {isSelectingRange && (
                    <span style={{ fontSize: '12px', marginLeft: '8px', color: '#7334EA' }}>
                        {rangeStart === null ? ' выберите начало' : ' выберите конец'}
                    </span>
                )}
            </div>

            <div className={stylesCalendar.weekDaysRow}>
                {weekDays.map(day => <div key={day} className={stylesCalendar.weekDay}>{day}</div>)}
            </div>

            <div className={stylesCalendar.monthTitle}>
                {new Date(currentCalendarYear, currentCalendarMonth).toLocaleString('ru', { month: 'long', year: 'numeric' })}
            </div>
            {currentMonthGrid.map((week, weekIdx) => (
                <div key={weekIdx} className={stylesCalendar.weekRow} onClick={() => handleWeekClick(week, currentCalendarMonth, currentCalendarYear)}>
                    {week.map((day, dayIdx) => (
                        <div
                            key={dayIdx}
                            className={stylesCalendar.calendarDay}
                            style={{
                                backgroundColor: day
                                    ? isDateInRange(day, currentCalendarMonth, currentCalendarYear)
                                        ? '#D9B6FF'
                                        : '#F4F5F6'
                                    : 'transparent',
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

            <div className={stylesCalendar.monthTitle}>
                {new Date(currentCalendarYear, currentCalendarMonth + 1).toLocaleString('ru', { month: 'long', year: 'numeric' })}
            </div>
            {nextMonthGrid.map((week, weekIdx) => (
                <div key={weekIdx} className={stylesCalendar.weekRow} onClick={() => handleWeekClick(week, currentCalendarMonth + 1, currentCalendarYear)}>
                    {week.map((day, dayIdx) => (
                        <div
                            key={dayIdx}
                            className={stylesCalendar.calendarDay}
                            style={{
                                backgroundColor: day
                                    ? isDateInRange(day, currentCalendarMonth + 1, currentCalendarYear)
                                        ? '#D9B6FF'
                                        : '#F4F5F6'
                                    : 'transparent',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (day) handleDayClick(day, currentCalendarMonth + 1, currentCalendarYear);
                            }}
                        >
                            {day || ''}
                        </div>
                    ))}
                </div>
            ))}

            <button className={stylesCalendar.confirmButton} onClick={handleConfirm}>
                Выбрать период
            </button>
        </div>
    );
}

export default CalendarPage;