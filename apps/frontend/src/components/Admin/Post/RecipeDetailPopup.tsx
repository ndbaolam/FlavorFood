import React from "react";
import { Recipe, Ingredient, Category, Step, Nutrition } from "../../../pages/Meals/recipe.interface";
import { BookOpen, Check, CircleGauge, Clock, Users, UtensilsCrossed, Vegan, X } from "lucide-react";
interface RecipeDetailPopupProps {

  recipe: Recipe;

  onClose: () => void;

}
const RecipeDetailPopup: React.FC<RecipeDetailPopupProps> = ({ recipe, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50  ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 max-w-6xl overflow-y-auto max-h-[90vh] ml-32">
        <article>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
            <button onClick={onClose} className="text-black  font-bold text-2xl">
              <X size={36} />
            </button>
          </div>

          {/* Time, Calories, and Categories Section */}
          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-8">

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
            {/* <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${isLiked ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
            >
              <Heart color={isLiked ? "white" : "gray"} fill={isLiked ? "white" : "none"} size={18} />
            </button> */}
          </div>

          {/* Recipe Image */}
          <div className="flex justify-between w-full gap-10">
            <img src={recipe.image} alt={recipe.title} className="w-1/2 rounded-lg shadow-md" />

            {/* Nutrition Section */}
            <div className="w-1/3 bg-blue-50 p-6 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">Thông tin dinh dưỡng</h2>
                <ul className="text-gray-700 space-y-2">
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
              </div>
              <div className="border-t text-center mt-4 pt-4"> {/* Adjusted margin and padding */}
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
                <Vegan className="mr-2" />
                Thành phần
              </h3>
              <ul className="text-gray-700 space-y-1 mt-4">
                {recipe.ingredients.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    {item.ingredient}: {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hướng dẫn nấu ăn */}
            <div className="bg-gray-50 p-4 rounded-lg shadow flex-1 min-w-[300px]">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <BookOpen className="mr-2" />
                Hướng dẫn nấu ăn
              </h3>
              <ul className="text-gray-700 space-y-2 mt-4">
                {recipe.steps.map((item) => (
                  <li key={item.number} className="flex items-start gap-2">

                    {item.number}: {item.step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
export default RecipeDetailPopup;