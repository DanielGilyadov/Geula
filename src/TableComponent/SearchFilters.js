// searchFilters.js
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

  useEffect(() => {
    filterData(searchText, selectedCity, selectedReligions);
  }, [people, searchText, selectedCity, selectedReligions]);

  const uniqueCities = [...new Set(people.map((p) => p.address?.city).filter(Boolean))];

  const filterData = (search, city, religions) => {
    let filteredData = [...people];

    if (search) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((field) =>
          String(field).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (city && city !== 'all') {
      filteredData = filteredData.filter((item) => item.address?.city === city);
    }

    if (religions.length > 0) {
      filteredData = filteredData.filter((item) =>
        religions.every((religion) => item.religiousInfo?.[religion])
      );
    }

    setFilteredPeople(filteredData);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
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
    </div>
  );
};

export default SearchFilters;
