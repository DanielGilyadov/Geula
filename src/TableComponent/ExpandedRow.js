import React from 'react';
import { Form, Checkbox, Card, Row, Col } from 'antd';

const ExpandedRow = ({ record }) => {
  const [form] = Form.useForm();

  return (
    <Card title="Дополнительная информация" style={{ backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={12}><Checkbox checked={record.shabbat}>Соблюдает шаббат</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.kosher}>Соблюдает кашрут</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.tfilin}>Наличие тфилина</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.student}>Участвовал в семинарах</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.books}>Получал книги от общины</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.camp}>Детский лагерь (участие)</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.pesach}>Праздник песах (поездка на песах)</Checkbox></Col>
          <Col span={12}><Checkbox checked={record.need}>Нуждающийся</Checkbox></Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ExpandedRow;
