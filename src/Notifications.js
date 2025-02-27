import React from 'react';
import { Card, Button } from 'antd';
import './Notifications.css';

const Notifications = ({ notifications }) => {
  return (
    <Card className="notification-card">
      {notifications.length > 0 ? (
        <>
          {notifications.map((notif, index) => (
            <div key={index} className="notification-item">
              <p className="notification-text">
                <strong>{notif.firstName} {notif.lastName}</strong>: {notif.message}
              </p>
            </div>
          ))}
          <Button type="primary" className="read-button">Прочитано</Button>
        </>
      ) : (
        <p className="notification-empty">Нет новых оповещений</p>
      )}
    </Card>
  );
};

export default Notifications;