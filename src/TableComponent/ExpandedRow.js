import React from 'react';
import { Form, Checkbox } from 'antd';

const ExpandedRow = ({ record }) => {
  const [form] = Form.useForm();

  return (
    <div>
      <Form form={form} layout="vertical" >

        <Form.Item name="checkboxes" label="Дополнительная информация">
          <Checkbox checked={record.shabbat}>Соблюдает шаббат</Checkbox>
          <Checkbox checked={record.shabbat}>Соблюдает кашрут</Checkbox>
          <Checkbox checked={record.tfilin}>Наличие тфилина</Checkbox>
          <Checkbox checked={record.student}>Участвовал в семинарах</Checkbox>
          <Checkbox checked={record.student}>Получал книги от общины</Checkbox>
          <Checkbox checked={record.student}>Детский лагерь (участие)</Checkbox>
          <Checkbox checked={record.student}>Праздник песах (поездка на песах)</Checkbox>
          <Checkbox checked={record.need}>Нуждающийся</Checkbox>
       
        </Form.Item>

      </Form>
    </div>
  );
};

export default ExpandedRow;














