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
      editingKey === record.id ? (
        <Input 
          value={record.firstName || ''} // Используем value вместо defaultValue
          onChange={(e) => onChange(record.id, 'firstName', e.target.value)} 
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
      editingKey === record.id ? (
        <Input 
          value={record.lastName || ''}
          onChange={(e) => onChange(record.id, 'lastName', e.target.value)} 
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
      editingKey === record.id ? (
        <Input 
          value={record.fatherName || ''}
          onChange={(e) => onChange(record.id, 'fatherName', e.target.value)} 
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
      editingKey === record.id ? (
        <Input 
          value={record.mobileNumber || ''}
          onChange={(e) => onChange(record.id, 'mobileNumber', e.target.value)} 
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
      editingKey === record.id ? (
        <Input 
          value={record.email || ''}
          onChange={(e) => onChange(record.id, 'email', e.target.value)} 
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
      editingKey === record.id ? (
        <DatePicker
          value={record.birthDate ? moment(record.birthDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => onChange(record.id, 'birthDate', dateString)}
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
      const isEditing = editingKey === record.id;
      return isEditing ? (
        <Button 
          type="primary" 
          onClick={() => { 
            onSave(record.id); 
          }} 
          style={{ width: 120 }}
        >
          Сохранить
        </Button>
      ) : (
        <Button 
          type="primary" 
          onClick={() => setEditingKey(record.id)} 
          style={{ width: 120 }}
        >
          Редактировать
        </Button>
      );
    },
  },
];

export default columns;
