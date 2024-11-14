import React, { useState } from 'react';
import { Clock, Calculator } from 'lucide-react';
import FilterMenu from '../../components/FilterMenu';


interface Recipe {
  id: string;
  title: string;
  description: string;
  time: string;
  calories: number;
  imageUrl: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string[];
  servings: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  nutrition?: { protein: number; fat: number; carbs: number };
  ratings?: { averageRating: number; reviews: number };
  isFavorite?: boolean;
}

interface Ingredient {
  name: string;
  quantity: string; // Ví dụ: "200g", "1 tablespoon"
}

const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Avocado Breads With ',
    description: 'Tasty & Fast',
    time: '15 minutes',
    calories: 250,
    imageUrl:
      'https://dsznjaxrxc1vh.cloudfront.net/product-images/large/Beauty+Bowl+PDP_1440x1440.png',
    category: 'Bữa sáng',
    ingredients: [
      { name: 'Avocado', quantity: '1' },
      { name: 'Bread', quantity: '2 slices' },
    ],
    instructions: ['Toast the bread.', 'Spread avocado on bread.'],
    servings: 1,
    difficultyLevel: 'Easy',
  },
  {
    id: '2',
    title: 'Healthy Berry Fruit Bowl',
    description: 'Easy preparation',
    time: '15 minutes',
    calories: 345,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
    category: 'Tráng miệng',
    ingredients: [
      { name: 'Mixed Berries', quantity: '1 cup' },
      { name: 'Greek Yogurt', quantity: '1/2 cup' },
    ],
    instructions: ['Mix all berries in a bowl.', 'Add Greek yogurt and serve.'],
    servings: 2,
    difficultyLevel: 'Easy',
  },
  {
    id: '3',
    title: 'Noodle Soup With Shrimps',
    description: 'Savory & Spicy',
    time: '35 minutes',
    calories: 520,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
    category: 'Bữa chính',
    ingredients: [
      { name: 'Shrimps', quantity: '200g' },
      { name: 'Noodles', quantity: '100g' },
      { name: 'Broth', quantity: '500ml' },
    ],
    instructions: ['Boil the broth.', 'Add noodles and shrimps. Cook until done.'],
    servings: 2,
    difficultyLevel: 'Medium',
  },
  {
    id: '4',
    title: 'Mediterranean Quinoa Salad',
    description: 'Fresh & Nutritious',
    time: '20 minutes',
    calories: 330,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish2-min.png',
    category: 'Bữa chay',
    ingredients: [
      { name: 'Quinoa', quantity: '1 cup' },
      { name: 'Cucumber', quantity: '1' },
      { name: 'Tomato', quantity: '2' },
      { name: 'Olive Oil', quantity: '2 tbsp' },
    ],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Chop vegetables and mix with quinoa.',
      'Drizzle with olive oil and serve.',
    ],
    servings: 3,
    difficultyLevel: 'Easy',
  },
];

const Meals: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('Tất cả');

  // Filter recipes based on active filter
  const filteredRecipes = recipes.filter((recipe) => {
    if (activeFilter === 'Tất cả') return true;
    return recipe.category === activeFilter;
  });

  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <div className="relative text-center mt-20">
          <h2 className="text-4xl font-bold mb-2">Hôm nay ăn gì</h2>
          <p className="text-gray-600 text-lg mb-8">
            Khám phá các món ăn ngon cùng chúng tôi
          </p>
        </div>
        
        <div className="flex justify-center items-center ">
          {/* Pass the activeFilter and the setter function to FilterMenu */}
          <FilterMenu
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative pt-20">
              <div
                className="bg-gradient-to-b from-orange-50 to-white rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out"
                style={{ height: '400px' }}
              >
                <div className="relative flex justify-center">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full -mt-20 object-cover transform origin-center"
                  />
                </div>

                <div className="p-6 flex flex-col items-center h-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-pink-500 transition-colors duration-300 cursor-pointer line-clamp-2">
                    {recipe.title}
                  </h2>

                  <p className="text-gray-600 text-center mb-4 text-sm">
                    {recipe.description}
                  </p>

                  <div className="border-t border-gray-300 my-4 w-full"></div>

                  <div className="flex justify-between items-center text-gray-500 text-sm w-full">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      <span>{recipe.calories} calories</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Meals;
