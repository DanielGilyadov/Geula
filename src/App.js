import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Dropdown, Card } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AddPerson from './AddPerson';
import TableComponent from './TableComponent/TableComponent';
import Notifications from './Notifications';
import { getUsers, getNotifications, getDates } from './api';
import './App.css';

const { Content, Footer, Header } = Layout;

const App = () => {
  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dates, setDates] = useState([])
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers();
        const noti = await getNotifications();
        const dates = await getDates();
        if (users) {
          setPeople(users);
        }
        if (noti) {
          setNotifications(noti);
        }
        if(dates){
          setDates(dates)
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };
    fetchUser();
  }, []);

  const addPerson = (newPerson) => {
    setPeople((prevPeople) => [...prevPeople, newPerson]);
  };

  const notificationMenu = (
    <Card className="notification-dropdown">
      <Notifications notifications={notifications} />
    </Card>
  );

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
        <span className="hebrew-date">{dates.hebrewDate}/{dates.gregorianDate}</span>
        <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
          <div className="notification-icon" onClick={() => setIsDropdownVisible((prev) => !prev)}>
            <Badge count={notifications.length}>
              <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
          </div>
        </Dropdown>
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
