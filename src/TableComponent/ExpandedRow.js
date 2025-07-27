import React, { useEffect, useState } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Divider, Input, Space, Spin, Tag, Button, Modal, Select, DatePicker, Radio } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import './ExpandedRow.css';

const { Text, Title } = Typography;
const { Option } = Select;

const ExpandedRow = ({ record, isEditing, onChange }) => {
  const [form] = Form.useForm();
  const [relations, setRelations] = useState([]);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRelation, setCurrentRelation] = useState({
    relatedUserId: null,
    relationType: "",
    createReverse: false,
    notes: "",
    relatedPersonInfo: null
  });
  const [isExternalPerson, setIsExternalPerson] = useState(false);
  const [externalPersonData, setExternalPersonData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    isDeceased: false,
    mobileNumber: ""
  });
  const { getPersonRelations, people, updatePerson } = useApp();

  // Типы родственных связей для отображения
  const relationTypes = {
    'father': 'Отец',
    'mother': 'Мать', 
    'son': 'Сын',
    'daughter': 'Дочь',
    'brother': 'Брат',
    'sister': 'Сестра',
    'grandfather': 'Дедушка',
    'grandmother': 'Бабушка',
    'uncle': 'Дядя',
    'aunt': 'Тетя',
    'cousin': 'Двоюродный брат/сестра',
    'spouse': 'Супруг(а)',
    'other': 'Другое'
  };

  useEffect(() => {
    if (isEditing && record) {
      form.setFieldsValue({
        ...record,
        address: record.address || {},
        notes: record.notes || '',
      });
    }
  }, [isEditing, record, form]);

  // Загрузка родственников при открытии
  useEffect(() => {
    if (record?.id) {
      loadRelations();
    }
  }, [record?.id]);

  const loadRelations = async () => {
    setLoadingRelations(true);
    try {
      const userRelations = await getPersonRelations(record.id);
      setRelations(userRelations);
    } catch (error) {
      console.error('Ошибка загрузки родственников:', error);
    } finally {
      setLoadingRelations(false);
    }
  };

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

  // Получение информации о пользователе из базы данных
  const getUserInfo = (userId) => {
    return people.find(p => p.id === userId);
  };

  // Форматирование отображения родственника
  const formatRelationDisplay = (relation) => {
    if (relation.relatedUser) {
      // Родственник из базы данных
      const user = getUserInfo(relation.relatedUser.id) || relation.relatedUser;
      return {
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        birthDate: user.birthDate,
        isFromDatabase: true,
        isDeceased: false,
        userId: user.id
      };
    } else if (relation.relatedPersonInfo) {
      // Внешний родственник
      return {
        name: `${relation.relatedPersonInfo.firstName} ${relation.relatedPersonInfo.lastName}`,
        phone: relation.relatedPersonInfo.mobileNumber,
        birthDate: relation.relatedPersonInfo.birthDate,
        isFromDatabase: false,
        isDeceased: relation.relatedPersonInfo.isDeceased || false
      };
    }
    return null;
  };

  // Получение цвета тега в зависимости от типа родственника
  const getRelationTagColor = (relationType) => {
    const colorMap = {
      'father': 'blue',
      'mother': 'pink',
      'son': 'green',
      'daughter': 'purple',
      'brother': 'orange',
      'sister': 'magenta',
      'grandfather': 'cyan',
      'grandmother': 'volcano',
      'uncle': 'geekblue',
      'aunt': 'gold',
      'cousin': 'lime',
      'spouse': 'red',
      'other': 'default'
    };
    return colorMap[relationType] || 'default';
  };

  // Показать модальное окно для добавления родственника
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Обработка добавления родственника
  const handleModalOk = async () => {
    try {
      const newRelation = {
        ...currentRelation
      };

      if (isExternalPerson) {
        newRelation.relatedPersonInfo = { ...externalPersonData };
        delete newRelation.relatedUserId;
      } else {
        delete newRelation.relatedPersonInfo;
      }

      // Получаем текущие родственники пользователя
      const currentRelations = record.relations || [];
      const updatedRelations = [...currentRelations, newRelation];

      // Обновляем пользователя с новыми родственниками
      const updatedUser = {
        ...record,
        relations: updatedRelations
      };

      await updatePerson(updatedUser);
      
      // Перезагружаем родственников
      await loadRelations();

      // Сброс формы
      setCurrentRelation({
        relatedUserId: null,
        relationType: "",
        createReverse: false,
        notes: "",
        relatedPersonInfo: null
      });
      setExternalPersonData({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        isDeceased: false,
        mobileNumber: ""
      });
      setIsExternalPerson(false);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при добавлении родственника:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
            <Title level={5}>
              Родственники 
              <Button 
                type="primary"
                size="small" 
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ marginLeft: 8 }}
              >
                Добавить
              </Button>
            </Title>
            <Spin spinning={loadingRelations}>
              {relations.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {relations.map((relation, index) => {
                    const relationInfo = formatRelationDisplay(relation);
                    if (!relationInfo) return null;

                    return (
                      <Card 
                        key={index} 
                        size="small" 
                        style={{ 
                          marginBottom: 8, 
                          border: '1px solid #f0f0f0',
                          opacity: relationInfo.isDeceased ? 0.6 : 1
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: 4 }}>
                              <Tag color={getRelationTagColor(relation.relationType)}>
                                {relationTypes[relation.relationType] || relation.relationType}
                              </Tag>
                              {relationInfo.isFromDatabase && (
                                <Tag color="processing" icon={<UserOutlined />}>БД</Tag>
                              )}
                              {relationInfo.isDeceased && (
                                <Tag color="default">†</Tag>
                              )}
                            </div>
                            
                            <div style={{ fontWeight: 'bold', marginBottom: 2 }}>
                              {relationInfo.name}
                            </div>
                            
                            {relationInfo.phone && (
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
                                <PhoneOutlined style={{ marginRight: 4 }} />
                                {relationInfo.phone}
                              </div>
                            )}
                            
                            {relationInfo.birthDate && (
                              <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {relationInfo.birthDate}
                              </div>
                            )}
                            
                            {relation.notes && (
                              <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginTop: 4 }}>
                                {relation.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Text type="secondary">Родственники не найдены</Text>
              )}
            </Spin>
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

      {/* Модальное окно для добавления родственника */}
      <Modal
        title="Добавить родственника"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form layout="vertical">
          <Form.Item label="Тип родственной связи">
            <Select
              value={currentRelation.relationType}
              onChange={(value) => setCurrentRelation({...currentRelation, relationType: value})}
              placeholder="Выберите тип связи"
            >
              {Object.entries(relationTypes).map(([key, label]) => (
                <Option key={key} value={key}>{label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={isExternalPerson}
              onChange={(e) => setIsExternalPerson(e.target.checked)}
            >
              Родственник не в базе данных
            </Checkbox>
          </Form.Item>

          {isExternalPerson ? (
            <>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Имя">
                    <Input
                      value={externalPersonData.firstName}
                      onChange={(e) => setExternalPersonData({...externalPersonData, firstName: e.target.value})}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Фамилия">
                    <Input
                      value={externalPersonData.lastName}
                      onChange={(e) => setExternalPersonData({...externalPersonData, lastName: e.target.value})}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Дата рождения">
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => setExternalPersonData({...externalPersonData, birthDate: dateString})}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Пол">
                    <Radio.Group 
                      value={externalPersonData.gender} 
                      onChange={(e) => setExternalPersonData({...externalPersonData, gender: e.target.value})}
                    >
                      <Radio value="М">М</Radio>
                      <Radio value="Ж">Ж</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Телефон">
                    <Input
                      value={externalPersonData.mobileNumber}
                      onChange={(e) => setExternalPersonData({...externalPersonData, mobileNumber: e.target.value})}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Checkbox
                      checked={externalPersonData.isDeceased}
                      onChange={(e) => setExternalPersonData({...externalPersonData, isDeceased: e.target.checked})}
                    >
                      Умерший
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <Form.Item label="Выберите пользователя">
              <Select
                value={currentRelation.relatedUserId}
                onChange={(value) => setCurrentRelation({...currentRelation, relatedUserId: value})}
                placeholder="Выберите пользователя из базы"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {people
                  .filter(person => person.id !== record.id) // Исключаем самого пользователя
                  .map(person => (
                    <Option key={person.id} value={person.id}>
                      {person.firstName} {person.lastName}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Checkbox
              checked={currentRelation.createReverse}
              onChange={(e) => setCurrentRelation({...currentRelation, createReverse: e.target.checked})}
            >
              Создать обратную связь
            </Checkbox>
          </Form.Item>

          <Form.Item label="Комментарий">
            <Input.TextArea
              value={currentRelation.notes}
              onChange={(e) => setCurrentRelation({...currentRelation, notes: e.target.value})}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ExpandedRow;