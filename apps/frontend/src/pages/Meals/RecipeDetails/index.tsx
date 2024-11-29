import { Calculator, Clock, Heart, Users, UtensilsCrossed } from "lucide-react";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import formatString from '../../../services/formatString';

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
  author?: string;
  date?: string;
  avatar?: string;
}

interface Ingredient {
  ingredient_id: number;
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
const recipes: Recipe[] = [
  {
    recipe_id: 1,
    title: 'Bánh mì bơ',
    description: 'Một bữa sáng nhanh và ngon miệng với bơ chín được phết lên bánh mì nướng nguyên cám. Hoàn hảo để khởi đầu ngày mới đầy năng lượng!',
    time: '15 phút',
    calories: 250,
    image: 'https://i.pinimg.com/1200x/19/f6/4d/19f64d152f8350729a31295649ccedf6.jpg',
    category: [
      { tag_id: 1, name: 'Món chính' },
      { tag_id: 6, name: 'Khai vị' },
    ],
    ingredients: [
      { ingredient_id: 1, name: 'Quả bơ', unit: '1' },
      { ingredient_id: 2, name: 'Bánh mì nguyên cám', unit: '2 lát' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Nướng bánh mì.' },
      { step_id: 2, step_number: 2, description: 'Phết bơ lên bánh mì.' },
    ],
    servings: 1,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 1, calories: '250', protein: '5', fat: '10', carbohydrates: '30' },
    ],
    isFavorite: true,
    author: 'Nguyễn Văn A',  // Author added
    date: '2024-11-25',       // Date added
    avatar: 'https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg',  // Avatar image URL
  },
  {
    recipe_id: 2,
    title: 'Trái cây dầm',
    description: 'Món ăn nhẹ tươi mát với hỗn hợp các loại quả mọng và sữa chua Hy Lạp. Lựa chọn hoàn hảo cho bữa ăn nhẹ hoặc món tráng miệng nhẹ nhàng.',
    time: '15 phút',
    calories: 345,
    image: 'https://i.pinimg.com/1200x/19/f6/4d/19f64d152f8350729a31295649ccedf6.jpg',
    category: [{ tag_id: 2, name: 'Tráng miệng' }, { tag_id: 7, name: 'Đồ uống' }],
    ingredients: [
      { ingredient_id: 3, name: 'Các loại quả mọng', unit: '1 cốc' },
      { ingredient_id: 4, name: 'Sữa chua Hy Lạp', unit: '1/2 cốc' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Trộn tất cả quả mọng vào một bát.' },
      { step_id: 2, step_number: 2, description: 'Thêm sữa chua Hy Lạp và thưởng thức.' },
    ],
    servings: 2,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 2, calories: '345', protein: '8', fat: '12', carbohydrates: '40' },
    ],
    isFavorite: false,
    author: 'Trần Thị B',  // Author added
    date: '2024-11-24',     // Date added
    avatar: 'https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg',
  },
  {
    recipe_id: 3,
    title: 'Phở tôm',
    description: 'Món phở thơm ngon với tôm tươi và nước dùng đậm đà. Đây là lựa chọn hoàn hảo cho những ngày se lạnh hoặc bữa ăn bổ dưỡng.',
    time: '35 phút',
    calories: 520,
    image: 'https://i.pinimg.com/1200x/19/f6/4d/19f64d152f8350729a31295649ccedf6.jpg',
    category: [{ tag_id: 3, name: 'Canh & Lẩu' }],
    ingredients: [
      { ingredient_id: 5, name: 'Tôm', unit: '200g' },
      { ingredient_id: 6, name: 'Bún gạo', unit: '100g' },
      { ingredient_id: 7, name: 'Nước dùng', unit: '500ml' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Đun sôi nước dùng.' },
      { step_id: 2, step_number: 2, description: 'Thêm bún và tôm. Nấu cho đến khi chín.' },
    ],
    servings: 2,
    difficulty_level: 'Trung bình',
    nutrition: [
      { nutrition_id: 3, calories: '520', protein: '25', fat: '15', carbohydrates: '65' },
    ],
    isFavorite: true,
    author: 'Lê Minh C',  // Author added
    date: '2024-11-22',     // Date added
    avatar: 'https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg',
  },
  {
    recipe_id: 4,
    title: 'Salad Địa Trung Hải',
    description: 'Món salad đầy màu sắc và bổ dưỡng với rau tươi và quinoa, rưới thêm dầu ô liu. Đây là một món ăn nhẹ lý tưởng và tốt cho sức khỏe.',
    time: '20 phút',
    calories: 330,
    image: 'https://i.pinimg.com/1200x/19/f6/4d/19f64d152f8350729a31295649ccedf6.jpg',
    category: [{ tag_id: 4, name: 'Khai vị' }],
    ingredients: [
      { ingredient_id: 8, name: 'Quinoa', unit: '1 cốc' },
      { ingredient_id: 9, name: 'Dưa leo', unit: '1 quả' },
      { ingredient_id: 10, name: 'Cà chua', unit: '2 quả' },
      { ingredient_id: 11, name: 'Dầu ô liu', unit: '2 muỗng canh' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Nấu quinoa theo hướng dẫn trên bao bì.' },
      { step_id: 2, step_number: 2, description: 'Cắt rau củ và trộn với quinoa.' },
      { step_id: 3, step_number: 3, description: 'Rưới dầu ô liu lên và thưởng thức.' },
    ],
    servings: 3,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 4, calories: '330', protein: '9', fat: '14', carbohydrates: '40' },
    ],
    isFavorite: false,
    author: 'Nguyễn Thị D',  // Author added
    date: '2024-11-21',     // Date added
    avatar: 'https://i.pinimg.com/1200x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg',
  },
];



const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find the recipe using formatted title (slug)
  const recipe = recipes.find((r) => formatString(r.title) === slug);

  const [isLiked, setIsLiked] = useState<boolean>(recipe?.isFavorite || false);

  const onToggleFavorite = (recipeId: number) => {
    console.log(`Toggled favorite for recipe with ID: ${recipeId}`);
  };

  // Toggle like status
  const handleLike = () => {
    setIsLiked((prevLiked) => !prevLiked);
    if (recipe) {
      onToggleFavorite(recipe.recipe_id); // Pass the recipe_id for favorite toggling
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">Không tìm thấy công thức</h1>
        <p className="text-gray-600 mb-4">
          Chúng tôi không thể tìm thấy công thức bạn yêu cầu.
        </p>
        <Link to="/dish" className="text-blue-500 hover:underline hover:text-blue-700">
          Quay lại tất cả công thức
        </Link>
      </div>
    );
  }

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
                src={recipe.avatar}
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
              <strong className="text-black">{recipe.author}</strong>
              <p>{recipe.date}</p>

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
              <span className="flex flex-wrap gap-2">
                {recipe.category.map((cat) => (
                  <span
                    key={cat.tag_id}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {cat.name}
                  </span>
                ))}
              </span>
            </div>

            <span className="text-gray-400">|</span>
            <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${isLiked ? 'bg-red-300' : 'bg-gray-200'}`}
            >
              <Heart
                color={isLiked ? 'white' : 'gray'}
                fill={isLiked ? 'white' : 'none'}
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
            <div className="w-1/3 bg-blue-50 p-6 mt-8 rounded-lg shadow">
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
            </div>
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
              {recipe.ingredients.map((item) => (
                <li key={item.ingredient_id}>
                  {item.name} : {item.unit}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Các bước</h2>
            {recipe.step.map((step) => (
              <div key={step.step_id} className="mb-6">
                <h3 className="font-semibold">Bước {step.step_number}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
};


export default RecipeDetail;