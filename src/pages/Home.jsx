import { Table, Button } from '../components/common';


const mockData = [
  { id: 1, date: '2026-04-29', category: 'Еда', amount: 500, description: 'Обед' },
  { id: 2, date: '2026-04-28', category: 'Транспорт', amount: 300, description: 'Такси' },
  { id: 3, date: '2026-04-27', category: 'Развлечения', amount: 1000, description: 'Кино' },
  { id: 4, date: '2026-04-26', category: 'Еда', amount: 350, description: 'Ужин' },
  { id: 5, date: '2026-04-25', category: 'Связь', amount: 600, description: 'Интернет' },
];


const columns = [
  { title: 'Дата', field: 'date' },
  { title: 'Категория', field: 'category' },
  { title: 'Сумма', field: 'amount' },
  { title: 'Описание', field: 'description' },
];

function Home() {
  return (
    <div>
      <h2>Главная страница</h2>
      <p>Таблица расходов</p>
      
      <Button variant="primary" onClick={() => alert('Добавить расход')}>
        Добавить расход
      </Button>
      
      <Table data={mockData} columns={columns} />
    </div>
  );
}

export default Home;