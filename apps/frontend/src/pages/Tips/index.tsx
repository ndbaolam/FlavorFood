import React, { useEffect, useState, useMemo } from 'react';
import FilterTips from '../../components/FilterTips';
import TipsCard from '../../components/TipsCard';
import { TipsItem } from './tip.interface';
import axiosInstance from '../../services/axiosInstance';
import SearchBox from '../../components/Search';

const LIMIT = 12;

const Tips: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [allTips, setAllTips] = useState<TipsItem[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
          withCredentials: true,
        });
        setAllTips(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy tip:', error);
      }
    };

    fetchTips();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeGenre, searchTitle]);

  const filteredTips = useMemo(() => {
    return allTips.filter(tip => {
      const matchGenre = activeGenre
        ? tip.genres.some(genre => genre.genre_id === activeGenre)
        : true;
      const matchTitle = searchTitle
        ? tip.title.toLowerCase().includes(searchTitle.toLowerCase())
        : true;
      return matchGenre && matchTitle;
    });
  }, [allTips, activeGenre, searchTitle]);

  const totalPages = Math.ceil(filteredTips.length / LIMIT);
  const paginatedTips = filteredTips.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen max-w-screen">
      <main className="container mx-auto">
        <section className="text-center relative mt-20">
          <h2 className="text-4xl font-bold mb-2">Mẹo nhà bếp </h2>
          <p className="text-gray-600 text-lg mb-8">
            Tận dụng mọi góc bếp - Nấu ăn thông minh, tiết kiệm thời gian!
          </p>
        </section>

        <div className="justify-center items-center flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <SearchBox onSearch={setSearchTitle} isPopupOpen={false} />
        </div>

        {/* Tips Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {paginatedTips.length > 0 ? (
            paginatedTips.map((tip) => (
              <TipsCard key={tip.tip_id} tips={tip} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">Không có mẹo nào phù hợp.</p>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tips;
