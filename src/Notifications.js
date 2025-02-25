import React from 'react';
import { Card } from 'antd';

const Notifications = ({ notifications }) => {
  return (
    <Card >
      {notifications.length > 0 ? (
        notifications.map((notif, index) => 
        <p key={index}>{notif.message}</p>
      )
      ) : (
        <p>Нет новых оповещений</p>
      )}
    </Card>
  );
};

export default Notifications;
