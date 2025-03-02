import { Calculator, Clock, Heart, Users, UtensilsCrossed } from "lucide-react";
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Recipe } from "../recipe.interface";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavorite } from "../../Favourite/FavoriteContext";

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

  // Lấy trạng thái yêu thích từ context
  const isLiked = isFavorite(recipe.recipe_id);

  // 🔹 Toggle Favorite & Sync with Favorite List
  const handleLike = async () => {
    const wasLiked = isFavorite(recipe.recipe_id);
    await toggleFavorite(recipe.recipe_id);

    // 🔹 Ensure FavoriteList updates
    setTimeout(refreshFavorites, 300);

    if (wasLiked) {
      toast.info("Đã xóa khỏi danh sách yêu thích!", { position: "top-right", autoClose: 2000 });
    } else {
      toast.success("Đã thêm vào danh sách yêu thích!", { position: "top-right", autoClose: 2000 });
    }
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
            <div className="recipe-card">
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{
                  width: '40px',  // Width of the avatar
                  height: '40px',  // Height of the avatar
                  borderRadius: '50%',  // Make the image circular
                  objectFit: 'cover',  // Maintain aspect ratio while filling the space
                }}
              />
            </div>
            <div className=" items-center gap-2">
              {/* <strong className="text-black">{recipe.author}</strong> */}
              {/* <p>{recipe.date}</p> */}

            </div>
            <span className="text-gray-400 ">|</span>
            <Clock className="w-6 h-6 text-black" />
            <div className="items-center gap-2 text-black">

              <strong>Thời gian nấu</strong>
              <p>{recipe.time}</p>
            </div>
            <span className="text-gray-400">|</span>
            <Calculator className="w-6 h-6 text-black" />
            <div className=" items-center gap-2 text-black">

              <strong>Số lượng calories</strong>
              <p>{recipe.calories} calories</p>
            </div>
            <span className="text-gray-400">|</span>

            <Users className="w-6 h-6 text-black" />
            <div className="items-center gap-2 text-black">
              <strong>Khẩu phần ăn</strong>
              <p>{recipe.servings} người</p>
            </div>
            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-black" />
              {/* <span className="flex flex-wrap gap-2">
                  {recipe.categories.map((cat) => (
                    <span
                      key={cat.category_id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {cat.title}
                    </span>
                  ))}
                </span> */}
              <span className="flex flex-wrap gap-2">
                {recipe.categories?.length ? (
                  recipe.categories.map((cat) => (
                    <span key={cat.category_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {cat.title}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Không có danh mục</span>
                )}
              </span>

            </div>

            <span className="text-gray-400">|</span>
            <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${isFavorite(recipe.recipe_id) ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
            >
              <Heart
                color={isFavorite(recipe.recipe_id) ? "white" : "gray"}
                fill={isFavorite(recipe.recipe_id) ? "white" : "none"}
                size={18}
              />
            </button>
          </div>

          {/* Recipe Image */}
          <div className="flex justify-between w-full gap-20">
            <div className="mt-8 w-2/3">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="rounded-lg shadow-md w-full h-full"
              />
            </div>

            {/* Nutrition Section */}
            {/* <div className="w-1/3 bg-blue-50 p-6 mt-8 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Thông tin dinh dưỡng</h2>
                <div className="flex flex-col relative">
                  <ul className="text-gray-700 space-y-2">
                    {recipe.nutrition?.length > 0 ? (
                      recipe.nutrition.map((nutrient) => (
                        <li key={nutrient.nutrition_id} className="text-sm flex flex-col">
                          <div className="flex items-center justify-between">
                            <span>Năng lượng:</span>
                            <span>{nutrient.calories} kcal</span>
                          </div>
                          <hr className="my-2 border-gray-300" />
                          <div className="flex items-center justify-between">
                            <span>Protein:</span>
                            <span>{nutrient.protein} g</span>
                          </div>
                          <hr className="my-2 border-gray-300" />
                          <div className="flex items-center justify-between">
                            <span>Chất béo:</span>
                            <span>{nutrient.fat} g</span>
                          </div>
                          <hr className="my-2 border-gray-300" />
                          <div className="flex items-center justify-between">
                            <span>Carbohydrate:</span>
                            <span>{nutrient.carbohydrates} g</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>Không có thông tin dinh dưỡng nào.</li>
                    )}
                  </ul>
                </div>
              </div> */}
          </div>

          {/* Description Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mt-4">Mô tả</h2>
            <p className="mt-4 text-gray-700">{recipe.description}</p>
          </div>

          {/* Ingredients Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Nguyên liệu</h2>
            <ul className="list-disc list-inside text-gray-700">
              {/* {recipe.ingredients.map((item) => (
                  <li key={item.ingredient_id}>
                    {item.name} : {item.unit}
                  </li>
                ))} */}
            </ul>
          </div>

          {/* Steps Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Các bước</h2>
            {/* {recipe.step.map((step) => (
                <div key={step.step_id} className="mb-6">
                  <h3 className="font-semibold">Bước {step.step_number}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))} */}
          </div>
        </article>
      </main>
    </div>
  );
};


export default RecipeDetail;