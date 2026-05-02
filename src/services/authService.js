const USERS_KEY = 'skypro_wallet_users';
const CURRENT_USER_KEY = 'skypro_wallet_current_user';


const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};


const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};


export const register = (name, email, password) => {
  const users = getUsers();
  
 
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    throw new Error('Пользователь с такой почтой уже существует');
  }
  
 
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, 
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Регистрация успешна' };
};


export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Неверная почта или пароль');
  }
  
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return { success: true, user };
};


export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};


export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};


export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};