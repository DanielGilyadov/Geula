// src/TableComponent/RelationsDisplay.js
import React from 'react';
import { Typography, Spin, Tag, Button, Modal, Select, DatePicker, Radio, Card, Row, Col, Form, Input, Checkbox } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useRelationsManager } from './RelationsManager';
import './ExpandedRow.css';

const { Text, Title } = Typography;
const { Option } = Select;

const RelationsDisplay = ({ userId }) => {
  const {
    // Состояния
    relations,
    loadingRelations,
    isModalVisible,
    currentRelation,
    isExternalPerson,
    externalPersonData,
    relationTypes,

    // Методы
    formatRelationDisplay,
    getRelationTagColor,
    getRelationTypeLabel,
    showAddRelationModal,
    handleAddRelation,
    handleModalCancel,
    
    // Обработчики формы
    handleRelationTypeChange,
    handleRelatedUserChange,
    handleCreateReverseChange,
    handleNotesChange,
    handleExternalPersonToggle,
    handleExternalPersonChange,
    
    // Утилиты
    getAvailableUsers
  } = useRelationsManager(userId);

  const availableUsers = getAvailableUsers();

  return (
    <div>
      <Title level={5}>
        Родственники 
        <Button 
          type="primary"
          size="small" 
          icon={<PlusOutlined />}
          onClick={showAddRelationModal}
          style={{ marginLeft: 8 }}
          className="relations-add-button"
        >
          Добавить
        </Button>
      </Title>
      
      <Spin spinning={loadingRelations}>
        {relations.length > 0 ? (
          <div className="relations-section">
            {relations.map((relation, index) => {
              const relationInfo = formatRelationDisplay(relation);
              if (!relationInfo) return null;

              return (
                <Card 
                  key={index} 
                  size="small" 
                  className={`relation-card ${relationInfo.isDeceased ? 'relation-deceased' : ''}`}
                  style={{ marginBottom: 8 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 4 }}>
                        <Tag 
                          color={getRelationTagColor(relation.relationType)}
                          className="relation-type-tag"
                        >
                          {getRelationTypeLabel(relation.relationType)}
                        </Tag>
                        {relationInfo.isFromDatabase && (
                          <Tag color="processing" icon={<UserOutlined />}>БД</Tag>
                        )}
                        {relationInfo.isDeceased && (
                          <Tag color="default">†</Tag>
                        )}
                      </div>
                      
                      <div className="relation-info">
                        <div className="relation-name">
                          {relationInfo.name}
                        </div>
                        
                        {relationInfo.phone && (
                          <div className="relation-contact">
                            <PhoneOutlined />
                            <span>{relationInfo.phone}</span>
                          </div>
                        )}
                        
                        {relationInfo.birthDate && (
                          <div className="relation-contact">
                            <CalendarOutlined />
                            <span>{relationInfo.birthDate}</span>
                          </div>
                        )}
                        
                        {relationInfo.isDeceased && relationInfo.deceasedDate && (
                          <div className="relation-contact">
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              † {relationInfo.deceasedDate}
                            </Text>
                          </div>
                        )}
                        
                        {relation.notes && (
                          <div className="relation-notes">
                            {relation.notes}
                          </div>
                        )}
                      </div>
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
        onOk={handleAddRelation}
        onCancel={handleModalCancel}
        width={600}
        okText="Добавить"
        cancelText="Отмена"
        confirmLoading={loadingRelations}
        destroyOnClose={true}
      >
        <Form layout="vertical">
          <Form.Item label="Тип родственной связи" required>
            <Select
              value={currentRelation.relationType}
              onChange={handleRelationTypeChange}
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
              onChange={(e) => handleExternalPersonToggle(e.target.checked)}
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
                      onChange={(e) => handleExternalPersonChange('firstName', e.target.value)}
                      placeholder="Введите имя"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Фамилия" required>
                    <Input
                      value={externalPersonData.lastName}
                      onChange={(e) => handleExternalPersonChange('lastName', e.target.value)}
                      placeholder="Введите фамилию"
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Дата рождения">
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => handleExternalPersonChange('birthDate', dateString)}
                      placeholder="Выберите дату рождения"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Пол">
                    <Radio.Group 
                      value={externalPersonData.gender} 
                      onChange={(e) => handleExternalPersonChange('gender', e.target.value)}
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
                      onChange={(e) => handleExternalPersonChange('mobileNumber', e.target.value)}
                      placeholder="Введите номер телефона"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <Checkbox
                      checked={externalPersonData.isDeceased}
                      onChange={(e) => handleExternalPersonChange('isDeceased', e.target.checked)}
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
                        onChange={(date, dateString) => handleExternalPersonChange('deceasedDate', dateString)}
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
                onChange={handleRelatedUserChange}
                placeholder="Выберите пользователя из базы"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {availableUsers.map(person => (
                  <Option key={person.id} value={person.id}>
                    {person.firstName} {person.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Checkbox
              checked={currentRelation.createReverse}
              onChange={(e) => handleCreateReverseChange(e.target.checked)}
            >
              Создать обратную связь
            </Checkbox>
          </Form.Item>

          <Form.Item label="Комментарий">
            <Input.TextArea
              value={currentRelation.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={3}
              placeholder="Дополнительная информация о родственнике"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RelationsDisplay;