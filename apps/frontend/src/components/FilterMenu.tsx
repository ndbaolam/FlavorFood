import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

interface FilterMenuProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilter, setActiveFilter }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<{ title: string }[]>('/categories');
        const categoryTitles = response.data.map((category) => category.title);
        setCategories(['Tất cả', ...categoryTitles]);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeFilter === category 
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))
      )}
    </div>
  );
};

export default FilterMenu;
