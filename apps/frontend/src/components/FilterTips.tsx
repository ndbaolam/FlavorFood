import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FilterTipsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterTips: React.FC<FilterTipsProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const navigate = useNavigate();

  const filters = [
    'Tất cả',
    'Bảo quản nguyên liệu',
    'Kỹ thuật nấu ăn',
    'Dụng cụ bếp',
    'Vệ sinh nhà bếp',
  ];
  // Mapping filter to pathsactiveFilter
  const filterPaths: { [key: string]: string } = {
    'Tất cả': '/tips',
    'Bảo quản nguyên liệu': '/tips/storage',
    'Kỹ thuật nấu ăn': '/tips/techniques',
    'Dụng cụ bếp': '/tips/tools',
    'Vệ sinh nhà bếp': '/tips/cleaning',
  };
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    const path = filterPaths[filter] || '/tips';
    navigate(path);
  };

  return (
    <div className="flex gap-2 p-4">
      {filters.map((filter, index) => (
        <button
          key={index}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${
                        activeFilter === filter
                          ? 'bg-red-700 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterTips;
