import React from 'react';
import { Layout, Menu, Badge, Dropdown, Card, Space } from 'antd';
import { BellOutlined, UserAddOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Notifications from './Notifications';
import './App.css';
import emblem from './emblem.png';

const { Content, Footer, Header } = Layout;

const LayoutComponent = ({ children, notifications, dates, isDropdownVisible, setIsDropdownVisible }) => {
  const location = useLocation();

  const notificationMenu = (
    <Card className="notification-dropdown">
      <Notifications notifications={notifications} />
    </Card>
  );

  return (
    <Layout className="main-layout">
      <Header className="header-menu">
        <div className="logo">
          Геула <img src={emblem} alt="Эмблема общины" className="community-emblem" />
        </div>
        <Menu theme="light" mode="horizontal" selectedKeys={[location.pathname]} className="menu-bar">
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Главная</Link>
          </Menu.Item>
          <Menu.Item key="/add" icon={<UserAddOutlined />}>
            <Link to="/add">Добавить</Link>
          </Menu.Item>
        </Menu>
        <Space className="header-right">
          <span className="hebrew-date">
            <strong>{dates.hebrewDate}</strong> &nbsp; | &nbsp; <strong>{dates.gregorianDate}</strong>
          </span>
          <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
            <div className="notification-icon" onClick={() => setIsDropdownVisible((prev) => !prev)}>
              <Badge count={notifications.length} offset={[10, 0]}>
                <BellOutlined className="bell-icon" />
              </Badge>
            </div>
          </Dropdown>
        </Space>
      </Header>
      <Content className="content-area">{children}</Content>
      <Footer className="footer">Metavision ©2025</Footer>
    </Layout>
  );
};

export default LayoutComponent;
