import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from './api';
import PersonForm from './AddPersonForm/PersonForm';

const AddPerson = ({ addPerson }) => { // Теперь принимаем setPeople как пропс
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
    floor: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName) {
      alert("Пожалуйста, укажите имя!");
      return;
    }
  
    try {
      const newUser = await addUser(
        formData.firstName,
        formData.lastName,
        formData.fatherName,
        formData.birthDate,
        formData.mobileNumber,
        formData.email,
        formData.gender,
        formData.city,
        formData.metroStation,
        formData.street,
        formData.houseNumber,
        formData.entrance,
        formData.apartment,
        formData.floor
      );
  
      addPerson(newUser); // Используем addPerson вместо setPeople
      navigate("/");
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
    }
  };
  

  return (
    <div>
      <h2>Добавить нового человека</h2>
      <PersonForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddPerson;
