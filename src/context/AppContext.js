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
    
    let errorMessage = 'Произошла неизвестная ошибка';
    
    if (error.message) {
      errorMessage = error.message;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Неверные данные запроса';
          break;
        case 404:
          errorMessage = 'Ресурс не найден';
          break;
        case 500:
          errorMessage = 'Внутренняя ошибка сервера';
          break;
        case 503:
          errorMessage = 'Сервис временно недоступен';
          break;
        case 504:
          errorMessage = 'Превышено время ожидания сервера';
          break;
        default:
          errorMessage = `Ошибка ${error.response.status}`;
      }
    }
    
    notification.error({
      message: 'Ошибка',
      description: errorMessage,
      duration: 4
    });
    
    setErrors(prev => ({ ...prev, [context]: error }));
  }, []);

  // Загрузка всех данных
  const loadAllData = useCallback(async () => {
    try {
      setLoading({ people: true, notifications: true, dates: true });
      
      const [usersData, notificationsData, datesData] = await Promise.all([
        getUsers().catch(err => {
          console.warn('Failed to load users:', err);
          return [];
        }),
        getNotifications().catch(err => {
          console.warn('Failed to load notifications:', err);
          return [];
        }),
        getDates().catch(err => {
          console.warn('Failed to load dates:', err);
          return {};
        })
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
      if (!userId) {
        throw new Error('ID пользователя не указан');
      }
      
      const relations = await getUserRelations(userId);
      return relations || [];
    } catch (error) {
      console.error('Ошибка получения родственников:', error);
      return [];
    }
  }, []);

  // Создание новой родственной связи
  const addPersonRelation = useCallback(async (relationData) => {
    try {
      // Валидация данных
      if (!relationData.userId) {
        throw new Error('ID пользователя обязателен');
      }
      
      if (!relationData.relationType) {
        throw new Error('Тип связи обязателен');
      }
      
      if (!relationData.relatedUserId && !relationData.relatedPersonInfo) {
        throw new Error('Необходимо указать связанного пользователя');
      }
      
      console.log('Создание связи с данными:', relationData);
      
      const result = await createRelation(relationData);
      
      return result;
    } catch (error) {
      console.error('Ошибка в addPersonRelation:', error);
      throw error;
    }
  }, []);

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
    addPersonRelation,
    
    // Утилиты
    handleError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};