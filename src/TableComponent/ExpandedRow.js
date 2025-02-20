import React, { useState } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Divider, Button, Input } from 'antd';
import './ExpandedRow.css';

const { Text, Title } = Typography;

const ExpandedRow = ({ record, onSave }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({ ...record, ...record.address });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsEditing(false);
      onSave({ ...record, address: { ...values } });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Card
      title="Дополнительные данные"
      style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}
      extra={
        <Button type="primary" onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Сохранить' : 'Редактировать'}
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        <Title level={4}>Религиозные аспекты</Title>
        <Row gutter={[16, 16]}>
          {[
            { key: 'shabbat', label: 'Соблюдает шаббат' },
            { key: 'kosher', label: 'Соблюдает кашрут' },
            { key: 'tfilin', label: 'Наличие тфилина' },
            { key: 'student', label: 'Участвовал в семинарах' },
            { key: 'books', label: 'Получал книги от общины' },
            { key: 'camp', label: 'Детский лагерь (участие)' },
            { key: 'pesach', label: 'Праздник песах (поездка на песах)' },
            { key: 'need', label: 'Нуждающийся' },
          ].map((item) => (
            <Col span={12} key={item.key}>
              <Form.Item name={item.key} valuePropName="checked" initialValue={record[item.key] || false}>
                <Checkbox className={!isEditing ? 'disabled-checkbox custom-checkbox' : 'custom-checkbox'} disabled={!isEditing}>
                  <Text strong>{item.label}</Text>
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Divider />
        <Title level={4}>Место жительства</Title>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {[
            { key: 'city', label: 'Город проживания' },
            { key: 'metroStation', label: 'Метро' },
            { key: 'street', label: 'Улица' },
            { key: 'houseNumber', label: 'Дом' },
            { key: 'entrance', label: 'Подъезд' },
            { key: 'apartment', label: 'Номер квартиры' },
            { key: 'floor', label: 'Этаж' },
          ].map((item) => (
            <Col span={12} key={item.key}>
              <Text strong>{item.label}:</Text>{' '}
              {isEditing ? (
                <Form.Item name={item.key} noStyle>
                  <Input style={{ width: '80%' }} />
                </Form.Item>
              ) : (
                <Text>{record.address?.[item.key] || '—'}</Text>
              )}
            </Col>
          ))}
        </Row>
      </Form>
    </Card>
  );
};

export default ExpandedRow;