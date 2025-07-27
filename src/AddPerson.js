import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import PersonForm from './AddPersonForm/PersonForm';
import { Spin } from 'antd';

const AddPerson = () => {
  const { addPerson, loading } = useApp();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    birthDate: "",
    mobileNumber: "",
    email: "",
    gender: "",
    city: "",
    metroStation: "",
    street: "",
    houseNumber: "",
    entrance: "",
    apartment: "",
    floor: "",
    relations: [] // Добавляем поле для родственников
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Добавляем специальный обработчик для родственников
  const handleRelationsChange = (relations) => {
    setFormData((prevData) => ({
      ...prevData,
      relations: relations,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName) {
      alert("Пожалуйста, укажите имя!");
      return;
    }
  
    try {
      await addPerson(formData);
      navigate("/");
    } catch (error) {
      // Ошибка уже обработана в Context
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };

  return (
    <Spin spinning={loading.people}>
      <div>
        <h2>Добавить нового человека</h2>
        <PersonForm
          formData={formData}
          handleChange={handleChange}
          handleRelationsChange={handleRelationsChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </Spin>
  );
};

export default AddPerson;