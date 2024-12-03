import React from 'react';
import { useNavigate } from 'react-router-dom';
import formatString from '../services/formatString';

interface Filter {
  label: string;
  value: string;
}

interface FilterTipsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterTips: React.FC<FilterTipsProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const navigate = useNavigate();

  // Define filters as an array of objects
  const filters: Filter[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Bảo quản nguyên liệu', value: 'storage' },
    { label: 'Kỹ thuật nấu ăn', value: 'techniques' },
    { label: 'Dụng cụ bếp', value: 'tools' },
    { label: 'Vệ sinh nhà bếp', value: 'cleaning' },
  ];

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);

    // Generate the correct URL path
    const formattedFilter = filter === 'Tất cả' ? '' : `/${formatString(filter)}`;
    const path = `/tips${formattedFilter}`;
    
    // Navigate to the corresponding path
    navigate(path);
  };

  return (
    <div className="flex gap-2 p-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterClick(filter.label)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${
                        activeFilter === filter.label
                          ? 'bg-red-700 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTips;
