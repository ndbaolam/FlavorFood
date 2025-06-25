import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

interface FilterTipsProps {
  activeFilter: number | null;
  setActiveFilter: (filter: number | null) => void;
}

const FilterTips: React.FC<FilterTipsProps> = ({ activeFilter, setActiveFilter }) => {
  const [genres, setGenres] = useState<{ genre_id: number; title: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosInstance.get<{ genre_id: number; title: string }[]>('/tip-genres/all');
        setGenres(response.data);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {loading ? (
        <p className="text-black">Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${activeFilter === null
                ? 'bg-red-700 text-white'
                : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
            onClick={() => setActiveFilter(null)}
          >
            Tất cả
          </button>
          {genres.map((genre) => (
            <button
              key={genre.genre_id}
              onClick={() => setActiveFilter(genre.genre_id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
                ${activeFilter === genre.genre_id ? 'bg-red-700 text-white' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
            >
              {genre.title}
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default FilterTips;
