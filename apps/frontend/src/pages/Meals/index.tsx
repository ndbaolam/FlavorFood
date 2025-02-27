import React, { useEffect, useState } from 'react';
import FilterMenu from '../../components/FilterMenu';
import RecipeCard from '../../components/RecipeCard';
import axiosInstance from '../../services/axiosInstance';
import { Recipe } from './recipe.interface';
import { useFavorite } from '../Favourite/FavoriteContext';

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { isFavorite, toggleFavorite } = useFavorite();

  const fetchRecipes = async () => {
    try {
      let response;
      if (activeFilter) {
        response = await axiosInstance.get(`/categories/${activeFilter}`);
        setRecipes(response.data.recipes);
      } else {
        response = await axiosInstance.get<Recipe[]>('/recipes', {
          withCredentials: true,
        });
        setRecipes(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách món ăn:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [activeFilter]);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Hôm nay ăn gì</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các món ăn ngon cùng chúng tôi
          </p>
        </section>

        <FilterMenu
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />


        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.recipe_id}
              recipe={recipe}
              isLiked={isFavorite(recipe.recipe_id)}
              onToggleFavorite={() => toggleFavorite(recipe.recipe_id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Meals;
