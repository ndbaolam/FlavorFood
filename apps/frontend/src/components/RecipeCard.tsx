import React, { useState, useEffect } from "react";
import { Clock, Heart, Star } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import formatString from "../utils/formatString";
import { checkAuth } from "../utils/auth";
import { Recipe } from "../pages/Meals/recipe.interface";

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
  const location = useLocation();

  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);

  const formattedTitle = recipe.title ? formatString(recipe.title) : "no-title";
  const params = new URLSearchParams(location.search);
  params.set("fromList", "1");
  const linkTo = `/dish/${formattedTitle}_${recipe.recipe_id}.html?${params.toString()}`;

  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
          position: "top-right",
          autoClose: 2000,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/sign-in", {
          state: { returnTo: `/dish/${formattedTitle}_${recipe.recipe_id}.html` },
        });
        return;
      }

      setLocalLiked((prev) => !prev);
      onToggleFavorite(recipe.recipe_id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra khi thao tác với yêu thích!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <Link
      to={linkTo}
      className="block relative pt-20 cursor-pointer"
      aria-label={`Xem chi tiết cho ${recipe.title}`}
    >
      <div className="bg-gradient-to-b from-blue-100 to-white rounded-xl shadow-lg hover:scale-105 transition-all ease-in-out flex flex-col h-[460px] w-[300px]">

        <div className="relative h-[220px] w-full">
          <img
            src={recipe.image || "../../logo.png"}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <button
            onClick={handleLike}
            className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center p-2 rounded-full transition-all duration-300 ${localLiked ? "bg-red-500 text-white" : "bg-gray-200"
              } shadow`}
          >
            <Heart
              color={localLiked ? "white" : "black"}
              fill={localLiked ? "white" : "none"}
              size={20}
            />
          </button>
        </div>


        <div className="p-6 flex flex-col h-[230px] ">
          <div>
            <h2 className="text-xl font-semibold text-black mb-2 text-center hover:text-blue-500 transition-colors duration-300 line-clamp-2">
              {recipe.title}
            </h2>
            <p className="text-black text-center text-sm line-clamp-3 mb-2">
              {recipe.description}
            </p>
          </div>


          <div className="border-t border-black w-full my-2" />

          <div className="flex justify-between items-center text-sm w-full gap-4">
            <div className="flex items-center gap-2 text-black">
              <Star className="w-5 h-5 text-yellow-700 " />
              <span className="text-base font-medium">
                {recipe.average_rating ? recipe.average_rating.toFixed(1) : "0.0"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <Clock className="w-5 h-5" />
              <span className="text-base">{recipe.time} phút</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
