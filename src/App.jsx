import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import { Button, Input } from './components/common';

function Home() {
  return (
    <div>
      <h2>Главная страница</h2>
      <p>Здесь будет таблица расходов</p>
      <Button variant="primary" onClick={() => alert('Добавить расход')}>
        Добавить расход
      </Button>
    </div>
  );
}

function Login() {
  return (
    <div>
      <h2>Вход в аккаунт</h2>
      <Input label="Email" type="email" placeholder="example@mail.com" />
      <Input label="Пароль" type="password" placeholder="••••••••" />
      <Button variant="primary" onClick={() => alert('Вход')}>
        Войти
      </Button>
    </div>
  );
}

function Register() {
  return (
    <div>
      <h2>Регистрация</h2>
      <Input label="Имя" placeholder="Иван" />
      <Input label="Email" type="email" placeholder="example@mail.com" />
      <Input label="Пароль" type="password" placeholder="••••••••" />
      <Button variant="primary" onClick={() => alert('Регистрация')}>
        Зарегистрироваться
      </Button>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <h2>Аналитика</h2>
      <p>Здесь будут календарь и диаграмма</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;