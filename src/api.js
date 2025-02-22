import axios from "axios";

const API_GET_USERS = "/api/users";  // Используем локальный прокси
const API_POST_USER = "/api/user/reg";
const API_PUT_USER = "/api/user";

// Функция для получения данных пользователя по chatId
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

export const addUser = async (firstName, lastName, fatherName, birthDate, mobileNumber, email, gender, city, metroStation, street, houseNumber, entrance, apartment, floor) => {
    try {
        const response = await axios.post(API_POST_USER, {
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
            }
        });
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
  
      const { id, address, religiousInfo, ...userData } = user;
  
      const response = await axios.put(`${API_PUT_USER}/${id}`, {
        ...userData,
        address: { ...address },
        religiousInfo: { ...religiousInfo },
      });
  
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error.response?.data || error.message);
      throw error;
    }
};


