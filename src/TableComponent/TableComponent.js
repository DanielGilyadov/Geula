import React, { useState, useEffect } from 'react';
import { Table, Input, Select } from 'antd';
import columns from './columns';
import ExpandedRow from './ExpandedRow';

const { Option } = Select;

const TableComponent = ({ people, setPeople }) => {
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    filterData(searchText, selectedCity);
  }, [people, searchText, selectedCity]);

  const uniqueCities = [...new Set(people.map((p) => p.address?.city).filter(Boolean))];

  const filterData = (search, city) => {
    let filteredData = [...people];

    if (search) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (city && city !== 'all') {
      filteredData = filteredData.filter((item) => item.address?.city === city);
    }

    setFilteredPeople(filteredData);
  };

  const onSave = (key) => {
    setEditingKey(null);
    setPeople([...people]); // Обновляем состояние, чтобы изменения сохранились
  };

  const onChange = (key, field, value) => {
    setPeople((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          // Разбираем вложенные ключи (например, 'address.city')
          const keys = field.split('.');
          if (keys.length > 1) {
            return {
              ...item,
              [keys[0]]: {
                ...item[keys[0]], // Копируем текущий объект address
                [keys[1]]: value, // Обновляем конкретное поле (city)
              },
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
        <Input
          placeholder="Поиск..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Выберите город"
          onChange={setSelectedCity}
          value={selectedCity}
          allowClear
          style={{ width: 200 }}
        >
          <Option value="all">Все города</Option>
          {uniqueCities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </div>
      
      <Table
  dataSource={filteredPeople.map((p, index) => ({ ...p, key: p.id || index }))}
  columns={columns({ editingKey, setEditingKey, onSave, onChange, people: people || [] })} // Добавил `|| []`
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