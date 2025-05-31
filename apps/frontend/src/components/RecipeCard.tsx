import React, { useState, useEffect } from "react";
import { Clock, Heart } from "lucide-react";
import formatString from "../utils/formatString";
import { Recipe } from "../pages/Meals/recipe.interface";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { checkAuth } from "../utils/auth";

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
  const navigate = useNavigate();

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);
  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
          position: "top-right",
          autoClose: 2000
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/sign-in', { state: { returnTo: `/dish/${formattedTitle}_${recipe.recipe_id}.html` } });
        return;
      }

      setLocalLiked((prevLiked) => !prevLiked);
      onToggleFavorite(recipe.recipe_id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra khi thao tác với yêu thích!", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };
  const location = useLocation()
  const formattedTitle = recipe.title
    ? formatString(recipe.title)
    : "no-title";

  const params = new URLSearchParams(location.search);
  params.set("fromList", "1");
  const linkTo = `/dish/${formattedTitle}_${recipe.recipe_id}.html?${params.toString()}`;

  return (
    <Link
      to={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-xl shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-[460px] w-[300px]">

        {/* Hình ảnh */}
        <div className="relative flex justify-center h-[220px]">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-[220px] object-cover transform origin-center rounded-t-xl"
            />
          ) : (
            <img
              src="../../logo.png"
              alt={recipe.title}
              className="w-full h-full object-cover transform origin-center"
            />
          )}
        </div>

        {/* Nội dung món ăn */}
        <div className="pr-6 pl-6 pb-6 flex flex-col h-[230px] justify-between">
          <div className="flex-grow">
            <h2 className="mt-4 text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2 h-[60px]">
              {recipe.title}
            </h2>

            <p className="text-gray-600 text-center text-sm line-clamp-3 h-[70px] mb-2">
              {recipe.description}
            </p>
          </div>

          <div className="border-t border-gray-300 my-2 w-full" />

          {/* Thời gian và yêu thích */}
          <div className="flex justify-between items-center text-gray-500 text-sm w-full gap-4 mb-4">
            {/* Thời gian */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-base">{recipe.time} phút</span>
            </div>

            <button
              onClick={handleLike}
              className={`w-8 h-8 flex items-center justify-center p-2 rounded-full transition-all duration-300 ${localLiked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              <Heart
                color={localLiked ? "white" : "gray"}
                fill={localLiked ? "white" : "none"}
                size={20}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;