import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AddPerson from './AddPerson';
import TableComponent from './TableComponent/TableComponent';
import { getUserByChatId } from './api';
import './App.css'; // Подключаем стили

const { Content, Footer, Header } = Layout;

const App = () => {
  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editingPerson, setEditingPerson] = useState(null);
  const location = useLocation();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUserByChatId();
        if (users) {
          setPeople(users);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchUser();
  }, []);

  const addPerson = (newPerson) => {
    const maxId = people.length > 0 ? Math.max(...people.map(p => p.key)) : 0;
    const personWithId = { ...newPerson, key: maxId + 1 };
    setPeople((prevPeople) => [...prevPeople, personWithId]);
  };



  return (
    <Layout>
      <Header className="header-menu">
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <Link to="/">Главная</Link>
          </Menu.Item>
          <Menu.Item key="/add">
           <Link to="/add">Добавить</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
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
          <Route path="/add" element={<AddPerson addPerson={addPerson} />} />
        </Routes>

      </Content>
      <Footer style={{ textAlign: 'center' }}>Metavision ©2025</Footer>
    </Layout>
  );
};

export default App;
