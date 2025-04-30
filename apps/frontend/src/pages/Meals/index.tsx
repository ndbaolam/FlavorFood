import React, { useEffect, useState, useCallback } from 'react';
import FilterMenu from '../../components/FilterMenu';
import RecipeCard from '../../components/RecipeCard';
import axiosInstance from '../../services/axiosInstance';
import { Recipe } from './recipe.interface';
import { useFavorite } from '../Favourite/FavoriteContext';
import SearchBox from '../../components/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LIMIT = 12;

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isFavorite, toggleFavorite, refreshFavorites } = useFavorite();

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      const offset = LIMIT * (currentPage - 1);
      let query = `/recipes?offset=${offset}&limit=${LIMIT}`;

      if (searchTitle) {
        query += `&title=${encodeURIComponent(searchTitle)}`;
      }

      if (activeFilter !== null) {
        const filterQuery = `/categories/${activeFilter}?offset=${offset}&limit=${LIMIT}`;
        response = await axiosInstance.get<{ recipes: Recipe[] }>(filterQuery);
        setRecipes(response.data.recipes || []);
        setHasNextPage((response.data.recipes?.length || 0) === LIMIT);
      } else {
        response = await axiosInstance.get<{ data?: Recipe[] }>(query);
        const recipesData = Array.isArray(response.data) ? response.data : response.data?.data;
        setRecipes(recipesData || []);

        setHasNextPage((recipesData?.length || 0) === LIMIT);
      }
    } catch (error) {
      setError('Lỗi khi tải công thức. Vui lòng thử lại!');
      console.error("Fetch Error:", error);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, currentPage, searchTitle]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);
  
  useEffect(() => {
    fetchRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeFilter, currentPage, searchTitle]);
  

  useEffect(() => {
    const params: any = {};
    if (searchTitle) params.title = searchTitle;
    if (activeFilter !== null) params.category = activeFilter;
    setSearchParams(params); 
  }, [activeFilter, searchTitle, setSearchParams]);
  

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveFilter(Number(categoryParam));
    }
  }, [searchParams]);

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Hôm nay ăn gì</h2>
          <p className="text-gray-600 text-lg mb-8">Khám phá các món ăn ngon cùng chúng tôi</p>
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
          <SearchBox onSearch={setSearchTitle} isPopupOpen={false} />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                recipe={recipe}
                isLiked={isFavorite(recipe.recipe_id)}
                onToggleFavorite={() => {
                  toggleFavorite(recipe.recipe_id).then(refreshFavorites);
                }}

              />
            ))
          ) : (
            <p className="text-center text-gray-500">Không có công thức nào.</p>
          )}
        </section>

        <div className="flex justify-center mt-8 items-center space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            ‹
          </button>

          {Array.from({ length: hasNextPage ? currentPage + 1 : currentPage }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => {
                setCurrentPage(index + 1);
                window.scrollTo({ top: 80, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded font-medium transition ${currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </main>
    </div>
  );
};

export default Meals;
