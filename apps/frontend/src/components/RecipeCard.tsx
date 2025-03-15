import React, { useState, useEffect } from "react";
import { Clock, Calculator, Heart } from "lucide-react";
import formatString from "../services/formatString";
import { Recipe } from "../pages/Meals/recipe.interface";
import { toast } from "react-toastify";

interface RecipeCardProps {
  recipe: Recipe;
  isLiked: boolean;
  onToggleFavorite: (recipeId: number) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isLiked,
  onToggleFavorite,
}) => {
  const [localLiked, setLocalLiked] = useState<boolean>(isLiked);

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setLocalLiked((prevLiked) => !prevLiked);
    onToggleFavorite(recipe.recipe_id);

    // Hiển thị thông báo khi thêm hoặc xóa khỏi yêu thích
    if (!localLiked) {
      toast.success("Đã thêm vào danh sách yêu thích!");
    } else {
      toast.info("Đã xóa khỏi danh sách yêu thích!");
    }
  };

  const formattedTitle: string = recipe.title
    ? formatString(recipe.title)
    : "no-title";
  const linkTo = `/dish/${formattedTitle}_${recipe.recipe_id}.html`;
  function formatDescription(description: string): string {
    if (!description) return "";

    let cleanText = description.replace(/<\/?[^>]+(>|$)/g, "");

    let match = cleanText.match(
      /(.*?gluten free.*?|.*?Quinoan and Chickpea Salad.*?|.*?serves \d+.*?|.*?contains \d+ calories.*?|.*?takes about \d+ minutes.*?|.*?spoonacular score of \d+%.*?)/gi
    );

    return match ? match.join(" ") : cleanText;
  }
  return (
    <a
      href={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col justify-between min-h-[350px]">
        {/* Hình ảnh */}
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
                className="w-full h-full -mt-20 object-cover transform origin-center" />
          }
        </div>

        {/* Nội dung món ăn */}
        <div className="pr-6 pl-6 pb-6 flex flex-col items-center h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2">
            {recipe.title}
          </h2>

          <div className="relative group">
            <p
              className="text-gray-600 text-center mb-4 text-sm line-clamp-3 min-h-[60px]"
              title={formatDescription(recipe.description)}
            >
              {formatDescription(recipe.description)}
            </p>
          </div>


          <div className="border-t border-gray-300 my-4 w-full"></div>

          {/* Thời gian và yêu thích */}
          <div className="flex justify-between items-center text-gray-500 text-sm w-full gap-4">
            {/* Thời gian */}
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              <span className="text-base">{recipe.time} p</span>
            </div>

            <button
              onClick={handleLike}
              className={`w-8 h-8 flex items-center justify-center p-2 rounded-full transition-all duration-300 ${localLiked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
            >
              <Heart
                color={localLiked ? "white" : "gray"}
                fill={localLiked ? "white" : "none"}
                size={24}
              />
            </button>
          </div>

        </div>
      </div>
    </a>
  );
};

export default RecipeCard;
