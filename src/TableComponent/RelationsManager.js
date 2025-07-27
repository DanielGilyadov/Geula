// src/TableComponent/RelationsManager.js
import { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useApp } from '../context/AppContext';

export const useRelationsManager = (userId) => {
  const [relations, setRelations] = useState([]);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRelation, setCurrentRelation] = useState({
    relatedUserId: null,
    relationType: "",
    createReverse: false,
    notes: "",
    relatedPersonInfo: null
  });
  const [isExternalPerson, setIsExternalPerson] = useState(false);
  const [externalPersonData, setExternalPersonData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    isDeceased: false,
    deceasedDate: "",
    mobileNumber: ""
  });

  const { getPersonRelations, people, addPersonRelation } = useApp();

  // Типы родственных связей
  const relationTypes = {
    'father': 'Отец',
    'mother': 'Мать', 
    'son': 'Сын',
    'daughter': 'Дочь',
    'brother': 'Брат',
    'sister': 'Сестра',
    'grandfather': 'Дедушка',
    'grandmother': 'Бабушка',
    'uncle': 'Дядя',
    'aunt': 'Тетя',
    'cousin': 'Двоюродный брат/сестра',
    'spouse': 'Супруг(а)',
    'wife': 'Жена',
    'husband': 'Муж',
    'other': 'Другое'
  };

  // Загрузка родственников при изменении userId
  useEffect(() => {
    if (userId) {
      loadRelations();
    }
  }, [userId]);

  // Загрузка родственников
  const loadRelations = async () => {
    setLoadingRelations(true);
    try {
      const userRelations = await getPersonRelations(userId);
      setRelations(userRelations || []);
    } catch (error) {
      console.error('Ошибка загрузки родственников:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось загрузить родственников'
      });
    } finally {
      setLoadingRelations(false);
    }
  };

  // Получение информации о пользователе из базы данных
  const getUserInfo = (userId) => {
    return people.find(p => p.id === userId);
  };

  // Форматирование отображения родственника
  const formatRelationDisplay = (relation) => {
    if (relation.relatedUser) {
      // Родственник из базы данных
      const user = getUserInfo(relation.relatedUser.id) || relation.relatedUser;
      return {
        name: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        birthDate: user.birthDate,
        isFromDatabase: true,
        isDeceased: false,
        userId: user.id
      };
    } else if (relation.relatedPersonInfo) {
      // Внешний родственник
      return {
        name: `${relation.relatedPersonInfo.firstName} ${relation.relatedPersonInfo.lastName}`,
        phone: relation.relatedPersonInfo.mobileNumber,
        birthDate: relation.relatedPersonInfo.birthDate,
        isFromDatabase: false,
        isDeceased: relation.relatedPersonInfo.isDeceased || false,
        deceasedDate: relation.relatedPersonInfo.deceasedDate
      };
    }
    return null;
  };

  // Получение цвета тега в зависимости от типа родственника
  const getRelationTagColor = (relationType) => {
    const colorMap = {
      'father': 'blue',
      'mother': 'pink',
      'son': 'green',
      'daughter': 'purple',
      'brother': 'orange',
      'sister': 'magenta',
      'grandfather': 'cyan',
      'grandmother': 'volcano',
      'uncle': 'geekblue',
      'aunt': 'gold',
      'cousin': 'lime',
      'spouse': 'red',
      'wife': 'red',
      'husband': 'red',
      'other': 'default'
    };
    return colorMap[relationType] || 'default';
  };

  // Получение типа связи на русском
  const getRelationTypeLabel = (type) => {
    return relationTypes[type] || type;
  };

  // Показать модальное окно для добавления родственника
  const showAddRelationModal = () => {
    setIsModalVisible(true);
  };

  // Валидация формы
  const validateForm = () => {
    if (!currentRelation.relationType) {
      notification.error({
        message: 'Ошибка',
        description: 'Выберите тип родственной связи'
      });
      return false;
    }

    if (isExternalPerson) {
      if (!externalPersonData.firstName?.trim() || !externalPersonData.lastName?.trim()) {
        notification.error({
          message: 'Ошибка',
          description: 'Заполните имя и фамилию родственника'
        });
        return false;
      }
    } else {
      if (!currentRelation.relatedUserId) {
        notification.error({
          message: 'Ошибка',
          description: 'Выберите пользователя из базы данных'
        });
        return false;
      }
    }

    return true;
  };

  // Обработка добавления родственника
  const handleAddRelation = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoadingRelations(true);

      let relationData = {
        userId: userId,
        relationType: currentRelation.relationType,
        createReverse: currentRelation.createReverse,
        notes: currentRelation.notes || ""
      };

      if (isExternalPerson) {
        relationData.relatedPersonInfo = {
          firstName: externalPersonData.firstName.trim(),
          lastName: externalPersonData.lastName.trim(),
          birthDate: externalPersonData.birthDate || "",
          gender: externalPersonData.gender || "",
          isDeceased: externalPersonData.isDeceased || false,
          mobileNumber: externalPersonData.mobileNumber || ""
        };

        // Добавляем дату смерти если родственник умер
        if (externalPersonData.isDeceased && externalPersonData.deceasedDate) {
          relationData.relatedPersonInfo.deceasedDate = externalPersonData.deceasedDate;
        }
      } else {
        relationData.relatedUserId = currentRelation.relatedUserId;
      }

      console.log('Отправляем данные на сервер:', relationData);

      // Отправляем запрос на создание связи
      await addPersonRelation(relationData);
      
      // Перезагружаем родственников
      await loadRelations();

      // Закрываем модальное окно и сбрасываем форму
      handleModalCancel();
      
      notification.success({
        message: 'Успешно',
        description: 'Родственник добавлен'
      });
    } catch (error) {
      console.error('Ошибка при добавлении родственника:', error);
      
      let errorMessage = 'Не удалось добавить родственника';
      
      if (error.message.includes('504') || error.message.includes('Gateway Timeout')) {
        errorMessage = 'Сервер не отвечает. Попробуйте позже.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Внутренняя ошибка сервера. Обратитесь к администратору.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Неверные данные. Проверьте заполненные поля.';
      } else if (error.message.includes('409')) {
        errorMessage = 'Такая связь уже существует.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      notification.error({
        message: 'Ошибка',
        description: errorMessage,
        duration: 5
      });
    } finally {
      setLoadingRelations(false);
    }
  };

  // Сброс формы и закрытие модального окна
  const handleModalCancel = () => {
    resetForm();
    setIsModalVisible(false);
  };

  // Сброс формы
  const resetForm = () => {
    setCurrentRelation({
      relatedUserId: null,
      relationType: "",
      createReverse: false,
      notes: "",
      relatedPersonInfo: null
    });
    setExternalPersonData({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      isDeceased: false,
      deceasedDate: "",
      mobileNumber: ""
    });
    setIsExternalPerson(false);
  };

  // Обработчики изменения формы
  const handleRelationTypeChange = (value) => {
    setCurrentRelation(prev => ({...prev, relationType: value}));
  };

  const handleRelatedUserChange = (value) => {
    setCurrentRelation(prev => ({...prev, relatedUserId: value}));
  };

  const handleCreateReverseChange = (checked) => {
    setCurrentRelation(prev => ({...prev, createReverse: checked}));
  };

  const handleNotesChange = (value) => {
    setCurrentRelation(prev => ({...prev, notes: value}));
  };

  const handleExternalPersonToggle = (checked) => {
    setIsExternalPerson(checked);
    if (checked) {
      // Очищаем связанного пользователя при переключении на внешнего
      setCurrentRelation(prev => ({...prev, relatedUserId: null}));
    }
  };

  const handleExternalPersonChange = (field, value) => {
    setExternalPersonData(prev => ({...prev, [field]: value}));
  };

  // Фильтрация пользователей (исключаем текущего пользователя)
  const getAvailableUsers = () => {
    return people.filter(person => person.id !== userId);
  };

  return {
    // Состояния
    relations,
    loadingRelations,
    isModalVisible,
    currentRelation,
    isExternalPerson,
    externalPersonData,
    relationTypes,

    // Методы
    loadRelations,
    formatRelationDisplay,
    getRelationTagColor,
    getRelationTypeLabel,
    showAddRelationModal,
    handleAddRelation,
    handleModalCancel,
    
    // Обработчики формы
    handleRelationTypeChange,
    handleRelatedUserChange,
    handleCreateReverseChange,
    handleNotesChange,
    handleExternalPersonToggle,
    handleExternalPersonChange,
    
    // Утилиты
    getAvailableUsers
  };
};