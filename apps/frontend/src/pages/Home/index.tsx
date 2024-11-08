/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { Coffee, Salad, GlassWater, Cake, Clock, Calculator } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import NextArrow from '../../components/NextArrow';
import PrevArrow from '../../components/PrevArrow';

interface Recipe {
  title: string;
  description: string;
  time: string;
  calories: number;
  imageUrl: string;
}
const Home: React.FC = () => {
  const menuItems = [
    {
      icon: Coffee,
      title: 'Bữa sáng',
      description:
        'Khởi đầu ngày mới tràn đầy năng lượng với bữa sáng dinh dưỡng!',
      link: 'breakfast',
    },
    {
      icon: Salad,
      title: 'Món chay',
      description:
        'Chay thanh đạm, hương vị ngọt ngào – Sống xanh, sống khỏe mỗi ngày!',
      link: 'vegetarian',
    },
    {
      icon: GlassWater,
      title: 'Đồ uống',
      description:
        'Thức uống tươi mát, bổ sung sức sống – Khơi dậy mọi giác quan!',
      link: 'drinks',
    },
    {
      icon: Cake,
      title: 'Tráng miệng',
      description:
        'Ngọt ngào từng miếng, thỏa mãn mọi cảm xúc – Tráng miệng là niềm vui cuối cùng!',
      link: 'desserts',
    },
  ];

  const topRecipes: Recipe[] = [
    {
      title: 'Avocado Breads With A  Egg',
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
      imageUrl:
        'https://uploads-ssl.webflow.com/624ff6ee2a16a1a7312e426b/62552a2c36259f3b8be4d036_Bitmap%202FITO-p-500.png',
    },
  ];
  const sliderItems = [
    {
      image:
        'https://file.hstatic.net/200000610729/file/suon-1_45d8812e98a24c97a7920ebdf8457d11.jpg',
      title: 'Sườn xào chua ngọt',
      description:
        'Sườn heo được chế biến cùng sốt chua ngọt, tạo nên món ăn đậm đà, thơm ngon.',
      date: 'April 10, 2021',
    },
    {
      image:
        'https://static-images.vnncdn.net/files/publish/canh-ga-chien-nuoc-mam-don-gian-tuyet-ngon-cho-bua-com-nha-76e74a6565574ce8b848041b0e711fe0.jpg',
      title: 'Cánh gà chiên mắm',
      description:
        'Cánh gà chiên giòn, đậm đà vị mắm, là món ăn lý tưởng cho mọi bữa tiệc.',
      date: 'March 15, 2021',
    },
    {
      image:
        'https://daynauan.info.vn/wp-content/uploads/2018/06/thit-kho-tau-1.jpg',
      title: 'Thịt kho tàu',
      description:
        'Món thịt kho với hương vị đậm đà và mềm mại của trứng và thịt.',
      date: 'February 5, 2021',
    },
    {
      image:
        'https://cdn.tgdd.vn/Files/2019/11/12/1218206/cach-lam-thit-bo-xao-hanh-tay-thom-mem-nhanh-gon-202212091417101425.jpg',
      title: 'Thịt bò xào hành tây',
      description:
        'Món thịt bò xào hành tây đơn giản nhưng không kém phần hấp dẫn.',
      date: 'January 20, 2021',
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i: number) => (
      <div className="w-2 h-2 bg-gray-300 rounded-full mx-1 hover:bg-gray-500 transition-colors" />
    ),
  };
  return (
    <div className="min-h-screen  max-w-screen">
      <main className="container mx-auto py-8 ">
        {/* Hero Slider Section */}
        {/* Hero Slider Section */}
        <div className="w-full h-full mx-auto shadow-lg rounded-lg border-4 border-gray-300">
  <Slider {...sliderSettings}>
    {sliderItems.map((item, index) => (
      <div key={index} className="outline-none">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-3/5">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[400px] object-cover rounded-l-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
            />
          </div>

          {/* Right side - Content */}
          <div className="w-2/5 bg-white flex items-center rounded-r-lg shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105">
            <div className="p-6 md:p-12">
              <h2 className="font-serif text-3xl text-gray-800 mb-4">{item.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{item.date}</p>
              <p className="text-gray-700 mb-8">{item.description}</p>
              <button className="border-2 border-orange-300 px-6 py-2 text-sm uppercase tracking-wider text-orange-500 hover:bg-orange-300 hover:border-orange-500 hover:text-white transition-colors">
                XEM CÔNG THỨC
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>


        {/* Rest of your components... */}
        <div className="py-12">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-4xl font-semibold">
              Hôm nay ăn gì
            </h2>
          </div>
          <div className=" max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            {menuItems.map(({ icon: Icon, title, description, link }) => (
              <div
                key={title}
                className="bg-gradient-to-b from-orange-50 to-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-all ease-in-out"
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
          <h2 className="text-4xl font-semibold text-center mb-8">Món ăn thịnh hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {topRecipes.map((topRecipe, index) => (
              <div key={index} className="relative pt-20">
                <div className="bg-gradient-to-b from-orange-50 to-white  rounded-lg shadow-lg hover:scale-105 transition-all ease-in-out">
                  <div className="relative flex justify-center">
                    <img
                      src={topRecipe.imageUrl}
                      alt={topRecipe.title}
                      className="w-full h-full -mt-20 object-cover transform origin-center"
                    />
                  </div>
                  <div className="p-6 flex flex-col items-center h-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center hover:text-pink-500 transition-colors duration-300 cursor-pointer line-clamp-2">
                      {topRecipe.title}
                    </h2>
                    <p className="text-gray-600 text-center mb-4 text-sm">{topRecipe.description}</p>
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
      </main>
    </div>
  );
};

export default Home;
