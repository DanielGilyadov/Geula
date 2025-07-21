import React, { useState, useEffect } from 'react';
import { Table, Button, Checkbox, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import columns from './columns';
import ExpandedRow from './ExpandedRow';
import SearchFilters from './SearchFilters';
import './Table.css';

const TableComponent = () => {
  const { people, updatePerson, updatePersonLocally, loading } = useApp();
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [editingKey, setEditingKey] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Обновляем filteredPeople при изменении people
  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);
  
  const onSave = async (key) => {
    const updatedUser = people.find((p) => p.id === key);
    if (!updatedUser) return;

    try {
      await updatePerson(updatedUser);
      setEditingKey(null);
    } catch (error) {
      // Ошибка уже обработана в Context
      console.error('Ошибка при сохранении:', error);
    }
  };

  const onChange = (key, field, value) => {
    updatePersonLocally(key, field, value);
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
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => onSelectRow(record.id, e.target.checked)}
        />
      ),
    },
    ...columns({ editingKey, setEditingKey, onSave, onChange, people }),
  ];

  return (
    <Spin spinning={loading.people}>
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
    </Spin>
  );
};

export default TableComponent;