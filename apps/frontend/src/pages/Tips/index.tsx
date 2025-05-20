import React, { useEffect, useState, useMemo } from 'react';
import FilterTips from '../../components/FilterTips';
import TipsCard from '../../components/TipsCard';
import { TipsItem } from './tip.interface';
import axiosInstance from '../../services/axiosInstance';
import SearchBox from '../../components/Search';
import { useSearchParams } from 'react-router-dom';

const LIMIT = 12;

const Tips: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo state từ URL query params 1 lần khi mount
  const [searchTitle, setSearchTitle] = useState(() => searchParams.get('search') || '');
  const [activeGenre, setActiveGenre] = useState<number | null>(() => {
    const genreParam = searchParams.get('genre');
    return genreParam ? parseInt(genreParam) : null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam) : 1;
  });

  const [allTips, setAllTips] = useState<TipsItem[]>([]);

  // Fetch tips data khi mount
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

  // Khi searchTitle hoặc activeGenre thay đổi, reset currentPage về 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeGenre, searchTitle]);

  // Cập nhật URL query params khi state thay đổi
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTitle) params.search = searchTitle;
    if (activeGenre) params.genre = activeGenre.toString();
    if (currentPage && currentPage > 1) params.page = currentPage.toString();

    setSearchParams(params, { replace: true });
  }, [searchTitle, activeGenre, currentPage, setSearchParams]);

  // Lọc tips theo searchTitle và activeGenre
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // ... (phần renderPagination và return giữ nguyên)

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum: number, label?: string) => (
      <button
        key={label || pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`px-3 py-1 rounded ${
          currentPage === pageNum
            ? "bg-blue-500 text-white font-medium"
            : "bg-white text-gray-600 hover:bg-blue-100"
        }`}
      >
        {label || pageNum}
      </button>
    );

    const paginationItems = [];
    
    paginationItems.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded mr-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
        aria-label="Trang trước"
      >
        &lt;
      </button>
    );

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(renderPageButton(i));
      }
    } else {
      paginationItems.push(renderPageButton(1));

      if (currentPage > 2) {
        paginationItems.push(<span key="ellipsis1" className="px-2">...</span>);
      } else if (currentPage === 2) {
        paginationItems.push(renderPageButton(2));
      }

      if (currentPage > 2) {
        paginationItems.push(renderPageButton(currentPage));
      }
      
      if (currentPage < totalPages - 1) {
        paginationItems.push(renderPageButton(currentPage + 1));
      }
      
      if (currentPage < totalPages - 2) {
        paginationItems.push(<span key="ellipsis2" className="px-2">...</span>);
      } else if (currentPage === totalPages - 2) {
        paginationItems.push(renderPageButton(totalPages - 1));
      }

      if (currentPage < totalPages) {
        paginationItems.push(renderPageButton(totalPages));
      }
    }

    paginationItems.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded ml-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
        aria-label="Trang sau"
      >
        &gt;
      </button>
    );

    return (
      <div className="flex justify-end items-center space-x-1 mt-6">
        {paginationItems}
      </div>
    );
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
          <SearchBox
            onSearch={setSearchTitle}
            isPopupOpen={false}
            value={searchTitle}
          />
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

        {renderPagination()}
      </main>
    </div>
  );
};

export default Tips;
