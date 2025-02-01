import React, { useState } from 'react';
import { Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddPerson = ({ addPerson }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [fathersName, setFathersName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [relatives, setRelatives] = useState([]);
  const navigate = useNavigate(); // Для перехода назад на главную страницу после добавления

  const handleSubmit = () => {
    if (name) {
      const newPerson = { name, age, fathersName, familyName, relatives };
      addPerson(newPerson);
      navigate('/'); // Возвращаемся на главную
    } else {
      alert("Пожалуйста, заполните все поля!");
    }
  };

  return (
    <div>
      <h2>Добавить нового человека</h2>
      <Form layout="vertical">
        <Form.Item label="Имя">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Фамилия">
          <Input value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Отчество">
          <Input value={fathersName} onChange={(e) => setFathersName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Возраст">
          <Input value={age} onChange={(e) => setAge(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>Добавить</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPerson;
