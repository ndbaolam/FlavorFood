import { Calculator, Clock, UtensilsCrossed } from "lucide-react";
import React from "react";
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
const recipes: Recipe[] = [
  {
    recipe_id: 1,
    title: 'Bánh mì bơ',
    description: 'Một bữa sáng nhanh và ngon miệng với bơ chín được phết lên bánh mì nướng nguyên cám. Hoàn hảo để khởi đầu ngày mới đầy năng lượng!',
    time: '15 phút',
    calories: 250,
    image:
      'https://dsznjaxrxc1vh.cloudfront.net/product-images/large/Beauty+Bowl+PDP_1440x1440.png',
    category: [
      { tag_id: 1, name: 'Món chính' },
      { tag_id: 6, name: 'Khai vị' },
    ],
    ingredients: [
      { ingredient_id: 1, name: 'Avocado', description: 'Ripe avocado', unit: '1' },
      { ingredient_id: 2, name: 'Bread', description: 'Whole-grain bread slices', unit: '2 slices' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Toast the bread.' },
      { step_id: 2, step_number: 2, description: 'Spread avocado on bread.' },
    ],
    servings: 1,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 1, calories: '250', protein: '5', fat: '10', carbohydrates: '30' },
    ],
  },
  {
    recipe_id: 2,
    title: 'Trái cây dầm',
    description: 'Món ăn nhẹ tươi mát với hỗn hợp các loại quả mọng và sữa chua Hy Lạp. Lựa chọn hoàn hảo cho bữa ăn nhẹ hoặc món tráng miệng nhẹ nhàng.',
    time: '15 phút',
    calories: 345,
    image:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
    category: [{ tag_id: 2, name: 'Tráng miệng' },
    { tag_id: 7, name: 'Đồ uống' },
    ],
    ingredients: [
      { ingredient_id: 3, name: 'Mixed Berries', description: 'A mix of blueberries, raspberries, strawberries', unit: '1 cup' },
      { ingredient_id: 4, name: 'Greek Yogurt', description: 'Plain Greek yogurt', unit: '1/2 cup' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Mix all berries in a bowl.' },
      { step_id: 2, step_number: 2, description: 'Add Greek yogurt and serve.' },
    ],
    servings: 2,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 2, calories: '345', protein: '8', fat: '12', carbohydrates: '40' },
    ],
  },
  {
    recipe_id: 3,
    title: 'Phở tôm',
    description: 'Món phở thơm ngon với tôm tươi và nước dùng đậm đà. Đây là lựa chọn hoàn hảo cho những ngày se lạnh hoặc bữa ăn bổ dưỡng.',
    time: '35 phút',
    calories: 520,
    image:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
    category: [{ tag_id: 3, name: 'Canh & Lẩu' }],
    ingredients: [
      { ingredient_id: 5, name: 'Shrimps', description: 'Fresh shrimp, deveined', unit: '200g' },
      { ingredient_id: 6, name: 'Noodles', description: 'Rice noodles', unit: '100g' },
      { ingredient_id: 7, name: 'Broth', description: 'Chicken or vegetable broth', unit: '500ml' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Boil the broth.' },
      { step_id: 2, step_number: 2, description: 'Add noodles and shrimps. Cook until done.' },
    ],
    servings: 2,
    difficulty_level: 'Trung bình',
    nutrition: [
      { nutrition_id: 3, calories: '520', protein: '25', fat: '15', carbohydrates: '65' },
    ],
  },
  {
    recipe_id: 4,
    title: 'Salad Địa Trung Hải',
    description: 'Món salad đầy màu sắc và bổ dưỡng với rau tươi và quinoa, rưới thêm dầu ô liu. Đây là một món ăn nhẹ lý tưởng và tốt cho sức khỏe.',
    time: '20 phút',
    calories: 330,
    image:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish2-min.png',
    category: [{ tag_id: 4, name: 'Khai vị' }],
    ingredients: [
      { ingredient_id: 8, name: 'Quinoa', description: 'Cooked quinoa', unit: '1 cup' },
      { ingredient_id: 9, name: 'Cucumber', description: 'Chopped cucumber', unit: '1' },
      { ingredient_id: 10, name: 'Tomato', description: 'Chopped tomatoes', unit: '2' },
      { ingredient_id: 11, name: 'Olive Oil', description: 'Extra virgin olive oil', unit: '2 tbsp' },
    ],
    step: [
      { step_id: 1, step_number: 1, description: 'Cook quinoa according to package instructions.' },
      { step_id: 2, step_number: 2, description: 'Chop vegetables and mix with quinoa.' },
      { step_id: 3, step_number: 3, description: 'Drizzle with olive oil and serve.' },
    ],
    servings: 3,
    difficulty_level: 'Dễ',
    nutrition: [
      { nutrition_id: 4, calories: '330', protein: '9', fat: '14', carbohydrates: '40' },
    ],
  },
];

const RecipeDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Tìm kiếm công thức dựa trên `formattedTitle`
  const recipe = recipes.find((r) => formatString(r.title) === slug);

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
    <div className="min-h-screen py-12 bg-gray-50">
      <main className="container mx-auto px-4">
        {/* Recipe Title and Description */}
        <article>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          </div>

          {/* Time, Calories, and Categories Section */}
          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{recipe.time}</span>
            </div>
            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>{recipe.calories} calories</span>
            </div>
            <span className="text-gray-400">|</span>

            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
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
          </div>

          {/* Recipe Image */}
          <div className="flex justify-between w-full gap-12">
            <div className="mt-8 w-3/4">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-auto rounded-lg shadow-md"
              />
            </div>

            {/* Nutrition Section */}
            <div className="w-1/4 bg-blue-50 p-6 mt-8 rounded-lg shadow">
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
            <span className="text-gray-700">{recipe.description}</span>
          </div>

          {/* Ingredients Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Nguyên liệu</h2>
            <ul className="list-disc list-inside text-gray-700">
              {recipe.ingredients.map((item) => (
                <li key={item.ingredient_id}>
                  {item.name} ({item.description}) - {item.unit}
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