import api from './api';


const STORAGE_KEY = 'expenses';

const localStorageAPI = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  add: (newExpense) => {
    const current = localStorageAPI.getAll();
    const updated = [newExpense, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
  remove: (id) => {
    const current = localStorageAPI.getAll();
    const updated = current.filter(exp => exp.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};


const categoryMap = {
  'Еда': 'food',
  'Транспорт': 'transport',
  'Жилье': 'housing',
  'Развлечения': 'joy',
  'Образование': 'education',
  'Другое': 'others',
};


const reverseCategoryMap = {
  'food': 'Еда',
  'transport': 'Транспорт',
  'housing': 'Жилье',
  'joy': 'Развлечения',
  'education': 'Образование',
  'others': 'Другое',
};

const formatDateForAPI = (dateStr) => {
  const [day, month, year] = dateStr.split('.');
  return `${month}-${day}-${year}`;
};

const formatDateFromAPI = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};



export const transactionsApi = {
  
  getAll: async () => {
    try {
      const response = await api.get('/transactions');
      const transactions = response.data.map(tx => ({
        id: tx._id,
        description: tx.description,
        category: reverseCategoryMap[tx.category] || tx.category,
        date: formatDateFromAPI(tx.date),
        amount: tx.sum,
      }));
      return transactions;
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error);
      return [];
    }
  },

 
  add: async (newExpense) => {
    try {
      const response = await api.post('/transactions', {
        description: newExpense.description,
        sum: newExpense.amount,
        category: categoryMap[newExpense.category] || newExpense.category,
        date: formatDateForAPI(newExpense.date),
      });
      
      
      const transactions = response.data.map(tx => ({
        id: tx._id,
        description: tx.description,
        category: reverseCategoryMap[tx.category] || tx.category,
        date: formatDateFromAPI(tx.date),
        amount: tx.sum,
      }));
      return transactions;
    } catch (error) {
      console.error('Ошибка добавления транзакции:', error);
      
      return localStorageAPI.add(newExpense);
    }
  },

 
  remove: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      const transactions = response.data.map(tx => ({
        id: tx._id,
        description: tx.description,
        category: reverseCategoryMap[tx.category] || tx.category,
        date: formatDateFromAPI(tx.date),
        amount: tx.sum,
      }));
      return transactions;
    } catch (error) {
      console.error('Ошибка удаления транзакции:', error);
      return localStorageAPI.remove(id);
    }
  },

 
  getByPeriod: async (startDate, endDate) => {
    try {
      const start = formatDateForAPI(startDate);
      const end = formatDateForAPI(endDate);
      const response = await api.post('/transactions/period', { start, end });
      const transactions = response.data.map(tx => ({
        id: tx._id,
        description: tx.description,
        category: reverseCategoryMap[tx.category] || tx.category,
        date: formatDateFromAPI(tx.date),
        amount: tx.sum,
      }));
      return transactions;
    } catch (error) {
      console.error('Ошибка загрузки транзакций за период:', error);
      return [];
    }
  },
};


export const legacyTransactionsApi = localStorageAPI;