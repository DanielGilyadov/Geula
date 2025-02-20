import React, { useEffect } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Divider, Input } from 'antd';
import './ExpandedRow.css';

const { Text, Title } = Typography;

const ExpandedRow = ({ record, isEditing, onChange }) => {
  const [form] = Form.useForm(); // Создаём форму

  // При включении редактирования заполняем форму текущими значениями
  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(record); // Загружаем данные из record
    }
  }, [isEditing, record, form]);

  const handleInputChange = (field, value) => {
    onChange(record.key, field, value);
    form.setFieldsValue({ [field]: value }); // Сразу обновляем форму
  };

  const handleNestedInputChange = (nestedField, value) => {
    const updatedAddress = { ...record.address, [nestedField]: value };
    onChange(record.key, 'address', updatedAddress);
    form.setFieldsValue({ address: updatedAddress }); // Обновляем вложенные поля
  };

  return (
    <Card title="Дополнительные данные" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
      <Form layout="vertical" form={form}>
        {/* === Религиозные аспекты === */}
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
              <Form.Item name={item.key} valuePropName="checked" initialValue={record[item.key]}>
                <Checkbox
                  className={!isEditing ? 'disabled-checkbox custom-checkbox' : 'custom-checkbox'}
                  disabled={!isEditing}
                  checked={record[item.key] || false}
                  onChange={(e) => handleInputChange(item.key, e.target.checked)}
                >
                  <Text strong>{item.label}</Text>
                </Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* === Место жительства === */}
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
                <Input
                  defaultValue={record.address?.[item.key] || ''} // Используем defaultValue, чтобы текст не исчезал
                  onChange={(e) => handleNestedInputChange(item.key, e.target.value)}
                  style={{ width: '80%' }}
                />
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
