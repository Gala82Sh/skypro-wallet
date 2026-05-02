import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Register from './pages/Register';
import Login from './pages/Login';
import AddExpense from './pages/AddExpense';  
import AnalyticsMobile from './pages/AnalyticsMobile';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/analytics-mobile" element={<AnalyticsMobile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/add-expense" element={<AddExpense />} />  {}
      </Routes>
    </BrowserRouter>
  );
}

export default App;