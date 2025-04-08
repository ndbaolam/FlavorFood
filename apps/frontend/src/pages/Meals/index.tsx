import React, { useEffect, useState, useCallback } from 'react';
import FilterMenu from '../../components/FilterMenu';
import RecipeCard from '../../components/RecipeCard';
import axiosInstance from '../../services/axiosInstance';
import { Recipe } from './recipe.interface';
import { useFavorite } from '../Favourite/FavoriteContext';
import SearchBox from '../../components/Search';

const LIMIT = 24;

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipe, setTotalRecipe] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>('');

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
        response = await axiosInstance.get<{ recipes: Recipe[] }>(`/categories/${activeFilter}`);
        setRecipes(response.data.recipes || []);
        setTotalRecipe(response.data.recipes.length || 0);
      } else {
        response = await axiosInstance.get<{ data?: Recipe[]; total?: number }>(query);

        const recipesData = Array.isArray(response.data) ? response.data : response.data?.data;
        setRecipes(recipesData || []);
        setTotalRecipe(response.data?.total || recipesData?.length || 0);
      }
    } catch (error) {
      setError('Lỗi khi tải công thức. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, currentPage, searchTitle]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTitle]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const totalPages = Math.ceil(totalRecipe / LIMIT);

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
            setActiveFilter={setActiveFilter} 
            setCurrentPage={setCurrentPage} 
          />
           <SearchBox onSearch={setSearchTitle} isPopupOpen={false}/>
        </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipe={recipe}
                    isLiked={isFavorite(recipe.recipe_id)}
                    onToggleFavorite={async () => {
                      await toggleFavorite(recipe.recipe_id);
                      refreshFavorites();
                    }}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">Không có công thức nào.</p>
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <ul className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-black'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
      </main>
    </div>
  );
};

export default Meals;
