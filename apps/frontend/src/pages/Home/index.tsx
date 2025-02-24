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
import { Recipe } from '../Meals/recipe.interface';



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
                <div className="flex justify-center mb-6 ">
                  <Icon className="w-14 h-14 text-cyan-600" />
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
{/* 
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.recipe_id} recipe={recipe} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">Không có món ăn nào phù hợp!</p>
            )}
          </section> */}
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

            <div className="bg-gradient-to-b from-blue-100 to-white w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-6 md:space-y-8">
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 text-center leading-tight">
                Trở thành đầu bếp tài ba ngay trong căn bếp của bạn
              </h2>
              <p className="text-slate-600 text-center leading-relaxed">
                Khám phá những mẹo vặt độc đáo và bí quyết giúp bạn tự tin chế biến những món ăn ngon. Hãy cùng chúng tôi bắt đầu hành trình biến căn bếp nhỏ trở thành không gian sáng tạo đầy hương vị!
              </p>
              <a href="/tips" className="bg-black px-8 py-4 text-white font-semibold text-lg rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                Đọc thêm
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
