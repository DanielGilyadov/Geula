import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Checkbox } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import columns from './columns';
import ExpandedRow from './ExpandedRow';
import SearchFilters from './SearchFilters';
import { updateUser } from '../api';
import { HDate, HebrewCalendar } from 'hebcal';
import moment from 'moment';


const TableComponent = ({ people, setPeople, addNotification }) => {
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // 📌 Храним ID пользователей, для которых уже отправлены уведомления
  const notifiedUsersRef = useRef(new Set());

  useEffect(() => {
    const todayJewishDate = new HDate(); // Текущая еврейская дата
  
    people.forEach((person) => {
      if (!person.birthDate || notifiedUsersRef.current.has(person.id)) return;
  
      // Переводим дату рождения в еврейский календарь
      const jewishBirthDate = new HDate(moment(person.birthDate, 'YYYY-MM-DD').toDate());
  
      // Вычисляем возраст в еврейском календаре
      const jewishAge = todayJewishDate.getFullYear() - jewishBirthDate.getFullYear();
  
      // Проверяем, что пользователю ровно 12 лет (перед Бар-Мицвой)
      if (jewishAge !== 12) return;
  
      // Дата Бар-Мицвы (через 13 лет по еврейскому календарю)
      const barMitzvahDate = new HDate(jewishBirthDate.getDate(), jewishBirthDate.getMonth(), jewishBirthDate.getFullYear() + 13);
  
      // Дата начала уведомления (за 6 месяцев до Бар-Мицвы)
      let notifyDateYear = barMitzvahDate.getFullYear();
      let notifyDateMonth = barMitzvahDate.getMonth() - 6;
  
      // Если месяц стал < 1 (января не бывает в еврейском календаре), переносим на предыдущий год
      if (notifyDateMonth < 1) {
        notifyDateYear -= 1;
        notifyDateMonth += 12; // Сдвигаем назад на 12 месяцев
        if (HebrewCalendar.isJewishLeapYear(notifyDateYear)) {
          notifyDateMonth += 1; // Если новый год високосный, учитываем 13-й месяц
        }
      }
  
      const notifyDate = new HDate(barMitzvahDate.getDate(), notifyDateMonth, notifyDateYear);
  debugger
      // Если сегодня еврейская дата совпадает или больше даты начала уведомления, отправляем уведомление
      if (todayJewishDate >= notifyDate) {
        addNotification(
          `${person.firstName} достигнет Бар-Мицвы через 6 месяцев!`
        );
        notifiedUsersRef.current.add(person.id);
      }
    });
  }, [people, addNotification]);
  
  const onSave = async (key) => {
    const updatedUser = people.find((p) => p.id === key);
    if (!updatedUser) return;

    try {
      await updateUser(updatedUser);
      setPeople([...people]);
      setEditingKey(null);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  const onChange = (key, field, value) => {
    setPeople((prev) =>
      prev.map((item) => {
        if (item.id === key) {
          const updatedItem = { ...item };
          const keys = field.split('.');
          if (keys.length > 1) {
            updatedItem[keys[0]] = { ...updatedItem[keys[0]], [keys[1]]: value };
          } else {
            updatedItem[field] = value;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const onSelectAll = (checked) => {
    setSelectAll(checked);
    setSelectedRowKeys(checked ? filteredPeople.map((p) => p.id) : []);
  };

  const onSelectRow = (key, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, key] : prev.filter((id) => id !== key)
    );
  };

  const handleExport = () => {
    if (selectedRowKeys.length === 0) {
      alert('Выберите хотя бы одну строку для выгрузки.');
      return;
    }
    
    const selectedData = filteredPeople
      .filter((p) => selectedRowKeys.includes(p.id))
      .map(({ id, firstName, lastName, fatherName, birthDate, mobileNumber, email }) => ({
        'Имя': firstName,
        'Фамилия': lastName,
        'Отчество': fatherName,
        'Дата рождения': birthDate,
        'Телефон': mobileNumber,
        'Email': email,
      }));

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');
    XLSX.writeFile(workbook, 'выгрузка.xlsx');
  };

  const modifiedColumns = [
    {
      title: <Checkbox checked={selectAll} onChange={(e) => onSelectAll(e.target.checked)} />, 
      dataIndex: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => onSelectRow(record.id, e.target.checked)}
        />
      ),
    },
    ...columns({ editingKey, setEditingKey, onSave, onChange, people: people || [] }),
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <SearchFilters people={people} setFilteredPeople={setFilteredPeople} />
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
          Выгрузить
        </Button>
      </div>
      <Table
        dataSource={filteredPeople.map((p, index) => ({ ...p, key: p.id || index }))}
        columns={modifiedColumns}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => (
            <ExpandedRow record={record} isEditing={editingKey === record.key} onChange={onChange} />
          ),
        }}
      />
    </>
  );
};

export default TableComponent;
