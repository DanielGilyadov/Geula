import React, { useEffect, useState } from 'react';
import { Typography, Spin, Tag, Button, Modal, Select, DatePicker, Radio, Card, Row, Col, Form, Input, Checkbox, notification } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';

const { Text, Title } = Typography;
const { Option } = Select;

const RelationsComponent = ({ userId }) => {
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
    deceasedDate: "",
    mobileNumber: ""
  });
  
  const { getPersonRelations, people, addPersonRelation } = useApp();

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
    'wife': 'Жена',
    'husband': 'Муж',
    'other': 'Другое'
  };

  // Загрузка родственников при монтировании или изменении userId
  useEffect(() => {
    if (userId) {
      loadRelations();
    }
  }, [userId]);

  const loadRelations = async () => {
    setLoadingRelations(true);
    try {
      const userRelations = await getPersonRelations(userId);
      setRelations(userRelations);
    } catch (error) {
      console.error('Ошибка загрузки родственников:', error);
    } finally {
      setLoadingRelations(false);
    }
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
      'wife': 'red',
      'husband': 'red',
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
      // Проверяем обязательные поля
      if (!currentRelation.relationType) {
        notification.error({
          message: 'Ошибка',
          description: 'Выберите тип родственной связи'
        });
        return;
      }

      let relationData = {
        userId: userId,
        relationType: currentRelation.relationType,
        createReverse: currentRelation.createReverse,
        notes: currentRelation.notes
      };

      if (isExternalPerson) {
        // Проверяем обязательные поля для внешнего родственника
        if (!externalPersonData.firstName || !externalPersonData.lastName) {
          notification.error({
            message: 'Ошибка',
            description: 'Заполните имя и фамилию родственника'
          });
          return;
        }

        relationData.relatedPersonInfo = {
          firstName: externalPersonData.firstName,
          lastName: externalPersonData.lastName,
          birthDate: externalPersonData.birthDate,
          gender: externalPersonData.gender,
          isDeceased: externalPersonData.isDeceased,
          mobileNumber: externalPersonData.mobileNumber
        };

        // Добавляем дату смерти если родственник умер
        if (externalPersonData.isDeceased && externalPersonData.deceasedDate) {
          relationData.relatedPersonInfo.deceasedDate = externalPersonData.deceasedDate;
        }
      } else {
        // Проверяем выбран ли пользователь из базы
        if (!currentRelation.relatedUserId) {
          notification.error({
            message: 'Ошибка',
            description: 'Выберите пользователя из базы данных'
          });
          return;
        }

        relationData.relatedUserId = currentRelation.relatedUserId;
      }

      // Отправляем запрос на создание связи
      await addPersonRelation(relationData);
      
      // Перезагружаем родственников
      await loadRelations();

      // Сброс формы
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при добавлении родственника:', error);
    }
  };

  const handleModalCancel = () => {
    resetForm();
    setIsModalVisible(false);
  };

  const resetForm = () => {
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
      deceasedDate: "",
      mobileNumber: ""
    });
    setIsExternalPerson(false);
  };

  return (
    <div>
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
          <Form.Item label="Тип родственной связи" required>
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
                  <Form.Item label="Имя" required>
                    <Input
                      value={externalPersonData.firstName}
                      onChange={(e) => setExternalPersonData({...externalPersonData, firstName: e.target.value})}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Фамилия" required>
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

              {externalPersonData.isDeceased && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="Дата смерти">
                      <DatePicker
                        style={{ width: "100%" }}
                        onChange={(date, dateString) => setExternalPersonData({...externalPersonData, deceasedDate: dateString})}
                        placeholder="Выберите дату смерти"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <Form.Item label="Выберите пользователя" required>
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
                  .filter(person => person.id !== userId) // Исключаем самого пользователя
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
              placeholder="Дополнительная информация о родственнике"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RelationsComponent;