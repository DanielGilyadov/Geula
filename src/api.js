import axios from "axios";

const API_GET_USERS = "/api/api/users",  // Используем локальный прокси
      API_POST_USER = "/api/api/user/reg",
       API_PUT_USER = "/api/api/user",
       API_GET_NOTI = "/api/api/notifications",
       API_DATES    = "/api/api/dates"


export const getUsers = async () => {
    try {
        const response = await axios.get(API_GET_USERS);
        console.log(response.data);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const addUser = async (userData) => {
    try {
        const {
            firstName,
            lastName,
            fatherName,
            birthDate,
            mobileNumber,
            email,
            gender,
            city,
            metroStation,
            street,
            houseNumber,
            entrance,
            apartment,
            floor,
            relations = []
        } = userData;

        const requestData = {
            firstName,
            lastName,
            fatherName,
            birthDate,
            mobileNumber,
            email,
            gender,
            address: {
                city,
                metroStation,
                street,
                houseNumber,
                entrance,
                apartment,
                floor
            },
            relations: relations
        };

        const response = await axios.post(API_POST_USER, requestData);
        return response.data; // Возвращаем данные после добавления
    } catch (error) {
        console.error("Ошибка при создании:", error);
        throw error;
    }
};

export const updateUser = async (user) => {
    try {
      if (!user?.id) {
        console.error("Ошибка: userId отсутствует");
        return;
      }
  
      const { id, address, religiousInfo, relations, ...userData } = user;
  
      const response = await axios.put(`${API_PUT_USER}/${id}`, {
        ...userData,
        address: { ...address },
        religiousInfo: { ...religiousInfo },
        relations: relations || [],
      });
  
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error.response?.data || error.message);
      throw error;
    }
};


export const getNotifications = async () => {
    try {
        const response = await axios.get(API_GET_NOTI);
        console.log(response.data);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const getDates = async () => {
    try {
        const response = await axios.get(API_DATES);
        console.log(response.data);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const getUserRelations = async (userId) => {
    try {
        const response = await axios.get(`/api/api/relations/user/${userId}`);
        console.log(response.data);
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error("Ошибка при получении родственников:", error);
        return null; // Возвращаем null в случае ошибки
    }
};