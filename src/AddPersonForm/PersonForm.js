import React from "react";
import { Input, Button, Form, DatePicker, Radio, Row, Col, Card, Space } from "antd";

const { Item } = Form;

const PersonForm = ({ formData, handleChange, handleSubmit }) => {
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
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Item label="Номер телефона">
              <Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
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
    </Card>
  );
};

export default PersonForm;
