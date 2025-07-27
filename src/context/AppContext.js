import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUsers, addUser, updateUser, getNotifications, getDates, getUserRelations, createRelation } from '../api';
import { notification } from 'antd';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Основные состояния
  const [people, setPeople] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dates, setDates] = useState({});
  
  // Состояния загрузки и ошибок
  const [loading, setLoading] = useState({
    people: false,
    notifications: false,
    dates: false
  });
  const [errors, setErrors] = useState({});

  // Функция для обработки ошибок
  const handleError = useCallback((error, context) => {
    console.error(`Ошибка в ${context}:`, error);
    notification.error({
      message: 'Ошибка',
      description: error.response?.data?.message || error.message || 'Произошла неизвестная ошибка',
      duration: 4
    });
    setErrors(prev => ({ ...prev, [context]: error }));
  }, []);

  // Загрузка всех данных
  const loadAllData = useCallback(async () => {
    try {
      setLoading({ people: true, notifications: true, dates: true });
      
      const [usersData, notificationsData, datesData] = await Promise.all([
        getUsers(),
        getNotifications(),
        getDates()
      ]);

      setPeople(usersData || []);
      setNotifications(notificationsData || []);
      setDates(datesData || {});
    } catch (error) {
      handleError(error, 'loadAllData');
    } finally {
      setLoading({ people: false, notifications: false, dates: false });
    }
  }, [handleError]);

  // Добавление нового человека
  const addPerson = useCallback(async (formData) => {
    try {
      setLoading(prev => ({ ...prev, people: true }));
      
      const newUser = await addUser(formData);

      setPeople(prev => [...prev, newUser]);
      
      notification.success({
        message: 'Успешно',
        description: 'Новый пользователь добавлен',
        duration: 3
      });
      
      return newUser;
    } catch (error) {
      handleError(error, 'addPerson');
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, people: false }));
    }
  }, [handleError]);

  // Обновление данных человека c сохранением на сервер
  const updatePerson = useCallback(async (updatedUser) => {
    try {
      setLoading(prev => ({ ...prev, people: true }));
      
      const result = await updateUser(updatedUser);
      
      setPeople(prev => prev.map(person => 
        person.id === updatedUser.id ? { ...person, ...updatedUser } : person
      ));
      
      notification.success({
        message: 'Успешно',
        description: 'Данные обновлены',
        duration: 3
      });
      
      return result;
    } catch (error) {
      handleError(error, 'updatePerson');
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, people: false }));
    }
  }, [handleError]);

  // Обновление локальных данных человека 
  const updatePersonLocally = useCallback((id, field, value) => {
    
    setPeople(prev => prev.map(person => {
      if (person.id === id) {
        const updatedPerson = { ...person };
        const keys = field.split('.');
        
        if (keys.length > 1) {
          updatedPerson[keys[0]] = { ...updatedPerson[keys[0]], [keys[1]]: value };
        } else {
          updatedPerson[field] = value;
        }
        
        return updatedPerson;
      }
      return person;
    }));
  }, []);

  // Получение родственников пользователя
  const getPersonRelations = useCallback(async (userId) => {
    try {
      const relations = await getUserRelations(userId);
      return relations || [];
    } catch (error) {
      handleError(error, 'getPersonRelations');
      return [];
    }
  }, [handleError]);

  // Создание новой родственной связи
  const addPersonRelation = useCallback(async (relationData) => {
    try {
      setLoading(prev => ({ ...prev, people: true }));
      
      const result = await createRelation(relationData);
      
      notification.success({
        message: 'Успешно',
        description: 'Родственная связь создана',
        duration: 3
      });
      
      return result;
    } catch (error) {
      handleError(error, 'addPersonRelation');
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, people: false }));
    }
  }, [handleError]);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = {
    // Данные
    people,
    notifications,
    dates,
    
    // Состояния
    loading,
    errors,
    
    // Методы
    setPeople,
    setNotifications,
    addPerson,
    updatePerson,
    loadAllData,
    updatePersonLocally,
    getPersonRelations,
    addPersonRelation,  // Добавляем новый метод
    
    // Утилиты
    handleError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};