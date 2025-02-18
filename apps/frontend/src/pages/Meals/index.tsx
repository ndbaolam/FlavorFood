import React, { useEffect, useState } from 'react';
import FilterMenu from '../../components/FilterMenu';
import RecipeCard from '../../components/RecipeCard';
import axiosInstance from '../../services/axiosInstance';
import { Recipe } from './recipe.interface';

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả');
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosInstance.get<Recipe[]>('recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
  
    fetchRecipes();
  }, []);

  const getCategoryPath = (filter: string): string => {
    switch (filter) {
      case 'Khai vị':
        return '/dish/appetizer';
      case 'Món chính':
        return '/dish/main-course';
      case 'Canh & Lẩu':
        return '/dish/soup-hotpot';
      case 'Đồ uống':
        return '/dish/drink';
      case 'Tráng miệng':
        return '/dish/dessert';
      case 'Tất cả':
      default:
        return '/dish'; 
    }
  };

  const currentCategoryPath = getCategoryPath(activeFilter);

  const filteredRecipes = recipes.filter((recipe) => {
    if (activeFilter === 'Tất cả') return true;
    return recipe.categories.some((category) => category.title === activeFilter);
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        {/* Header Section */}
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Hôm nay ăn gì</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các món ăn ngon cùng chúng tôi
          </p>
        </section>

        {/* Filter Menu */}
        <section className="flex justify-center items-center">
          <FilterMenu activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </section>

        {/* Recipes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.recipe_id}
                recipe={recipe}
                currentCategoryPath={currentCategoryPath}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có món ăn nào phù hợp!
            </p>
          )}
        </section>
      </main>
    </div>
  );
};


export default Meals;

