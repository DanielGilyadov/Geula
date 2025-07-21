import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddPerson from './AddPerson';
import TableComponent from './TableComponent/TableComponent';
import LayoutComponent from './LayoutComponent';
import { useApp } from './context/AppContext';
import './App.css';

const App = () => {
  const { notifications, dates } = useApp();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <LayoutComponent
      notifications={notifications}
      dates={dates}
      isDropdownVisible={isDropdownVisible}
      setIsDropdownVisible={setIsDropdownVisible}
    >
      <Routes>
        <Route path="/" element={<TableComponent />} />
        <Route path="/add" element={<AddPerson />} />
      </Routes>
    </LayoutComponent>
  );
};

export default App;