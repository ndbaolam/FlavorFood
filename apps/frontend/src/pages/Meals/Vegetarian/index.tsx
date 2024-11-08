import React from 'react';
import { Clock, Calculator } from 'lucide-react';

interface Recipe {
  title: string;
  description: string;
  time: string;
  calories: number;
  imageUrl: string;
}

const recipes: Recipe[] = [
  {
    title: 'Avocado Breads With A Poached Egg',
    description: 'Tasty & Fast',
    time: '15 minutes',
    calories: 250,
    imageUrl:
      'https://dsznjaxrxc1vh.cloudfront.net/product-images/large/Beauty+Bowl+PDP_1440x1440.png',
  },
  {
    title: 'Healthy Berry Fruit Bowl',
    description: 'Easy preparation',
    time: '15 minutes',
    calories: 345,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
  },
  {
    title: 'Noodle Soup With Shrimps',
    description: 'Savory & Spicy',
    time: '35 minutes',
    calories: 520,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish1-min.png',
  },
  {
    title: 'Mediterranean Quinoa Salad',
    description: 'Fresh & Nutritious',
    time: '20 minutes',
    calories: 330,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish2-min.png',
  },
  {
    title: 'Classic Caesar Salad',
    description: 'Rich & Flavorful',
    time: '10 minutes',
    calories: 210,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish3-min.png',
  },
  {
    title: 'Spicy Chickpea Wraps',
    description: 'Quick & Delicious',
    time: '25 minutes',
    calories: 400,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish4-min.png',
  },
  {
    title: 'Mango Smoothie Bowl',
    description: 'Refreshing & Sweet',
    time: '10 minutes',
    calories: 280,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish5-min.png',
  },
  {
    title: 'Grilled Vegetable Skewers',
    description: 'Smoky & Flavorful',
    time: '30 minutes',
    calories: 220,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish6-min.png',
  },
  {
    title: 'Berry Smoothie',
    description: 'Healthy & Energizing',
    time: '5 minutes',
    calories: 150,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish5-min.png',
  },
  {
    title: 'Lentil Soup',
    description: 'Comforting & Hearty',
    time: '40 minutes',
    calories: 310,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish5-min.png',
  },
  {
    title: 'Chocolate Avocado Mousse',
    description: 'Decadent & Healthy',
    time: '15 minutes',
    calories: 320,
    imageUrl:
      'https://www.sliderrevolution.com/wp-content/uploads/revslider/food-recipe-carousel/dish5-min.png',
  },
  {
    title: 'Zucchini Noodles with Pesto',
    description: 'Low-carb & Flavorful',
    time: '20 minutes',
    calories: 190,
    imageUrl:'https://uploads-ssl.webflow.com/624ff6ee2a16a1a7312e426b/62552a2c36259f3b8be4d036_Bitmap%202FITO-p-500.png'  },
];

const Vegetarian: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
    <main className="container mx-auto py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {recipes.map((recipe, index) => (
          <div key={index} className="relative pt-20">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300" style={{ height: '400px' }}>
              <div className="relative flex justify-center">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full rounded-full -mt-20 object-cover border-4 border-white shadow-sm transform origin-center"
                />
              </div>

              <div className="p-6 flex flex-col items-center h-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-pink-500 transition-colors duration-300 cursor-pointer line-clamp-2">
                  {recipe.title}
                </h2>

                <p className="text-gray-600 text-center mb-4 text-sm">
                  {recipe.description}
                </p>

                <div className="border-t border-gray-100 my-4 w-full"></div>

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

export default Vegetarian;
