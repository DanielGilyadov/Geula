// columns.js
import { Button, Checkbox } from 'antd';
import { HDate } from '@hebcal/core'; // Правильный импорт
import moment from 'moment';

const columns = (onEdit) => [
  
  { title: 'Имя', dataIndex: 'firstName', key: 'firstName', editable: true },
  { title: 'Фамилия', dataIndex: 'lastName', key: 'lastName', editable: true },
  { title: 'Отчество', dataIndex: 'fatherName', key: 'fatherName', editable: true },
  { title: 'Номер телефона', dataIndex: 'mobileNumber', key: 'mobileNumber', editable: true },
  { title: 'Email', dataIndex: 'email', key: 'email', editable: true },
  { title: 'Дата рождения', dataIndex: 'birthDate', key: 'birthDate', editable: true },
  {
    title: 'Еврейская дата',
    dataIndex: 'birthDate',
    key: 'hebrewDate',
    render: (date) => {
      if (!date) return '—'; // Если даты нет, показываем прочерк

      const parsedDate = moment(date, 'YYYY.MM.DD'); // Разбираем строку с датой
      if (!parsedDate.isValid()) return 'Неверная дата'; // Проверяем валидность

      const hebrewDate = new HDate(parsedDate.toDate()); // Преобразуем в еврейскую дату
      return hebrewDate.toString(); // Выводим дату в формате "1 Нисан 5784"
    },
  },
  {
    title: 'Редактировать',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => onEdit(record)} type="primary">Редактировать</Button>
    )
  },
    // {
  //   title: 'Важная дата',
  //   dataIndex: 'importantDate',
  //   key: 'importantDate',
  //   editable: true,
  //   render: (date) => (date ? date : '—'),
  // },
  // Колонка с еврейской датой
  // { title: 'Описание даты', dataIndex: 'importantDateDiscription', key: 'importantDateDiscription', editable: true },
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
];

export default columns;
