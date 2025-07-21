import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Checkbox } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import columns from './columns';
import ExpandedRow from './ExpandedRow';
import SearchFilters from './SearchFilters';
import { updateUser } from '../api';
import './Table.css';


const TableComponent = ({ people, setPeople }) => {
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
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
