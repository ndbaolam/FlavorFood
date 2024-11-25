/* eslint-disable react/jsx-no-undef */
import React from 'react';
import {
  Coffee,
  Salad,
  GlassWater,
  Cake,
  Clock,
  Calculator,
} from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Banner from '../../components/banner';
interface Recipe {
  title: string;
  description: string;
  time: string;
  calories: number;
  imageUrl: string;
}
const Home: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: Coffee,
      title: 'Bữa sáng',
      description:
        'Khởi đầu ngày mới tràn đầy năng lượng với bữa sáng dinh dưỡng!',
      link: '/meals/breakfast',
    },
    {
      icon: Salad,
      title: 'Món chay',
      description:
        'Chay thanh đạm, hương vị ngọt ngào – Sống xanh, sống khỏe mỗi ngày!',
      link: '/meals/vegetarian',
    },
    {
      icon: GlassWater,
      title: 'Đồ uống',
      description:
        'Thức uống tươi mát, bổ sung sức sống – Khơi dậy mọi giác quan!',
      link: '/meals/drinks',
    },
    {
      icon: Cake,
      title: 'Tráng miệng',
      description:
        'Ngọt ngào từng miếng, thỏa mãn mọi cảm xúc – Tráng miệng là niềm vui cuối cùng!',
      link: '/meals/desserts',
    },
  ];

  const topRecipes: Recipe[] = [
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
      imageUrl:
        'https://uploads-ssl.webflow.com/624ff6ee2a16a1a7312e426b/62552a2c36259f3b8be4d036_Bitmap%202FITO-p-500.png',
    },
  ];


  return (
    <div className="min-h-screen  max-w-screen">

      <Banner></Banner>
      <main className="container mx-auto py-8 ">
        {/* Rest of your components... */}
        <div className="py-12">
          <div className="text-center mb-8">
            <h2 className="font-lobster text-4xl font-semibold">
              Hôm nay ăn gì
            </h2>
          </div>
          <div className=" max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {menuItems.map(({ icon: Icon, title, description, link }) => (
              <div
                key={title}
                className="bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg p-6 text-center hover:scale-105 transition-all ease-in-out"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {topRecipes.map((topRecipe, index) => (
              <div key={index} className="relative pt-20">
                <div className=" bg-gradient-to-b from-blue-100 to-white  rounded-3xl shadow-lg hover:scale-105 transition-all ease-in-out">
                  <div className="relative flex justify-center">
                    <img
                      src={topRecipe.imageUrl}
                      alt={topRecipe.title}
                      className="w-full h-full -mt-20 object-cover transform origin-center"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-center h-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-blue-500 transition-colors duration-300 cursor-pointer line-clamp-2">
                      {topRecipe.title}
                    </h2>
                    <p className="text-gray-600 text-center mb-4 text-sm">
                      {topRecipe.description}
                    </p>
                    <div className="border-t border-gray-300 my-4 w-full"></div>
                    <div className="flex justify-between items-center text-gray-500 text-sm w-full">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{topRecipe.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        <span>{topRecipe.calories} calories</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kitchen tips ..*/}
        <div className="w-full  mx-auto shadow-lg rounded-3xl flex flex-col md:flex-row items-center md:items-stretch justify-center overflow-hidden">
          {/* Hình ảnh bên trái */}
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src="https://www.chowhound.com/img/gallery/14-giada-de-laurentiis-cooking-tips-you-should-know-by-heart/use-salty-water-for-pasta-1728313314.jpg"
              alt="Logo tips"
              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none transition-transform duration-300 hover:scale-105"
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
              className="bg-black rounded-lg shadow-lg px-8 py-3 text-center text-white hover:bg-gray-800 transition duration-200 ease-in-out"
              onClick={() => navigate('/tips')}
            >
              ĐỌC THÊM
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
