import axios from 'axios';

const API_URL              = 'https://geula-list.ru/users',
     API_REF_FRIEND        = 'https://geula-list.ru/user/reg';

      // Функция для получения данных пользователя по chatId
export const getUserByChatId = async () => {
    try {  
        const response = await axios.get(`${API_URL}`);
        debugger
        return response.data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return null; // Возвращаем null в случае ошибки
    }
};

export const addRefFriend = async (firstname, lastname, fathername, age) => {
    try {
        const response = await axios.post(`${API_REF_FRIEND}`, {
            firstname: firstname,
            lastname: lastname,
            fathername: fathername,
            age: age
        });
        return response.data; // Возвращаем данные после обновления
    } catch (error) {
        console.error('Ошибка при обновлении очков:', error);
        throw error; // Пробрасываем ошибку дальше
    }
};