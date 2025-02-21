import React, { useState, useEffect } from 'react';
import { Table, Input, Select } from 'antd';
import columns from './columns';
import ExpandedRow from './ExpandedRow';
import { updateUser } from '../api';
import styles from './TableComponent.module.css';

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

  const onSave = async (key) => {
    const updatedUser = people.find((p) => p.id === key);

    debugger
    if (!updatedUser) return;

    try {
      // Отправляем изменения на сервер
      await updateUser(
        updatedUser.id,
        updatedUser.firstName,
        updatedUser.lastName,
        updatedUser.fatherName,
        updatedUser.birthDate,
        updatedUser.mobileNumber,
        updatedUser.email,
        updatedUser.gender,
        updatedUser.address.city,
        updatedUser.address.metroStation,
        updatedUser.address.street,
        updatedUser.address.houseNumber,
        updatedUser.address.entrance,
        updatedUser.address.apartment,
        updatedUser.address.floor,
        updatedUser.religiousInfo.hasTT,
        updatedUser.religiousInfo.isInNeed,
        updatedUser.religiousInfo.passover,
        updatedUser.religiousInfo.keepsKosher,
        updatedUser.religiousInfo.childrenCamp,
        updatedUser.religiousInfo.keepsSabbath,
        updatedUser.religiousInfo.hasCommunityBooks,
        updatedUser.religiousInfo.seminarParticipant,

      );

      // Обновляем состояние только после успешного ответа
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

          // Разбираем вложенные ключи (например, 'address.city')
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