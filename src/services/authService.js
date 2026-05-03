const USERS_KEY = 'skypro_wallet_users';
const CURRENT_USER_KEY = 'skypro_wallet_current_user';

import api from './api';

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



export const registerAPI = async (login, password, name) => {
  try {
    const response = await fetch('https://wedev-api.sky.pro/api/user', {
      method: 'POST',
      headers: {}, 
      body: JSON.stringify({ login, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }

    const { user } = data;
    if (user?.token) {
      localStorage.setItem('skypro_wallet_token', user.token);
      localStorage.setItem('skypro_wallet_user', JSON.stringify(user));
    }
    return { success: true, user };
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw new Error(error.message);
  }
};

export const loginAPI = async (login, password) => {
  try {
    const response = await fetch('https://wedev-api.sky.pro/api/user/login', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Неверный логин или пароль');
    }

    const { user } = data;
    if (user?.token) {
      localStorage.setItem('skypro_wallet_token', user.token);
      localStorage.setItem('skypro_wallet_user', JSON.stringify(user));
    }
    return { success: true, user };
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw new Error(error.message);
  }
};
export const logoutAPI = () => {
  localStorage.removeItem('skypro_wallet_token');
  localStorage.removeItem('skypro_wallet_user');
};

export const getCurrentUserAPI = () => {
  const user = localStorage.getItem('skypro_wallet_user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticatedAPI = () => {
  return !!localStorage.getItem('skypro_wallet_token');
};