import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRefFriend } from './api';
import PersonForm from './AddPersonForm/PersonForm';

const AddPerson = () => {
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
      [name]: value, // Теперь обновляется только конкретное поле
    }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName) {
      alert("Пожалуйста, укажите имя!");
      return;
    }
  
    await addRefFriend(formData.firstName, formData.lastName, formData.fatherName, formData.birthDate, formData.mobileNumber, formData.email, formData.gender, formData.city, formData.metroStation, formData.street, formData.houseNumber, formData.entrance, formData.apartment, formData.floor);
    navigate("/");
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
