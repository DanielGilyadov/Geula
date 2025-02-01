// columns.js
import { Button, Checkbox } from 'antd';

const columns = (onEdit) => [
  { title: 'Имя', dataIndex: 'name', key: 'name', editable: true },
  { title: 'Фамилия', dataIndex: 'familyName', key: 'familyName', editable: true },
  { title: 'Отчество', dataIndex: 'fathersName', key: 'fathersName', editable: true },
  { title: 'Возраст', dataIndex: 'age', key: 'age', editable: true },
  { title: 'Важная дата', dataIndex: 'importantDate', key: 'importantDate', editable: true },
  { title: 'Описание даты', dataIndex: 'importantDateDiscription', key: 'importantDateDiscription', editable: true },
  { 
    title: 'Наличие тфилина', 
    dataIndex: 'tfilin', 
    key: 'tfilin', 
    editable: true, 
    render: (tfilin) => (
      <Checkbox checked={tfilin}>{tfilin ? 'Есть' : 'Нет'}</Checkbox>
    )
  },
  { 
    title: 'Учавствовал в семинарах', 
    dataIndex: 'student', 
    key: 'student', 
    editable: true, 
    render: (student) => (
      <Checkbox checked={student}>{student ? 'Да' : 'Нет'}</Checkbox>
    )
  },
  { 
    title: 'Соблюдает шаббат', 
    dataIndex: 'shabbat', 
    key: 'shabbat', 
    editable: true, 
    render: (shabbat) => (
      <Checkbox checked={shabbat}>{shabbat ? 'Да' : 'Нет'}</Checkbox>
    )
  },
  { 
    title: 'Редактировать', 
    key: 'action', 
    render: (_, record) => (
      <Button onClick={() => onEdit(record)} type="primary">Редактировать</Button>
    )
  },
];

export default columns;
