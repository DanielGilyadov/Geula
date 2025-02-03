// columns.js
import { Button, Checkbox } from 'antd';
import { HDate } from '@hebcal/core'; // Правильный импорт
import moment from 'moment';

const columns = (onEdit) => [
  { title: 'Имя', dataIndex: 'name', key: 'name', editable: true },
  { title: 'Фамилия', dataIndex: 'familyName', key: 'familyName', editable: true },
  { title: 'Отчество', dataIndex: 'fathersName', key: 'fathersName', editable: true },
  { title: 'Возраст', dataIndex: 'age', key: 'age', editable: true },
  {
    title: 'Важная дата',
    dataIndex: 'importantDate',
    key: 'importantDate',
    editable: true,
    render: (date) => (date ? date : '—'),
  },
  // Колонка с еврейской датой
  {
    title: 'Еврейская дата',
    dataIndex: 'importantDate',
    key: 'hebrewDate',
    render: (date) => {
      if (!date) return '—'; // Если даты нет, показываем прочерк

      const parsedDate = moment(date, 'DD.MM.YYYY'); // Разбираем строку с датой
      if (!parsedDate.isValid()) return 'Неверная дата'; // Проверяем валидность

      const hebrewDate = new HDate(parsedDate.toDate()); // Преобразуем в еврейскую дату
      return hebrewDate.toString(); // Выводим дату в формате "1 Нисан 5784"
    },
  },
  { title: 'Описание даты', dataIndex: 'importantDateDiscription', key: 'importantDateDiscription', editable: true },
  // {
  //   title: 'Наличие тфилина',
  //   dataIndex: 'tfilin',
  //   key: 'tfilin',
  //   editable: true,
  //   render: (tfilin) => (
  //     <Checkbox checked={tfilin}>{tfilin ? 'Есть' : 'Нет'}</Checkbox>
  //   )
  // },
  // {
  //   title: 'Учавствовал в семинарах',
  //   dataIndex: 'student',
  //   key: 'student',
  //   editable: true,
  //   render: (student) => (
  //     <Checkbox checked={student}>{student ? 'Да' : 'Нет'}</Checkbox>
  //   )
  // },
  // {
  //   title: 'Соблюдает шаббат',
  //   dataIndex: 'shabbat',
  //   key: 'shabbat',
  //   editable: true,
  //   render: (shabbat) => (
  //     <Checkbox checked={shabbat}>{shabbat ? 'Да' : 'Нет'}</Checkbox>
  //   )
  // },
  {
    title: 'Редактировать',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => onEdit(record)} type="primary">Редактировать</Button>
    )
  },
];

export default columns;
