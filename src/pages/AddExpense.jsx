import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import Input from '../components/common/Input';
import styles from './AddExpense.module.css';

function AddExpense() {
    const navigate = useNavigate();
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

    const handleSubmit = () => {
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

        const savedExpenses = localStorage.getItem('expenses');
        const currentExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];

        const newExpense = {
            id: Date.now(),
            description: form.description.trim(),
            category: form.category,
            date: form.date,
            amount: amountNum,
        };

        const updatedExpenses = [newExpense, ...currentExpenses];
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

        navigate('/');
    };

    return (
        <div className={styles.page}>
            <div className={styles.navBack}>
                <Link to="/" className={styles.backLink}>
                    <img
                        src="/image/Vector-new.svg"
                        alt="Назад"
                        className={styles.backIcon}
                    />
                    <span className={styles.backText}>Мои расходы</span>
                </Link>
            </div>

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

                <button className={styles.button} onClick={handleSubmit}>
                    Добавить новый расход
                </button>
            </div>
        </div>
    );
}

export default AddExpense;
