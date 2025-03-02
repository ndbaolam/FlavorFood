import React, { useState, useEffect } from 'react';
import { Clock, Calculator, Heart } from 'lucide-react';
import formatString from '../services/formatString';
import { Recipe } from '../pages/Meals/recipe.interface';
import { toast } from 'react-toastify';

interface RecipeCardProps {
  recipe: Recipe;
  isLiked: boolean;
  onToggleFavorite: (recipeId: number) => void;
  currentCategoryPath?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isLiked, onToggleFavorite, currentCategoryPath }) =>  {
  const [localLiked, setLocalLiked] = useState<boolean>(isLiked);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setLocalLiked((prevLiked) => !prevLiked);
    onToggleFavorite(recipe.recipe_id);  //callback

    // Hiển thị thông báo khi thêm hoặc xóa khỏi yêu thích
    if (!localLiked) {
      toast.success("Đã thêm vào danh sách yêu thích!", {
        
      });
    } else {
      toast.info("Đã xóa khỏi danh sách yêu thích!", {
       
      });
    }
  };

  const formattedTitle: string = recipe.title ? formatString(recipe.title) : "no-title";
  const linkTo = `/dish/${formattedTitle}_${recipe.recipe_id}.html`;

  return (
    <a
      href={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg hover:scale-105 transition-all ease-in-out">
        <div className="relative flex justify-center">
          {
            recipe.image ? 
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full -mt-20 object-cover transform origin-center"
            /> :
              <img
                src="logo.png"
                alt={recipe.title}
                className="w-full h-full -mt-20 object-cover transform origin-center"/>
          }
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
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{recipe.time ?? 'Không rõ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                <span>{recipe.calories ?? '0'} kcal</span>
              </div>
            </div>

            {/* Favorite icon */}
            <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${localLiked ? 'bg-red-300' : 'bg-gray-200'}`}
            >
              <Heart
                color={localLiked ? 'white' : 'gray'}
                fill={localLiked ? 'white' : 'none'}
                size={18}
              />
            </button>
          </div>
        </div>
      </div>
    </a>
  );
};

export default RecipeCard;