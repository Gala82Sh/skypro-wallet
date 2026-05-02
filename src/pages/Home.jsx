import { useState, useEffect } from 'react';
import trashIcon from '/image/icon.svg';
import { CATEGORIES } from '../constants/categories';
import Input from '../components/common/Input';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { transactionsApi } from '../services/transactionsApi';

const initialExpenses = [
  { id: 1, description: 'Пятерочка', category: 'Еда', date: '03.04.2026', amount: 3500 },
  { id: 2, description: 'Индекс Такси', category: 'Транспорт', date: '29.04.2026', amount: 730 },
  { id: 3, description: 'Аптека Вита', category: 'Другое', date: '30.04.2026', amount: 1200 },
  { id: 4, description: 'Бургер Кинг', category: 'Еда', date: '01.05.2026', amount: 950 },
  { id: 5, description: 'Деливери', category: 'Еда', date: '01.05.2026', amount: 1320 },
  { id: 6, description: 'Кофейня №1', category: 'Еда', date: '30.04.2026', amount: 400 },
  { id: 7, description: 'Бильярд', category: 'Развлечения', date: '27.04.2026', amount: 600 },
  { id: 8, description: 'Перекресток', category: 'Еда', date: '29.04.2026', amount: 2360 },
];

function Home() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    description: '',
    category: '',
    date: '',
    amount: '',
  });
  const [errors, setErrors] = useState({
    description: '',
    category: '',
    date: '',
    amount: '',
  });
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  
  useEffect(() => {
    const saved = transactionsApi.getAll();
    if (saved.length > 0) {
      setExpenses(saved);
    } else {
      setExpenses(initialExpenses);
      localStorage.setItem('expenses', JSON.stringify(initialExpenses));
    }
  }, []);

  
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCategoryClick = (category) => {
    setForm({ ...form, category });
    if (errors.category) {
      setErrors({ ...errors, category: '' });
    }
  };

  const handleAdd = () => {
    const newErrors = {
      description: '',
      category: '',
      date: '',
      amount: '',
    };
    let hasError = false;

    if (!form.description.trim()) {
      newErrors.description = 'Введите описание расхода';
      hasError = true;
    }

    if (!form.category) {
      newErrors.category = 'Выберите категорию';
      hasError = true;
    }

    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!form.date) {
      newErrors.date = 'Введите дату';
      hasError = true;
    } else if (!dateRegex.test(form.date)) {
      newErrors.date = 'Введите дату';
      hasError = true;
    }

    const amountNum = Number(form.amount);
    if (!form.amount) {
      newErrors.amount = 'Введите сумму';
      hasError = true;
    } else if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Сумма должна быть положительным числом';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newExpense = {
      id: Date.now(),
      description: form.description.trim(),
      category: form.category,
      date: form.date,
      amount: amountNum,
    };

    const updatedExpenses = transactionsApi.add(newExpense);
    setExpenses(updatedExpenses);

    setForm({ description: '', category: '', date: '', amount: '' });
    setErrors({ description: '', category: '', date: '', amount: '' });
  };

  const handleRowClick = (id) => {
    setSelectedExpenseId(selectedExpenseId === id ? null : id);
  };

  const confirmDelete = (id) => {
    const updatedExpenses = transactionsApi.remove(id);
    setExpenses(updatedExpenses);
    setSelectedExpenseId(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        <span>Мои расходы</span>
        <button className={styles.mobileAddButton} onClick={() => navigate('/add-expense')}>
          <div className={styles.mobileAddIcon}>+</div>
          <span className={styles.mobileAddLabel}>Новый расход</span>
        </button>
      </div>

      <div className={styles.leftTable}>
        <div className={styles.tableCard}>
          <div className={styles.tableTitle}>Таблица расходов</div>

          <div className={styles.headerRow}>
            <div className={styles.headerCell}>Описание</div>
            <div className={styles.headerCell}>Категория</div>
            <div className={styles.headerCell}>Дата</div>
            <div className={styles.headerCell}>Сумма</div>
            <div className={styles.headerCell}></div>
          </div>

          <div className={styles.tableBody}>
            {expenses.map((exp) => (
              <div key={exp.id}>
                <div className={styles.row} onClick={() => handleRowClick(exp.id)}>
                  <div className={styles.cell}>{exp.description}</div>
                  <div className={styles.cell}>{exp.category}</div>
                  <div className={styles.cell}>{exp.date}</div>
                  <div className={styles.cell}>{exp.amount.toLocaleString()} ₽</div>
                  <div className={styles.cell} onClick={(e) => { e.stopPropagation(); confirmDelete(exp.id); }}>
                    <img src={trashIcon} alt="Удалить" style={{ width: '20px', height: '20px' }} />
                  </div>
                </div>
                {selectedExpenseId === exp.id && (
                  <div className={styles.deleteRow}>
                    <button className={styles.deleteButton} onClick={() => confirmDelete(exp.id)}>
                      Удалить расход
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightTable}>
        <div className={styles.formCard}>
          <div className={styles.formTitle}>Новый расход</div>

          <Input
            label="Описание"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Введите описание"
            error={errors.description}
            required
          />

          <label className={styles.categoryLabel}>Категория</label>
          <div className={styles.categoriesContainer}>
            <div className={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => {
                let buttonWidth = 'auto';
                if (cat.name === 'Еда') buttonWidth = '89px';
                if (cat.name === 'Транспорт') buttonWidth = '133px';
                if (cat.name === 'Жилье') buttonWidth = '109px';
                if (cat.name === 'Развлечения') buttonWidth = '149px';
                if (cat.name === 'Образование') buttonWidth = '152px';
                if (cat.name === 'Другое') buttonWidth = '111px';

                return (
                  <button
                    key={cat.id}
                    className={styles.categoryButton}
                    style={{
                      width: buttonWidth,
                      border: form.category === cat.name ? '2px solid #7334EA' : 'none',
                    }}
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    <img src={cat.icon} alt={cat.name} className={styles.categoryIcon} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.category}</div>}
          </div>

          <Input
            label="Дата"
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="Введите дату"
            error={errors.date}
            required
          />

          <Input
            label="Сумма"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Введите сумму"
            error={errors.amount}
            required
          />

          <button className={styles.button} onClick={handleAdd}>
            Добавить новый расход
          </button>
        </div>
      </div>

      <div className={styles.fabContainer}>
        <button className={styles.fab} onClick={() => navigate('/add-expense')}>
          <span className={styles.fabPlus}>+</span>
        </button>
        <span className={styles.fabLabel}>Новый расход</span>
      </div>
    </div>
  );
}

export default Home;