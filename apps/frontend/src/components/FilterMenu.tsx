import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface FilterMenuProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}
const FilterMenu: React.FC<FilterMenuProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const filterOptions = [
    { name: 'Tất cả', path: '/dish' },
    { name: 'Khai vị', path: '/dish/appetizer' },
    { name: 'Món chính', path: '/dish/main-course' },
    { name: 'Canh & Lẩu', path: '/dish/soup-hotpot' },
    { name: 'Đồ uống', path: '/dish/drink' },
    { name: 'Tráng miệng', path: '/dish/dessert' },
  ];

  React.useEffect(() => {
    const currentFilter = filterOptions.find(
      (filter) => filter.path === location.pathname
    );
    if (currentFilter) {
      setActiveFilter(currentFilter.name);
    }
  }, [location.pathname]);

  const handleFilterClick = (filterName: string, path: string) => {
    setActiveFilter(filterName);
    navigate(path);
  };

  return (
    <div className="flex gap-2 p-4">
      {filterOptions.map(({ name, path }) => (
        <button
          key={name}
          onClick={() => handleFilterClick(name, path)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              activeFilter === name
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default FilterMenu;
