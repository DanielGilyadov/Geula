import React from 'react';
import { Table, Input } from 'antd';
import columns from './columns';
import ExpandedRow from './ExpandedRow';

const TableComponent = ({ people, setPeople, onEdit, searchText, setSearchText, expandedRowKeys, setExpandedRowKeys }) => {
  
  const handleSearch = (value) => {
    const filteredData = people.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchText(value);
    setPeople(filteredData);
  };

  return (
    <>
      <Input
        placeholder="Поиск..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={people.map((p, index) => ({ ...p, key: p.id || index }))}
        columns={columns(onEdit)}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <ExpandedRow record={record} />, 
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter(key => key !== record.key));
          },
        }}
      />
    </>
  );
};

export default TableComponent;