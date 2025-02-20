import axios from 'axios';

const API_GET_USERS = 'https://geula-list.ru/users',
    API_POST_USER = 'https://geula-list.ru/user/reg';

// Функция для получения данных пользователя по chatId
export const getUserByChatId = async () => {
    try {
        const response = await axios.get(`${API_GET_USERS}`);
        console.log(response.data)
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const addRefFriend = async (firstName, lastName, fatherName, birthDate, mobileNumber, email, gender, city, metroStation, street, houseNumber, entrance, apartment, floor) => {
    try {
        const response = await axios.post(`${API_POST_USER}`, {
            firstName: firstName,
            lastName: lastName,
            fatherName: fatherName,
            birthDate: birthDate,
            mobileNumber: mobileNumber,
            email: email,
            gender: gender,
            address: {
                city: city,
                metroStation: metroStation,
                street: street,
                houseNumber: houseNumber,
                entrance: entrance,
                apartment: apartment,
                floor: floor
            }

        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};