import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterMenu from '../../components/FilterMenu';
import RecipeCard from '../../components/RecipeCard';
import SearchBox from '../../components/Search';
import { useFavorite } from '../Favourite/FavoriteContext';
import axiosInstance from '../../services/axiosInstance';
import { Recipe } from './recipe.interface';
import { checkAuth } from '../../utils/auth';

const LIMIT = 12;

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const location = useLocation();
  const [isFilterReady, setIsFilterReady] = useState(false);


  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isFavorite, toggleFavorite, refreshFavorites } = useFavorite();

  const handleToggleFavorite = async (recipeId: number) => {
    try {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
          position: "top-right",
          autoClose: 2000
        });
        navigate('/sign-in', { state: { returnTo: '/dish' } });
        return;
      }

      const wasLiked = isFavorite(recipeId);
      await toggleFavorite(recipeId);

      toast[wasLiked ? "info" : "success"](
        wasLiked ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!",
        { position: "top-right", autoClose: 2000 }
      );

      setTimeout(refreshFavorites, 300);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra khi thao tác với yêu thích!", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const offset = LIMIT * (currentPage - 1);
      let allRecipes: Recipe[] = [];

      if (activeFilter !== null) {
        const filterQuery = `/categories/${activeFilter}?offset=0&limit=1000`;
        const response = await axiosInstance.get<{ recipes: Recipe[] }>(filterQuery);
        allRecipes = response.data.recipes || [];
      } else {
        const response = await axiosInstance.get<Recipe[]>('/recipes');
        allRecipes = response.data || [];
      }
      let filteredRecipes = [...allRecipes];

      if (searchTitle.trim()) {
        const keyword = searchTitle.toLowerCase();
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(keyword) ||
            recipe.ingredients?.some((ing) =>
              ing.ingredient.toLowerCase().includes(keyword)
            )
        );
      }
      if (selectedDifficulty) {
        filteredRecipes = filteredRecipes.filter(
          (recipe) => recipe.difficulty_level === selectedDifficulty
        );
      }

      filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
      const total = filteredRecipes.length;
      const calculatedTotalPages = Math.ceil(total / LIMIT);
      setTotalRecipes(total);
      setTotalPages(calculatedTotalPages);
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(calculatedTotalPages);
        return;
      }
      const paginatedRecipes = filteredRecipes.slice(offset, offset + LIMIT);
      setRecipes(paginatedRecipes);
      setHasNextPage(offset + LIMIT < total);
    } catch (error) {
      setError('Lỗi khi tải công thức. Vui lòng thử lại!');
      console.error('Fetch Error:', error);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, currentPage, searchTitle, selectedDifficulty]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTitle]);

  useEffect(() => {
    if (isFilterReady) {
      fetchRecipes();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchRecipes, isFilterReady]);


  useEffect(() => {
    const params: any = {};
    if (searchTitle) params.title = searchTitle;
    if (activeFilter !== null) params.category = activeFilter;
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [activeFilter, searchTitle, selectedDifficulty, currentPage, setSearchParams]);


  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveFilter(Number(categoryParam));
    }

    const pageParam = searchParams.get('page');
    if (pageParam) {
      setCurrentPage(Number(pageParam));
    }

    const difficultyParam = searchParams.get('difficulty');
    if (difficultyParam) {
      setSelectedDifficulty(difficultyParam);
    }

    const titleParam = searchParams.get('title');
    if (titleParam !== null) {
      setSearchTitle(titleParam);
    }

    setIsFilterReady(true);
  }, [searchParams]);

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
      <main className="container mx-auto">
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Hôm nay ăn gì</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các món ăn ngon cùng chúng tôi
          </p>
        </section>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <FilterMenu
            activeFilter={activeFilter}
            setActiveFilter={(filterId) => {
              setActiveFilter(filterId);
              setCurrentPage(1);
            }}
            setCurrentPage={setCurrentPage}
          />
          <SearchBox
            onSearch={setSearchTitle}
            isPopupOpen={false}
            value={searchTitle}
          />
          <div className="flex gap-4 mb-4">
            <select
              className="border-2 border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
              value={selectedDifficulty || ''}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value || null);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả độ khó</option>
              <option value="Dễ">Dễ</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khó">Khó</option>
            </select>

          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipe={recipe}
                    isLiked={isFavorite(recipe.recipe_id)}
                    onToggleFavorite={() => handleToggleFavorite(recipe.recipe_id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg">Không tìm thấy công thức nào phù hợp.</p>
                </div>
              )}
            </section>

            {renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default Meals;