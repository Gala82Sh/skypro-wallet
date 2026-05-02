export const CATEGORIES = [
  {
    id: 'food',
    name: 'Еда',
    icon: '/image/food.svg',
    color: '#D9B6FF',
  },
  {
    id: 'transport',
    name: 'Транспорт',
    icon: '/image/car.svg',
    color: '#FFB53D',
  },
  {
    id: 'housing',
    name: 'Жилье',
    icon: '/image/house.svg',
    color: '#6EE4FE',
  },
  {
    id: 'entertainment',
    name: 'Развлечения',
    icon: '/image/entert.svg',
    color: '#B0AEFF',
  },
  {
    id: 'education',
    name: 'Образование',
    icon: '/image/school.svg',
    color: '#BCEC30',
  },
  {
    id: 'other',
    name: 'Другое',
    icon: '/image/other.svg',
    color: '#FFB9B8',
  },
];

export const CATEGORY_NAMES = CATEGORIES.map(cat => cat.name);

export const CATEGORY_COLORS = CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = cat.color;
  return acc;
}, {});