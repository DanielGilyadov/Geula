import { Button, Input, DatePicker } from 'antd';
import { HDate } from '@hebcal/core';
import moment from 'moment';

const columns = ({ editingKey, setEditingKey, onSave, onChange }) => [
  {
    title: 'Имя',
    dataIndex: 'firstName',
    key: 'firstName',
    width: 150,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <Input 
          value={record.firstName || ''} 
          onChange={(e) => onChange(record.id, 'firstName', e.target.value)} 
          style={{ width: '100%' }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Фамилия',
    dataIndex: 'lastName',
    key: 'lastName',
    width: 150,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <Input 
          value={record.lastName || ''}
          onChange={(e) => onChange(record.id, 'lastName', e.target.value)} 
          style={{ width: '100%' }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Отчество',
    dataIndex: 'fatherName',
    key: 'fatherName',
    width: 150,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <Input 
          value={record.fatherName || ''}
          onChange={(e) => onChange(record.id, 'fatherName', e.target.value)} 
          style={{ width: '100%' }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Номер телефона',
    dataIndex: 'mobileNumber',
    key: 'mobileNumber',
    width: 150,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <Input 
          value={record.mobileNumber || ''}
          onChange={(e) => onChange(record.id, 'mobileNumber', e.target.value)} 
          style={{ width: '100%' }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <Input 
          value={record.email || ''}
          onChange={(e) => onChange(record.id, 'email', e.target.value)} 
          style={{ width: '100%' }} 
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Дата рождения',
    dataIndex: 'birthDate',
    key: 'birthDate',
    width: 140,
    editable: true,
    render: (text, record) =>
      editingKey === record.id ? (
        <DatePicker
          value={record.birthDate ? moment(record.birthDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => onChange(record.id, 'birthDate', dateString)}
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          placeholder="Выберите дату"
        />
      ) : (
        text || '—'
      ),
  },
  {
    title: 'Возраст',
    dataIndex: 'age',
    key: 'age',
    align: 'center',
    width: 50,
    render: (_, record) => {
      if (!record.birthDate || typeof record.birthDate !== 'string') return '—';
      const birthMoment = moment(record.birthDate, 'YYYY-MM-DD');
      if (!birthMoment.isValid()) return '—';
      return moment().diff(birthMoment, 'years');
    },
  },  
  {
    title: 'Еврейская дата',
    dataIndex: 'hebrewDate',
    key: 'hebrewDate',
    width: 140,
    render: (_, record) => {
      if (!record.birthDate) return '—';
      try {
        const parsedDate = moment(record.birthDate, 'YYYY-MM-DD');
        if (!parsedDate.isValid()) return '—';
        const jsDate = parsedDate.toDate();
        const hdate = new HDate(jsDate);
        return hdate.toString('h');
      } catch (error) {
        console.error('Ошибка при конвертации даты:', error);
        return '—';
      }
    },
  },  
  {
    title: 'Город',
    dataIndex: ['address', 'city'],
    key: 'city',
    width: 150,
    render: (text) => text || '—',
  },
  {
    title: '',
    key: 'action',
    width: 140,
    fixed: 'right',
    render: (_, record) => {
      const isEditing = editingKey === record.id;
      return isEditing ? (
        <Button 
          type="primary" 
          onClick={() => { 
            onSave(record.id); 
          }} 
          style={{ width: '100%' }}
        >
          Сохранить
        </Button>
      ) : (
        <Button 
          type="primary" 
          onClick={() => setEditingKey(record.id)} 
          style={{ width: '100%' }}
        >
          Редактировать
        </Button>
      );
    },
  },
];

export default columns;