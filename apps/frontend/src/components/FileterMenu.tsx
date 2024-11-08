import React, { useState } from 'react';

const FilterMenu = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  
  const filters = ['Tất cả', 'Bữa sáng', 'Bữa chính', 'Đồ uống', 'Tráng miệng','Bữa chay'];
  
  return (
    <div className="flex gap-2 p-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
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