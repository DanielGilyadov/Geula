import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddPerson from './AddPerson';
import TableComponent from './TableComponent/TableComponent';
import LayoutComponent from './LayoutComponent';
import { getUsers, getNotifications, getDates } from './api';
import './App.css';

const App = () => {
  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        const noti = await getNotifications();
        const fetchedDates = await getDates();
        setPeople(users || []);
        setNotifications(noti || []);
        setDates(fetchedDates || {});
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <LayoutComponent
      notifications={notifications}
      dates={dates}
      isDropdownVisible={isDropdownVisible}
      setIsDropdownVisible={setIsDropdownVisible}
    >
      <Routes>
        <Route
          path="/"
          element={
            <TableComponent
              people={people}
              setPeople={setPeople}
              searchText={searchText}
              setSearchText={setSearchText}
              expandedRowKeys={expandedRowKeys}
              setExpandedRowKeys={setExpandedRowKeys}
            />
          }
        />
        <Route path="/add" element={<AddPerson addPerson={(newPerson) => setPeople((prev) => [...prev, newPerson])} />} />
      </Routes>
    </LayoutComponent>
  );
};

export default App;
