import React from 'react';
import { Clock, Calculator, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import formatString from '../services/formatString';

interface Recipe {
  recipe_id: number;
  title: string;
  description: string;
  time: string;
  calories: number;
  image: string;
  category: Category[];
  ingredients: Ingredient[];
  step: Step[];
  servings: number;
  difficulty_level: 'Dễ' | 'Trung bình' | 'Khó';
  nutrition: Nutrition[];
  ratings?: { averageRating: number; reviews: number };
  isFavorite?: boolean;
}

interface Ingredient {
  ingredient_id: number;
  description: string;
  name: string;
  unit: string;
}

interface Category {
  tag_id: number;
  name: string;
}

interface Step {
  step_id: number;
  step_number: number;
  description: string;
}

interface Nutrition {
  nutrition_id: number;
  calories: string;
  protein: string;
  fat: string;
  carbohydrates: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  currentCategoryPath?: string; // Allow this to be optional
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, currentCategoryPath }) => {
  const formattedTitle: String = formatString(recipe.title);
  const linkTo = `${formattedTitle}.html`;

  return (
    <Link
      to={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="h-[400px] bg-gradient-to-b from-blue-100 to-white rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out">
        <div className="relative flex justify-center">
          <img
            src={recipe.image || 'default-image.jpg'}
            alt={`Hình ảnh của công thức: ${recipe.title}`}
            className="w-full h-full -mt-20 object-cover transform origin-center"
          />
          {recipe.isFavorite && (
            <div className="absolute top-4 right-4">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col items-center h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-pink-500 transition-colors duration-300 cursor-pointer line-clamp-2">
            {recipe.title}
          </h2>
          <div className="border-t border-gray-300 my-4 w-full"></div>
          <div className="flex justify-between items-center text-gray-500 text-sm w-full">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{recipe.time || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>{recipe.calories ? `${recipe.calories} calories` : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};


export default RecipeCard;
