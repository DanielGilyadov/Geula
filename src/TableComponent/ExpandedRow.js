import React, { useEffect } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Divider, Input } from 'antd';
import './ExpandedRow.css';

const { Text, Title } = Typography;

const ExpandedRow = ({ record, isEditing, onChange }) => {
  const [form] = Form.useForm(); // Создаём форму

  // При включении редактирования заполняем форму текущими значениями
  useEffect(() => {
    if (isEditing && record) {
      form.setFieldsValue({
        ...record,
        address: record.address || {},
      });
    }
  }, [isEditing, record, form]);

  const handleInputChange = (field, value) => {
    const updatedCheckBox = { ...record.religiousInfo, [field]: value };
    onChange(record.key, 'religiousInfo', updatedCheckBox);
    form.setFieldsValue({ religiousInfo: updatedCheckBox }); // Обновляем вложенные поля
  };

  const handleNestedInputChange = (nestedField, value) => {
    const updatedAddress = { ...record.address, [nestedField]: value };
    onChange(record.key, 'address', updatedAddress);
    form.setFieldsValue({ address: updatedAddress }); // Обновляем вложенные поля
  };

  return (
    <Card title="Дополнительные данные" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          religiousInfo: record.religiousInfo || {},
          address: record.address || {},
        }}
      >
        {/* === Религиозные аспекты === */}
        <Title level={4}>Религиозные аспекты</Title>
        <Row gutter={[16, 16]}>
          {[
            { key: 'keepsSabbath', label: 'Соблюдает шаббат' },
            { key: 'keepsKosher', label: 'Соблюдает кашрут' },
            { key: 'hasTT', label: 'Наличие тфилина' },
            { key: 'seminarParticipant', label: 'Участвовал в семинарах' },
            { key: 'hasCommunityBooks', label: 'Получал книги от общины' },
            { key: 'childrenCamp', label: 'Детский лагерь (участие)' },
            { key: 'passover', label: 'Праздник песах (поездка на песах)' },
            { key: 'isInNeed', label: 'Нуждающийся' },
          ].map((item) => (
            <Col span={12} key={item.key}>
              <Form.Item name={['religiousInfo', item.key]} valuePropName="checked">
                <Checkbox
                 className={!isEditing ? 'disabled-checkbox custom-checkbox' : 'custom-checkbox'}
                  disabled={!isEditing}
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
              <Form.Item name={['address', item.key]}>
                {isEditing ? (
                  <Input
                    value={record.address?.[item.key] || ''}
                    onChange={(e) => handleNestedInputChange(item.key, e.target.value)}
                    style={{ width: '80%' }}
                  />
                ) : (
                  <Text>{record.address?.[item.key] || '—'}</Text>
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Card>
  );
};

export default ExpandedRow;
