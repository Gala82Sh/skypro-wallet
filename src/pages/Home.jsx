import { useState } from 'react';
import trashIcon from '/image/icon.svg';
import { CATEGORIES } from '../constants/categories';
import Input from '../components/common/Input';

const initialExpenses = [
  { id: 1, description: 'Пятерочка', category: 'Еда', date: '03.07.2024', amount: 3500 },
  { id: 2, description: 'Индекс Такси', category: 'Транспорт', date: '03.07.2024', amount: 730 },
  { id: 3, description: 'Аптека Вита', category: 'Другое', date: '03.07.2024', amount: 1200 },
  { id: 4, description: 'Бургер Кинг', category: 'Еда', date: '03.07.2024', amount: 950 },
  { id: 5, description: 'Деливери', category: 'Еда', date: '02.07.2024', amount: 1320 },
  { id: 6, description: 'Кофейня №1', category: 'Еда', date: '02.07.2024', amount: 400 },
  { id: 7, description: 'Бильярд', category: 'Развлечения', date: '29.06.2024', amount: 600 },
  { id: 8, description: 'Перекресток', category: 'Еда', date: '29.06.2024', amount: 2360 },
];

function Home() {
  const [expenses, setExpenses] = useState(initialExpenses);
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
      newErrors.date = 'Введите дату)';
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

    setExpenses([newExpense, ...expenses]);
    setForm({ description: '', category: '', date: '', amount: '' });
    setErrors({ description: '', category: '', date: '', amount: '' });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Мои расходы</h1>

      <div style={styles.leftTable}>
        <div style={styles.tableCard}>
          <div style={styles.tableTitle}>Таблица расходов</div>

          <div style={styles.headerRow}>
            <div style={{ width: '250px' }}>Описание</div>
            <div style={{ width: '120px' }}>Категория</div>
            <div style={{ width: '100px' }}>Дата</div>
            <div style={{ width: '100px' }}>Сумма</div>
            <div style={{ width: '40px' }}></div>
          </div>

          <div style={styles.tableBody}>
            {expenses.map((exp) => (
              <div key={exp.id} style={styles.row}>
                <div style={{ width: '250px' }}>{exp.description}</div>
                <div style={{ width: '120px' }}>{exp.category}</div>
                <div style={{ width: '100px' }}>{exp.date}</div>
                <div style={{ width: '100px' }}>{exp.amount.toLocaleString()} ₽</div>
                <div style={{ width: '40px', cursor: 'pointer' }} onClick={() => handleDelete(exp.id)}>
                  <img src={trashIcon} alt="Удалить" style={{ width: '20px', height: '20px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightTable}>
        <div style={styles.formCard}>
          <div style={styles.formTitle}>Новый расход</div>

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

          <label style={styles.categoryLabel}>Категория</label>
          <div style={{ ...styles.categoriesContainer, marginBottom: '24px', marginTop: '8px' }}>
            {[0, 2, 4].map((startIdx) => (
              <div key={startIdx} style={styles.categoriesRow}>
                {CATEGORIES.slice(startIdx, startIdx + 2).map((cat) => (
                  <button
                    key={cat.id}
                    style={{
                      ...styles.categoryButton,
                      border: form.category === cat.name ? '2px solid #7334EA' : 'none',
                    }}
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    <img src={cat.icon} alt={cat.name} style={styles.categoryIcon} />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            ))}
            {errors.category && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.category}</div>}
          </div>

          <Input
            label="Дата"
            type="text"
            name="date"
            value={form.date}
            onChange={handleChange}
            placeholder="ДД.ММ.ГГГГ"
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

          <button style={{ ...styles.button, marginTop: '24px' }} onClick={handleAdd}>
            Добавить новый расход
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '1440px',
    margin: '0 auto',
    minHeight: '100vh',
    position: 'relative',
  },
  pageTitle: {
    position: 'absolute',
    top: '100px',
    left: '120px',
    width: '233px',
    height: '48px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '32px',
    lineHeight: '150%',
    letterSpacing: '0px',
    color: '#000000',
    margin: 0,
  },
  leftTable: {
    position: 'absolute',
    top: '180px',
    left: '118px',
    width: '789px',
    height: '618px',
  },
  tableCard: {
    width: '789px',
    height: '618px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    padding: '32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  tableTitle: {
    width: '238px',
    height: '29px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    textAlign: 'center',
    color: '#000000',
    marginLeft: '0',
    marginBottom: '24px',
  },
  headerRow: {
    display: 'flex',
    gap: '32px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '100%',
    color: '#999999',
    borderBottom: '1px solid #EEEEEE',
    paddingBottom: '8px',
    marginBottom: '8px',
  },
  tableBody: {
    flex: 1,
    overflowY: 'auto',
  },
  row: {
    display: 'flex',
    gap: '32px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '14px',
    color: '#000000',
    padding: '10px 0',
  },
  rightTable: {
    position: 'absolute',
    top: '180px',
    left: '941px',
    width: '379px',
    height: '618px',
  },
  formCard: {
    width: '379px',
    height: '618px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    padding: '32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    width: '186px',
    height: '29px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '700',
    fontSize: '24px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
    textAlign: 'center',
    margin: '0 auto 24px auto',
    marginLeft: '0',
  },
  categoryLabel: {
    width: '313px',
    height: '20px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
    marginBottom: '8px',
    display: 'block',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '0',
  },
  label: {
    width: '313px',
    height: '20px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
  },
  input: {
    width: '100%',
    height: '39px',
    padding: '12px',
    fontSize: '14px',
    border: '0.5px solid #999999',
    borderRadius: '6px',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  },
  categoriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '277px',
  },
  categoriesRow: {
    display: 'flex',
    gap: '6px',
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 20px',
    backgroundColor: '#F4F5F6',
    borderRadius: '30px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '100%',
    letterSpacing: '0px',
    color: '#000000',
    textAlign: 'center',
  },
  categoryIcon: {
    width: '20px',
    height: '20px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#7334EA',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Home;