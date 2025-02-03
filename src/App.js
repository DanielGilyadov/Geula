import React, { useState } from 'react';
import { Layout, Menu, Table, Input, Button, Checkbox, Modal } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AddPerson from './AddPerson'; // Страница для добавления нового человека
import columns from './columns';
import EditModal from './EditModal'; // Импортируем модальное окно
import ExpandedRow from './ExpandedRow'; // Импортируем компонент

const { Content, Footer, Header } = Layout;

// Пример данных
const initialData = [
  { key: 1, name: 'Иван', familyName: 'Иванов', fathersName: 'Иванович', age: 32, importantDate: '01.01.2025', details: 'deed', importantDateDiscription: 'Бармицва', tfilin: true, relatives: [] },
  { key: 2, name: 'Мария', familyName: 'Смирнова', fathersName: 'Викторовна', age: 45, importantDate: '07.01.2025', importantDateDiscription: 'День рождения', tfilin: true, relatives: [] },
  { key: 3, name: 'Алексей', familyName: 'Петров', fathersName: 'Ааронович', age: 29, importantDate: '05.01.2025', importantDateDiscription: 'День рождения', tfilin: false, relatives: [] },
];

const App = () => {
  const [people, setPeople] = useState(initialData); // Состояние для списка людей
  const [searchText, setSearchText] = useState(''); // Состояние для текста поиска
  const [editingPerson, setEditingPerson] = useState(null); // Состояние для редактируемого человека
  const location = useLocation(); // Получаем текущий путь

  // Функция для обработки поиска
  const handleSearch = (value) => {
    const filteredData = initialData.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setSearchText(value);
    setPeople(filteredData);
  };

  const addPerson = (newPerson) => {
    const maxId = people.length > 0 ? Math.max(...people.map(p => p.key)) : 0;
    const personWithId = { ...newPerson, key: maxId + 1 };
    setPeople((prevPeople) => [...prevPeople, personWithId]);
  };

  // Обработчик для начала редактирования
  const onEdit = (record) => {
    setEditingPerson(record);
  };

  // Обработчик изменения данных
  const handleEditChange = (field, value) => {
    setEditingPerson((prev) => ({ ...prev, [field]: value }));
  };

  // Сохранение изменений
  const saveEdits = () => {
    setPeople((prev) => prev.map((person) => person.key === editingPerson.key ? editingPerson : person));
    setEditingPerson(null); // Закрываем редактирование
  };

  // Закрытие модального окна без сохранения изменений
  const cancelEdits = () => {
    setEditingPerson(null);
  };

  const onAddRelative = (key, relative) => {
    const updatedPeople = people.map((person) => {
      if (person.key === key) {
        return {
          ...person,
          relatives: [...person.relatives, relative],
        };
      }
      return person;
    });
    setPeople(updatedPeople);
  };

  const expandedRowRender = (record) => {
    return <ExpandedRow record={record} onAddRelative={onAddRelative} />;
  };

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <Link to="/">Главная</Link> {/* Ссылка на главную страницу */}
          </Menu.Item>
          <Menu.Item key="/add">
            <Link to="/add">
              <Button type="primary">Добавить</Button>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Input
                  placeholder="Поиск..."
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ marginBottom: 20 }}
                />
                {/* Блок с количеством людей */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3>Количество людей: <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{people.length}</span></h3>
                </div>
                <Table
                  dataSource={people}
                  columns={columns(onEdit)}
                  rowKey="key"
                  expandable={{
                    expandedRowRender: expandedRowRender,
                    rowExpandable: (record) => true,
                  }}
                />
              </>
            }
          />
          <Route path="/add" element={<AddPerson addPerson={addPerson} />} />
        </Routes>

        {/* Модальное окно для редактирования */}
        <EditModal
          visible={!!editingPerson}
          editingPerson={editingPerson}
          onCancel={cancelEdits}
          onSave={saveEdits}
          onChange={handleEditChange}
        />

      </Content>
      <Footer style={{ textAlign: 'center' }}>Metavision ©2025</Footer>
    </Layout>
  );
};

export default App;
