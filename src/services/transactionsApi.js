const STORAGE_KEY = 'expenses';

export const transactionsApi = {

  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  add: (newExpense) => {
    const current = transactionsApi.getAll();
    const updated = [newExpense, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

 
  remove: (id) => {
    const current = transactionsApi.getAll();
    const updated = current.filter(exp => exp.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
