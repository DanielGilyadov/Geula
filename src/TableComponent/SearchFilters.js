import { useState, useEffect } from 'react';
import { Input, Select } from 'antd';

const { Option } = Select;

const religiousFilters = [
  { key: 'hasTT', label: 'Наличие Тфилина' },
  { key: 'isInNeed', label: 'Нуждающийся' },
  { key: 'passover', label: 'Пасхальный набор' },
  { key: 'keepsKosher', label: 'Соблюдает кашрут' },
  { key: 'childrenCamp', label: 'Детский лагерь' },
  { key: 'keepsSabbath', label: 'Соблюдает шаббат' },
  { key: 'hasCommunityBooks', label: 'Имеет общинные книги' },
  { key: 'seminarParticipant', label: 'Участник семинаров' },
];

const SearchFilters = ({ people, setFilteredPeople }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedReligions, setSelectedReligions] = useState([]);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  useEffect(() => {
    filterData();
  }, [people, searchText, selectedCity, selectedReligions, minAge, maxAge]);

  const uniqueCities = [...new Set(people.map((p) => p.address?.city).filter(Boolean))];

  const filterData = () => {
    let filteredData = [...people];

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    if (selectedCity && selectedCity !== 'all') {
      filteredData = filteredData.filter((item) => item.address?.city === selectedCity);
    }

    if (religiousFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedReligions.every((religion) => item.religiousInfo?.[religion])
      );
    }

    if (minAge || maxAge) {
      filteredData = filteredData.filter((item) => {
        const age = item.age;
        return (!minAge || age >= minAge) && (!maxAge || age <= maxAge);
      });
    }

    setFilteredPeople(filteredData);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: 20, flexWrap: 'wrap' }}>
      <Input
        placeholder="Поиск..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ flex: 1 }}
      />
      <Select
        placeholder="Выберите город"
        onChange={setSelectedCity}
        value={selectedCity}
        allowClear
        style={{ width: 200 }}
      >
        <Option value="all">Все города</Option>
        {uniqueCities.map((city) => (
          <Option key={city} value={city}>{city}</Option>
        ))}
      </Select>
      <Select
        mode="multiple"
        placeholder="Фильтр по религиозным признакам"
        onChange={setSelectedReligions}
        value={selectedReligions}
        allowClear
        style={{ width: 250 }}
      >
        {religiousFilters.map((filter) => (
          <Option key={filter.key} value={filter.key}>{filter.label}</Option>
        ))}
      </Select>
      <Input
        placeholder="Мин. возраст"
        type="number"
        value={minAge}
        onChange={(e) => setMinAge(e.target.value)}
        style={{ width: 120 }}
      />
      <Input
        placeholder="Макс. возраст"
        type="number"
        value={maxAge}
        onChange={(e) => setMaxAge(e.target.value)}
        style={{ width: 120 }}
      />
    </div>
  );
};

export default SearchFilters;
