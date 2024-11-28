import React, { useState } from 'react';
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
  isFavorite?: boolean; // Optional isFavorite field
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
  currentCategoryPath?: string; 
  onToggleFavorite?: (recipeId: number) => void; 
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, currentCategoryPath, onToggleFavorite }) => {
  const [isLiked, setIsLiked] = useState<boolean>(recipe.isFavorite || false); 

  // Toggle like status
  const handleLike = () => {
    setIsLiked((prevLiked) => !prevLiked); 
    if (onToggleFavorite) {
      onToggleFavorite(recipe.recipe_id); 
    }
  };

  const formattedTitle: string = formatString(recipe.title);
  const linkTo = `/dish/${formattedTitle}.html`;

  return (
    <Link
      to={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg hover:scale-105 transition-all ease-in-out">
        <div className="relative flex justify-center">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full -mt-20 object-cover transform origin-center"
          />
        </div>
        <div className="pr-6 pl-6 pb-6 flex flex-col items-center h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2">
            {recipe.title}
          </h2>
          <p className="text-gray-600 text-center mb-4 text-sm">{recipe.description}</p>
          <div className="border-t border-gray-300 my-4 w-full"></div>

          {/* Container for time, calories, and isFavorite */}
          <div className="flex justify-between items-center text-gray-500 text-sm w-full">
            <div className="flex gap-6">
              {/* Time and calories section */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>{recipe.calories} kcal</span>
              </div>
            </div>

            {/* Favorite icon */}
            <button 
              onClick={handleLike} 
              className={`flex items-center justify-center p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-gray-200'}`}
            >
              <Heart 
                color={isLiked ? 'white' : 'gray'} 
                fill={isLiked ? 'white' : 'none'}
                size={18} 
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
