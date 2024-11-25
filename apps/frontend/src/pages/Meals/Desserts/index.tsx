import React, { useState } from 'react';
import FilterMenu from '../../../components/FilterMenu'; 
import RecipeCard from '../../../components/RecipeCard';

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

const Desserts: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Tráng miệng');

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.category.some((category) => category.name === activeFilter)
  );

  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <section className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Các món tráng miệng hấp dẫn</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá những món tráng miệng thơm ngon, nhẹ nhàng cho mọi dịp
          </p>
        </section>

        {/* Filter Menu */}
        <section className="flex justify-center items-center">
          <FilterMenu activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </section>

       {/* Desserts Recipes Grid */}
       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Không có món ăn nào phù hợp!
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Desserts;
