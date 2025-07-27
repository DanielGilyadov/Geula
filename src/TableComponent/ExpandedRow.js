import React, { useEffect } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Divider, Input, Space } from 'antd';
import { useApp } from '../context/AppContext';
import RelationsComponent from './RelationsComponent';
import './ExpandedRow.css';

const { Text, Title } = Typography;

const ExpandedRow = ({ record, isEditing, onChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing && record) {
      form.setFieldsValue({
        ...record,
        address: record.address || {},
        notes: record.notes || '',
      });
    }
  }, [isEditing, record, form]);

  const handleInputChange = (field, value) => {
    const updatedCheckBox = { ...record.religiousInfo, [field]: value };
    onChange(record.key, 'religiousInfo', updatedCheckBox);
    form.setFieldsValue({ religiousInfo: updatedCheckBox });
  };

  const handleNestedInputChange = (nestedField, value) => {
    const updatedAddress = { ...record.address, [nestedField]: value };
    onChange(record.key, 'address', updatedAddress);
    form.setFieldsValue({ address: updatedAddress });
  };

  const handleNotesChange = (e) => {
    onChange(record.key, 'notes', e.target.value);
    form.setFieldsValue({ notes: e.target.value });
  };

  return (
    <Card className="expanded-card" title="Дополнительные данные">
      <Form layout="vertical" form={form} initialValues={{
        religiousInfo: record.religiousInfo || {},
        address: record.address || {},
        notes: record.notes || '',
      }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title level={5}>Религиозные аспекты</Title>
            <Row gutter={[16, 8]}>
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
                <Col span={24} key={item.key}>
                  <Form.Item name={['religiousInfo', item.key]} valuePropName="checked">
                    <Checkbox disabled={!isEditing} onChange={(e) => handleInputChange(item.key, e.target.checked)}>
                      <Text>{item.label}</Text>
                    </Checkbox>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Col>
          
          <Col span={8}>
            <Title level={5}>Место жительства</Title>
            <Row gutter={[16, 8]}>
              {[
                { key: 'city', label: 'Город' },
                { key: 'metroStation', label: 'Метро' },
                { key: 'street', label: 'Улица' },
                { key: 'houseNumber', label: 'Дом' },
                { key: 'entrance', label: 'Подъезд' },
                { key: 'apartment', label: 'Номер квартиры' },
                { key: 'floor', label: 'Этаж' },
              ].map((item) => (
                <Col span={24} key={item.key}>
                  <Form.Item>
                    <Space>
                      <Text strong>{item.label}:</Text>
                      {isEditing ? (
                        <Input size="small" onChange={(e) => handleNestedInputChange(item.key, e.target.value)} />
                      ) : (
                        <Text>{record.address?.[item.key] || '—'}</Text>
                      )}
                    </Space>
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Col>

          <Col span={8}>
            <RelationsComponent userId={record.id} />
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Комментарии</Title>
        <Form.Item name="notes">
          {isEditing ? (
            <Input.TextArea rows={3} onChange={handleNotesChange} />
          ) : (
            <Text>{record.notes || '—'}</Text>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ExpandedRow;