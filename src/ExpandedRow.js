import React from 'react';
import { Form, Input, Button } from 'antd';

const ExpandedRow = ({ record, onAddRelative }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onAddRelative(record.key, values); // Передаем данные родителя и нового родственника в функцию
    form.resetFields(); // Сбрасываем поля формы
  };

  return (
    <div>
      <h4>Родственники:</h4>
      {record.relatives.length > 0 ? (
        <ul>
          {record.relatives.map((relative, index) => (
            <li key={index}>
              {relative.name} ({relative.relation})
            </li>
          ))}
        </ul>
      ) : (
        <p>Родственников пока нет.</p>
      )}
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Введите имя!' }]}
        >
          <Input placeholder="Имя родственника" />
        </Form.Item>
        <Form.Item
          name="relation"
          rules={[{ required: true, message: 'Введите связь!' }]}
        >
          <Input placeholder="Связь (например: брат, сестра, друг)" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExpandedRow;
