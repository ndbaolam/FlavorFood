import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useFavorite } from "../../lib/FavoriteContext";
import RecipeCard from "../../components/RecipeCard";
import { useSearchParams } from 'react-router-dom';
import SearchBox from "../../components/Search";
import { flexibleSearch } from "../../utils/vietnameseUtils";

const Favourite: React.FC = () => {
  const { favorites, isFavorite, toggleFavorite, refreshFavorites } = useFavorite();
  const [detailedFavorites, setDetailedFavorites] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTitle, setSearchTitle] = useState(() => searchParams.get('search') || '');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailedData = await Promise.all(
          favorites.map(async (item) => {
            const response = await axiosInstance.get(`/recipes/${item.recipe_id}`);
            return { ...response.data, favorite_id: item.favorite_id };
          })
        );
        setDetailedFavorites(detailedData);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết món ăn:", error);
      }
    };

    if (favorites.length > 0) {
      fetchDetails();
    } else {
      setDetailedFavorites([]);
    }
  }, [favorites]);

  // Đồng bộ searchTitle vào URL query
  useEffect(() => {
    if (searchTitle) {
      setSearchParams({ search: searchTitle });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  }, [searchTitle]);

  const handleToggleFavorite = async (recipeId: number) => {
    const wasLiked = isFavorite(recipeId);
    await toggleFavorite(recipeId);

    if (wasLiked) {
      setDetailedFavorites(prev => prev.filter(r => r.recipe_id !== recipeId));
    } else {
      try {
        const response = await axiosInstance.get(`/recipes/${recipeId}`);
        setDetailedFavorites(prev => [...prev, response.data]);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết món ăn:", error);
      }
    }

    setTimeout(refreshFavorites, 300);
  };

  const filteredFavorites = detailedFavorites.filter(recipe =>
    flexibleSearch([recipe.title, recipe.ingredients?.join(' ') || ''], searchTitle)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFavorites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum: number, label?: string) => (
      <button
        key={label || pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`px-3 py-1 rounded ${currentPage === pageNum
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
    <div className="min-h-screen">
      <main className="mx-auto container">
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Danh sách món ăn yêu thích</h2>
          <p className="text-black text-lg mb-8 mt-4 italic">
          Những món ăn bạn yêu thích – luôn ở đây để chờ bạn khám phá lại bất cứ lúc nào.
          </p>
        </section>
        <div className="justify-center items-center flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <SearchBox
            onSearch={setSearchTitle}
            isPopupOpen={false}
            value={searchTitle}
            placeholder="Tìm kiếm món ăn/nguyên liệu"
            className="text-black min-w-64 pl-10 pr-4 border-2 border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
          />
        </div>

        {detailedFavorites.length === 0 ? (
          <p className="mt-10 text-center text-black">Bạn chưa có món ăn yêu thích nào.</p>
        ) : (
          <>
            <div className="p-4 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((recipe) => (
                <RecipeCard
                  key={recipe.favorite_id}
                  recipe={recipe}
                  isLiked={isFavorite(recipe.recipe_id)}
                  onToggleFavorite={() => handleToggleFavorite(recipe.recipe_id)}
                />
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default Favourite;
