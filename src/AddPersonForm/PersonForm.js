import React, { useState } from "react";
import { Input, Button, Form, DatePicker, Radio, Row, Col, Card, Space, Select, Modal, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useApp } from "../context/AppContext";

const { Item } = Form;
const { Option } = Select;

const PersonForm = ({ formData, handleChange, handleRelationsChange, handleSubmit }) => {
  const { people } = useApp();
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

  // Типы родственных связей
  const relationTypes = [
    { value: 'father', label: 'Отец' },
    { value: 'mother', label: 'Мать' },
    { value: 'son', label: 'Сын' },
    { value: 'daughter', label: 'Дочь' },
    { value: 'brother', label: 'Брат' },
    { value: 'sister', label: 'Сестра' },
    { value: 'grandfather', label: 'Дедушка' },
    { value: 'grandmother', label: 'Бабушка' },
    { value: 'uncle', label: 'Дядя' },
    { value: 'aunt', label: 'Тетя' },
    { value: 'cousin', label: 'Двоюродный брат/сестра' },
    { value: 'spouse', label: 'Супруг(а)' },
    { value: 'other', label: 'Другое' }
  ];

  // Функция для форматирования телефона
  const formatPhoneNumber = (value) => {
    let phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.startsWith('8')) {
      phoneNumber = '7' + phoneNumber.slice(1);
    }
    
    if (!phoneNumber.startsWith('7')) {
      phoneNumber = '7' + phoneNumber;
    }
    
    phoneNumber = phoneNumber.slice(0, 11);
    
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength <= 1) return '+7';
    if (phoneNumberLength <= 4) {
      return `+7 (${phoneNumber.slice(1)}`;
    }
    if (phoneNumberLength <= 7) {
      return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
    }
    if (phoneNumberLength <= 9) {
      return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
    }
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    if (value.length < 2) {
      value = '+7';
    }
    
    const formattedPhone = formatPhoneNumber(value);
    handleChange({ target: { name: 'mobileNumber', value: formattedPhone } });
  };

  // Добавление родственника
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const newRelation = {
      ...currentRelation
    };

    if (isExternalPerson) {
      newRelation.relatedPersonInfo = { ...externalPersonData };
      delete newRelation.relatedUserId;
    } else {
      delete newRelation.relatedPersonInfo;
    }

    const updatedRelations = [...(formData.relations || []), newRelation];
    handleRelationsChange(updatedRelations);

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
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Удаление родственника
  const removeRelation = (index) => {
    const updatedRelations = formData.relations.filter((_, i) => i !== index);
    handleRelationsChange(updatedRelations);
  };

  // Получение отображаемого имени родственника
  const getRelationDisplayName = (relation) => {
    if (relation.relatedUserId) {
      const person = people.find(p => p.id === relation.relatedUserId);
      return person ? `${person.firstName} ${person.lastName}` : 'Неизвестный пользователь';
    } else if (relation.relatedPersonInfo) {
      return `${relation.relatedPersonInfo.firstName} ${relation.relatedPersonInfo.lastName}`;
    }
    return 'Неизвестный родственник';
  };

  // Получение типа связи на русском
  const getRelationTypeLabel = (type) => {
    const relation = relationTypes.find(r => r.value === type);
    return relation ? relation.label : type;
  };

  return (
    <Card style={{ maxWidth: "100%", margin: "20px auto", padding: 24, borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Item label="Имя">
              <Input name="firstName" value={formData.firstName} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Item label="Фамилия">
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Item label="Отчество">
              <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Item label="Дата рождения">
              <DatePicker
                name="birthDate"
                style={{ width: "100%" }}
                onChange={(date, dateString) =>
                  handleChange({ target: { name: "birthDate", value: dateString } })
                }
              />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Item label="Пол">
              <Radio.Group name="gender" value={formData.gender} onChange={handleChange}>
                <Space>
                  <Radio value="М">М</Radio>
                  <Radio value="Ж">Ж</Radio>
                </Space>
              </Radio.Group>
            </Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Item label="Родственники">
              <div>
                <Button 
                  type="dashed" 
                  onClick={showModal} 
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  Добавить родственника
                </Button>
                {formData.relations && formData.relations.length > 0 && (
                  <div style={{ border: "1px solid #d9d9d9", borderRadius: "6px", padding: "8px", maxHeight: "120px", overflowY: "auto" }}>
                    {formData.relations.map((relation, index) => (
                      <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", padding: "4px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
                        <span style={{ fontSize: "12px" }}>
                          <strong>{getRelationTypeLabel(relation.relationType)}</strong>: {getRelationDisplayName(relation)}
                        </span>
                        <Button 
                          type="text" 
                          danger 
                          size="small" 
                          icon={<DeleteOutlined />}
                          onClick={() => removeRelation(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Item label="Номер телефона">
              <Input 
                name="mobileNumber" 
                value={formData.mobileNumber} 
                onChange={handlePhoneChange}
                onFocus={(e) => {
                  if (!e.target.value) {
                    handleChange({ target: { name: 'mobileNumber', value: '+7' } });
                  }
                }}
                placeholder="+7 (999) 999-99-99"
                maxLength={18}
              />
            </Item>
          </Col>
          <Col xs={24} sm={12}>
            <Item label="Email">
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Item label="Город">
              <Input name="city" value={formData.city} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={24} sm={12}>
            <Item label="Метро">
              <Input name="metroStation" value={formData.metroStation} onChange={handleChange} />
            </Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Item label="Улица">
              <Input name="street" value={formData.street} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={12} sm={4}>
            <Item label="Дом">
              <Input name="houseNumber" value={formData.houseNumber} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={12} sm={4}>
            <Item label="Подъезд">
              <Input name="entrance" value={formData.entrance} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={12} sm={4}>
            <Item label="Квартира">
              <Input name="apartment" value={formData.apartment} onChange={handleChange} />
            </Item>
          </Col>
          <Col xs={12} sm={4}>
            <Item label="Этаж">
              <Input name="floor" value={formData.floor} onChange={handleChange} />
            </Item>
          </Col>
        </Row>

        <Item style={{ marginTop: "20px", textAlign: "center" }}>
          <Button type="primary" size="large" onClick={handleSubmit} style={{ padding: "10px 40px", borderRadius: "8px" }}>
            Добавить
          </Button>
        </Item>
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
          <Item label="Тип родственной связи">
            <Select
              value={currentRelation.relationType}
              onChange={(value) => setCurrentRelation({...currentRelation, relationType: value})}
              placeholder="Выберите тип связи"
            >
              {relationTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Item>

          <Item>
            <Checkbox
              checked={isExternalPerson}
              onChange={(e) => setIsExternalPerson(e.target.checked)}
            >
              Родственник не в базе данных
            </Checkbox>
          </Item>

          {isExternalPerson ? (
            <>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Item label="Имя">
                    <Input
                      value={externalPersonData.firstName}
                      onChange={(e) => setExternalPersonData({...externalPersonData, firstName: e.target.value})}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label="Фамилия">
                    <Input
                      value={externalPersonData.lastName}
                      onChange={(e) => setExternalPersonData({...externalPersonData, lastName: e.target.value})}
                    />
                  </Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Item label="Дата рождения">
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => setExternalPersonData({...externalPersonData, birthDate: dateString})}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item label="Пол">
                    <Radio.Group 
                      value={externalPersonData.gender} 
                      onChange={(e) => setExternalPersonData({...externalPersonData, gender: e.target.value})}
                    >
                      <Radio value="М">М</Radio>
                      <Radio value="Ж">Ж</Radio>
                    </Radio.Group>
                  </Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Item label="Телефон">
                    <Input
                      value={externalPersonData.mobileNumber}
                      onChange={(e) => setExternalPersonData({...externalPersonData, mobileNumber: e.target.value})}
                    />
                  </Item>
                </Col>
                <Col span={12}>
                  <Item>
                    <Checkbox
                      checked={externalPersonData.isDeceased}
                      onChange={(e) => setExternalPersonData({...externalPersonData, isDeceased: e.target.checked})}
                    >
                      Умерший
                    </Checkbox>
                  </Item>
                </Col>
              </Row>
            </>
          ) : (
            <Item label="Выберите пользователя">
              <Select
                value={currentRelation.relatedUserId}
                onChange={(value) => setCurrentRelation({...currentRelation, relatedUserId: value})}
                placeholder="Выберите пользователя из базы"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {people.map(person => (
                  <Option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </Option>
                ))}
              </Select>
            </Item>
          )}

          <Item>
            <Checkbox
              checked={currentRelation.createReverse}
              onChange={(e) => setCurrentRelation({...currentRelation, createReverse: e.target.checked})}
            >
              Создать обратную связь
            </Checkbox>
          </Item>

          <Item label="Комментарий">
            <Input.TextArea
              value={currentRelation.notes}
              onChange={(e) => setCurrentRelation({...currentRelation, notes: e.target.value})}
              rows={3}
            />
          </Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PersonForm;