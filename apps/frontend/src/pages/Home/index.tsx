/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Salad, GlassWater, CakeSlice, Clock, Calculator, Beef, Soup } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Banner from '../../components/banner';
import RecipeCard from '../../components/RecipeCard';
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
const Home: React.FC = () => {
  const navigate = useNavigate();


  const menuItems = [
    {
      icon: Salad,
      title: 'Khai vị',
      description:
        'Các món khai vị thanh đạm và bổ dưỡng, mang đến hương vị nhẹ nhàng và chuẩn bị cho bữa tiệc thú vị phía trước!',
      link: '/dish/appetizer',
    },
    {
      icon: Beef,
      title: 'Món chính',
      description:
        'Trải nghiệm các món chính đa dạng với hương vị đậm đà, giúp cung cấp năng lượng cho cả ngày dài!',
      link: '/dish/main-course',
    },
    {
      icon: Soup,
      title: 'Canh & Lẩu',
      description:
        'Hãy thử các món canh và lẩu thơm ngon, mang đến sự ấm áp và gắn kết trong mỗi bữa ăn gia đình!',
      link: '/dish/soup-hotpot',
    },
    {
      icon: GlassWater,
      title: 'Đồ uống',
      description:
        'Đồ uống tươi mát giúp giải khát và bổ sung sức sống – hoàn hảo để cân bằng vị giác!',
      link: '/dish/drinks',
    },
    {
      icon: CakeSlice,
      title: 'Tráng miệng',
      description:
        'Những món tráng miệng ngọt ngào là sự kết thúc hoàn hảo cho bữa ăn, mang lại sự hài lòng tuyệt đối!',
      link: '/dish/desserts',
    },
  ];


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

  return (
    <div className="min-h-screen  max-w-screen">

      <Banner></Banner>
      <main className="container mx-auto py-8 ">

        {/* Rest of your components... */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-lobster text-4xl font-semibold">
              Hôm nay ăn gì
            </h2>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 px-4 md:px-8">
            {menuItems.map(({ icon: Icon, title, description, link }) => (
              <div
                key={title}
                className="bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <div className="flex justify-center mb-6">
                  <Icon className="w-14 h-14 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                <a
                  href={link}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Khám phá
                </a>
              </div>
            ))}
          </div>
        </div>


        {/* Trending Recipes Section */}
        <div className="py-12">
          <h2 className="text-4xl font-semibold text-center mb-8">
            Món ăn thịnh hành
          </h2>
      {/* Recipes Grid */}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.recipe_id} recipe={recipe} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">Không có món ăn nào phù hợp!</p>
            )}
          </section>
        </div>

        {/* Kitchen tips ..*/}
        <div className='py-12'>
        <div className=" w-full  mx-auto shadow-lg rounded-3xl flex flex-col md:flex-row items-center md:items-stretch justify-center overflow-hidden">
          {/* Hình ảnh bên trái */}
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src="https://www.chowhound.com/img/gallery/14-giada-de-laurentiis-cooking-tips-you-should-know-by-heart/use-salty-water-for-pasta-1728313314.jpg"
              alt="Logo tips"
              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none "
            />
          </div>

          {/* Nội dung bên phải */}
          <div className="bg-gradient-to-b from-blue-100 to-white w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-6 md:space-y-8">
            <h2 className="font-serif text-2xl md:text-3xl text-slate-800 text-center leading-tight">
              Trở thành đầu bếp tài ba ngay trong căn bếp của bạn
            </h2>
            <p className="text-slate-600 text-center leading-relaxed">
              Khám phá những mẹo vặt độc đáo và bí quyết giúp bạn tự tin chế biến những món ăn ngon. Hãy cùng chúng tôi bắt đầu hành trình biến căn bếp nhỏ trở thành không gian sáng tạo đầy hương vị!
            </p>
            <button
              className="bg-black px-8 py-4 text-white font-semibold text-lg rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
              onClick={() => navigate('/tips')}
            >
              Đọc thêm 
            </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
