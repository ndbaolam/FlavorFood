import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FilterMenuProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilter, setActiveFilter }) => {
  const navigate = useNavigate();

  const filters = ['Tất cả', 'Bữa sáng', 'Bữa chính', 'Đồ uống', 'Tráng miệng', 'Bữa chay'];
  
  // Mapping filters to paths
  const filterPaths: { [key: string]: string } = {
    'Tất cả': '/meals',
    'Bữa sáng': '/meals/breakfast',
    'Bữa chính': '/meals/lunch',
    'Đồ uống': '/meals/drinks',
    'Tráng miệng': '/meals/dessert',
    'Bữa chay': '/meals/vegetarian',
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    const path = filterPaths[filter] || '/meals';
    navigate(path);  // Navigate to the path based on the filter
  };

  return (
    <div className="flex gap-2 p-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${activeFilter === filter 
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

export default FilterMenu;
