import { BookOpen, Calculator, Check, CheckCircle, CircleGauge, Clock, Heart, Users, UtensilsCrossed, Vegan } from "lucide-react";
import React, { useState } from "react";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavorite } from "../../Favourite/FavoriteContext";
import { Recipe } from "../recipe.interface";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const id = slug?.slice(slug?.search("_") + 1);
  console.log("Fetching URL:", `/recipes/${id}`);

  try {
    const response = await axiosInstance.get<Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw new Response("Error fetching recipe data", { status: 500 });
  }
}

const RecipeDetail: React.FC = () => {
  const recipe = useLoaderData() as Recipe;
  const { isFavorite, toggleFavorite, refreshFavorites } = useFavorite();
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});



  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  // Lấy trạng thái yêu thích từ context
  const isLiked = isFavorite(recipe.recipe_id);

  const handleLike = async () => {
    const wasLiked = isFavorite(recipe.recipe_id);
    await toggleFavorite(recipe.recipe_id);

    setTimeout(refreshFavorites, 300);

    toast[wasLiked ? "info" : "success"](
      wasLiked ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!",
      { position: "top-right", autoClose: 2000 }
    );
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <main className="container mx-auto px-4">
        {/* Recipe Title and Description */}
        <article>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          </div>

          {/* Time, Calories, and Categories Section */}
          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-8">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-gray-400">|</span>
            <Clock className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Thời gian nấu</strong>
              <p>{recipe.time} phút</p>
            </div>
            <span className="text-gray-400">|</span>
            <Users className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Khẩu phần ăn</strong>
              <p>{recipe.serving} người</p>
            </div>
            <span className="text-gray-400">|</span>
            <CircleGauge className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Mức độ</strong>
              <p>{recipe.difficulty_level}</p>
            </div>
            <span className="text-gray-400">|</span>

            {/* Categories */}
            <UtensilsCrossed className="w-6 h-6 text-black" />
            <span className="flex flex-wrap gap-2">
              {recipe.categories?.length ? (
                recipe.categories.map((cat) => (
                  <span key={cat.category_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Không có danh mục</span>
              )}
            </span>

            <span className="text-gray-400">|</span>
            <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${isLiked ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
            >
              <Heart color={isLiked ? "white" : "gray"} fill={isLiked ? "white" : "none"} size={18} />
            </button>
          </div>

          {/* Recipe Image */}
          <div className="flex justify-between w-full gap-20">
            <img src={recipe.image} alt={recipe.title} className="w-2/3 rounded-lg shadow-md" />

            {/* Nutrition Section */}
            <div className="w-1/3 bg-blue-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-center">Thông tin dinh dưỡng</h2>
              <ul className="text-gray-700 space-y-2 mt-16">
                {recipe.nutrition?.length ? (
                  recipe.nutrition.map((nutrient) => (
                    <li key={nutrient.id} className="text-sm flex flex-col">
                      <div className="flex items-center justify-between">
                        <span>{nutrient.name}:</span>
                        <span>{nutrient.amount} {nutrient.unit}</span>
                      </div>
                      <hr className="my-2 border-gray-300" />
                    </li>
                  ))
                ) : (
                  <li>Không có thông tin dinh dưỡng nào.</li>
                )}
              </ul>
              <div className="mt-12 pt-12 border-t text-center">
                <p className="text-gray-600 italic font-medium">
                  "Dinh dưỡng hợp lý là chìa khóa cho một cơ thể khỏe mạnh!"
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8">
            <h2 className="p-4 text-gray-700 text-xl">{recipe.description}</h2>
          </div>

          <div className="flex gap-8 ">
      {/* Thành phần */}
      <div className="bg-gray-50 p-4 rounded-lg shadow flex-1 min-w-[300px]">  
        <h3 className="text-lg font-semibold text-green-700 flex items-center">
          <Vegan className="mr-2" /> {/* Icon cho Thành phần */}
          Thành phần
        </h3>
        <ul className="text-gray-700 space-y-1 mt-4">
          {recipe.ingredients.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <Check size={16} className="text-green-600" /> {/* Icon cho từng thành phần */}
              {item.ingredient}: {item.quantity} {item.unit}
            </li>
          ))}
        </ul>
      </div>
      
     {/* Hướng dẫn nấu ăn */}
     <div className="bg-gray-50 p-4 rounded-lg shadow flex-1 min-w-[300px]"> 
     <h3 className="text-lg font-semibold text-blue-700 flex items-center">
          <BookOpen className="mr-2" /> {/* Icon cho Hướng dẫn nấu ăn */}
          Hướng dẫn nấu ăn
        </h3>
        <ul className="text-gray-700 space-y-2 mt-4">
          {recipe.steps.map((item) => (
            <li key={item.number} className="flex items-start gap-2">
              <span 
                className={`bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold cursor-pointer ${completedSteps[item.number] ? 'line-through' : ''}`}
                onClick={() => setCompletedSteps((prev) => ({
                  ...prev,
                  [item.number]: !prev[item.number],
                }))}
              >
                {item.number}
              </span>
              {item.step}
            </li>
          ))}
        </ul>
      </div>
    </div>
        </article>
      </main>
    </div>
  );
};

export default RecipeDetail;