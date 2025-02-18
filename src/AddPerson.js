import React, { useState, useEffect } from 'react';
import { Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addRefFriend} from './api';

const AddPerson = ({ }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [fathername, setFatherName] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate(); // Для перехода назад на главную страницу после добавления

  const handleSubmit = async () => {
    if (firstname) {
      // const newPerson = { firstname, lastname, fathername, age, relatives };
      // addPerson(newPerson);
      debugger
      await addRefFriend(firstname, lastname, fathername, age);
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
          <Input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </Form.Item>
        <Form.Item label="Фамилия">
          <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </Form.Item>
        <Form.Item label="Отчество">
          <Input value={fathername} onChange={(e) => setFatherName(e.target.value)} />
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
