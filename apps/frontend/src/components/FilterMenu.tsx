import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

interface FilterMenuProps {
  activeFilter: number | null;
  setActiveFilter: (filter: number | null) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ activeFilter, setActiveFilter }) => {
  const [categories, setCategories] = useState<{ category_id: number; title: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedCategories = ["Soup", "Main dish", "Appetizer", "Side dish", "Drink"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<{ category_id: number; title: string }[]>('/categories');
        setCategories(response.data);
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
        <>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeFilter === null
                ? 'bg-red-700 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveFilter(null)}
          >
            Tất cả
          </button>

          {categories
            .filter(category => selectedCategories.includes(
              category.title.charAt(0).toUpperCase() + category.title.slice(1)
            ))
            .map((category) => (
              <button
                key={category.category_id}
                onClick={() => setActiveFilter(category.category_id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
        ${activeFilter === category.category_id ? 'bg-red-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
              >
                {category.title.charAt(0).toUpperCase() + category.title.slice(1)}
              </button>
            ))}

        </>
      )}
    </div>
  );
};

export default FilterMenu;
