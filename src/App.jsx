import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';

function Login() {
  return <div style={{ padding: '20px' }}>Страница входа</div>;
}

function Register() {
  return <div style={{ padding: '20px' }}>Страница регистрации</div>;
}

function Analytics() {
  return <div style={{ padding: '20px' }}>Страница аналитики</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
