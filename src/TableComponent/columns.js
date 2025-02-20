import { Button, Input, DatePicker } from 'antd';
import { HDate } from '@hebcal/core';
import moment from 'moment';

const columns = ({ editingKey, setEditingKey, onSave, onChange }) => [
  {
    title: 'Имя',
    dataIndex: 'firstName',
    key: 'firstName',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <Input 
          defaultValue={text} // Используем defaultValue, а не value
          onChange={(e) => onChange(record.key, 'firstName', e.target.value)} 
          style={{ width: 120 }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Фамилия',
    dataIndex: 'lastName',
    key: 'lastName',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <Input 
          defaultValue={text} 
          onChange={(e) => onChange(record.key, 'lastName', e.target.value)} 
          style={{ width: 150 }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Отчество',
    dataIndex: 'fatherName',
    key: 'fatherName',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <Input 
          defaultValue={text} 
          onChange={(e) => onChange(record.key, 'fatherName', e.target.value)} 
          style={{ width: 150 }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Номер телефона',
    dataIndex: 'mobileNumber',
    key: 'mobileNumber',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <Input 
          defaultValue={text} 
          onChange={(e) => onChange(record.key, 'mobileNumber', e.target.value)} 
          style={{ width: 120 }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <Input 
          defaultValue={text} 
          onChange={(e) => onChange(record.key, 'email', e.target.value)} 
          style={{ width: 250 }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Дата рождения',
    dataIndex: 'birthDate',
    key: 'birthDate',
    editable: true,
    render: (text, record) =>
      editingKey === record.key ? (
        <DatePicker
          defaultValue={text ? moment(text, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => onChange(record.key, 'birthDate', dateString)}
          format="YYYY-MM-DD"
          style={{ width: 150 }}
          placeholder="Выберите дату"
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Еврейская дата',
    dataIndex: 'birthDate',
    key: 'hebrewDate',
    render: (date) => {
      if (!date) return '—';
      const parsedDate = moment(date, 'YYYY-MM-DD');
      if (!parsedDate.isValid()) return 'Неверная дата';
      return new HDate(parsedDate.toDate()).toString();
    },
  },
  {
    title: '',
    key: 'action',
    render: (_, record) => {
      const isEditing = editingKey === record.key;
      return isEditing ? (
        <Button 
          type="primary" 
          onClick={() => { 
            onSave(record.key); 
            setEditingKey(null); // Завершаем редактирование 
          }} 
          style={{ width: 120 }}
        >
          Сохранить
        </Button>
      ) : (
        <Button 
          type="primary" 
          onClick={() => setEditingKey(record.key)} 
          style={{ width: 120 }}
        >
          Редактировать
        </Button>
      );
    },
  },
];

export default columns;
