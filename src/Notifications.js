import React from 'react';
import { Empty, Button, Typography, Divider } from 'antd';
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import './Notifications.css';

const { Text } = Typography;

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
          Уведомления
        </Text>
        {notifications.length > 0 && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {notifications.length} новых
          </Text>
        )}
      </div>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="notifications-content">
        {notifications.length > 0 ? (
          <>
            <div className="notifications-list">
              {notifications.map((notif, index) => (
                <div key={index} className="notification-item">
                  <div className="notification-avatar">
                    <UserOutlined />
                  </div>
                  <div className="notification-text">
                    <Text strong style={{ fontSize: '13px' }}>
                      {notif.firstName} {notif.lastName}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {notif.message}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="notifications-footer">
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />}
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  height: '32px'
                }}
              >
                Отметить как прочитанное
              </Button>
            </div>
          </>
        ) : (
          <div className="notifications-empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  Нет новых уведомлений
                </Text>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;