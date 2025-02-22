import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Badge, Card } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AddPerson from './AddPerson';
import TableComponent from './TableComponent/TableComponent';
import Notifications from './Notifications';
import { getUsers } from './api';
import './App.css';

const { Content, Footer, Header } = Layout;

const App = () => {
  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers();
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
    setPeople((prevPeople) => [...prevPeople, newPerson]);
  };

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
    setUnreadCount((prev) => prev + 1);
  };

  const markNotificationsAsRead = () => {
    setUnreadCount(0);
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
        <div
          ref={notificationRef}
          className="notification-icon"
          onClick={() => {
            setIsDropdownVisible(!isDropdownVisible);
            if (!isDropdownVisible) markNotificationsAsRead();
          }}
        >
          <Badge count={unreadCount}>
            <BellOutlined style={{ fontSize: '24px' }} />
          </Badge>
          {isDropdownVisible && (
            <Card className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notif, index) => <p key={index}>{notif}</p>)
              ) : (
                <p>Нет новых оповещений</p>
              )}
            </Card>
          )}
        </div>
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
                addNotification={addNotification}
              />
            }
          />
          <Route path="/add" element={<AddPerson addPerson={addPerson} />} />
          <Route path="/notifications" element={<Notifications notifications={notifications} />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Metavision ©2025</Footer>
    </Layout>
  );
};

export default App;
