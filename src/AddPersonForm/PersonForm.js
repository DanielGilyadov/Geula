import React from "react";
import { Input, Button, Form, DatePicker, Radio, Row, Col } from "antd";

const { Item } = Form;

const PersonForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <Form layout="vertical">
      {/* Личная информация */}
      <Row gutter={16}>
        <Col span={8}>
          <Item label="Имя">
            <Input name="firstName" value={formData.firstName} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Фамилия">
            <Input name="lastName" value={formData.lastName} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Отчество">
            <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
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
        <Col span={8}>
          <Item label="Пол">
            <Radio.Group name="gender" value={formData.gender} onChange={handleChange}>
              <Radio value="male">М</Radio>
              <Radio value="female">Ж</Radio>
            </Radio.Group>
          </Item>
        </Col>
      </Row>

      {/* Контакты */}
      <Row gutter={16}>
        <Col span={12}>
          <Item label="Номер телефона">
            <Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Email">
            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          </Item>
        </Col>
      </Row>

      {/* Адрес */}
      <Row gutter={16}>
        <Col span={12}>
          <Item label="Город">
            <Input name="city" value={formData.city} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={12}>
          <Item label="Метро">
            <Input name="metroStation" value={formData.metroStation} onChange={handleChange} />
          </Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Item label="Улица">
            <Input name="street" value={formData.street} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Дом">
            <Input name="houseNumber" value={formData.houseNumber} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Подъезд">
            <Input name="entrance" value={formData.entrance} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Квартира">
            <Input name="apartment" value={formData.apartment} onChange={handleChange} />
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Этаж">
            <Input name="floor" value={formData.floor} onChange={handleChange} />
          </Item>
        </Col>
      </Row>

      {/* Кнопка отправки */}
      <Item style={{ marginTop: "20px" }}>
  <Button type="primary" onClick={handleSubmit} style={{ padding: "8px 32px", fontSize: "16px" }}>
    Добавить
  </Button>
</Item>
    </Form>
  );
};

export default PersonForm;
