import React, { useState } from 'react';
import { Button, Badge, Drawer, List, Input } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './Notifications.css';

const Notifications = ({ notifications, addNotification, markAsRead }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      addNotification(input);
      setInput('');
    }
  };

  return (
    <>
      <Badge count={notifications.filter((n) => !n.read).length} showZero>
        <Button icon={<BellOutlined />} onClick={() => setIsDrawerOpen(true)} />
      </Badge>

      <Drawer
        className="styled-drawer"
        title="Уведомления"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <List
          dataSource={notifications}
          renderItem={(notif) => (
            <List.Item>
              <div className={`notification-container ${notif.read ? 'read' : 'unread'}`}>
                <span className={`message-text ${notif.read ? 'read' : 'unread'}`}>{notif.message}</span>
                {!notif.read && (
                  <Button size="small" type="link" onClick={() => markAsRead(notif.id)}>
                    Прочитано
                  </Button>
                )}
              </div>
            </List.Item>
          )}
        />
        <div className="input-container">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Введите текст оповещения" 
            onPressEnter={handleSend}
          />
          <Button type="primary" onClick={handleSend} className="styled-button">
            Отправить
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Notifications;
