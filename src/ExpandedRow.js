import React from 'react';
import { Form, Checkbox } from 'antd';

const ExpandedRow = ({ record }) => {
  const [form] = Form.useForm();

  return (
    <div>
      <Form form={form} layout="vertical" >

        <Form.Item name="checkboxes" label="Дополнительная информация">
          <Checkbox checked={record.shabbat}>Соблюдает шаббат</Checkbox>
          <Checkbox checked={record.tfilin}>Наличие тфилина</Checkbox>
          <Checkbox checked={record.student}>Участвовал в семинарах</Checkbox>
        </Form.Item>

      </Form>
    </div>
  );
};

export default ExpandedRow;














{/* <h4>Родственники:</h4>
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
</Form> */}