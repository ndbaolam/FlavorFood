import React, { useEffect, useState } from 'react';
import { Salad, CakeSlice, Beef, Popcorn } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Banner from '../../components/banner';
import axiosInstance from '../../services/axiosInstance';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    {
      icon: Salad,
      title: 'Khai vị',
      description: 'Các món khai vị nhẹ nhàng, hấp dẫn để bắt đầu bữa ăn của bạn, từ salad tươi mát đến những món ăn nhẹ đầy hương vị.',
      category_id: 48
    },
    {
      icon: Beef,
      title: 'Món chính',
      description: 'Món chính phong phú với các lựa chọn thịt, cá và món chay, phù hợp cho những ai yêu thích các món ăn đậm đà hương vị.',
      category_id: 51
    },
    {
      icon: CakeSlice,
      title: 'Tráng miệng',
      description: 'Món tráng miệng thơm ngon, từ bánh ngọt đến các món kem mát lạnh, hoàn hảo để kết thúc bữa ăn.',
      category_id: 49
    },
    {
      icon: Popcorn,
      title: 'Ăn vặt',
      description: 'Những món ăn nhẹ như bắp rang bơ, khoai tây chiên, và các món snack thú vị cho những lúc đói bụng bất ngờ.',
      category_id: 50
    },
  ];
  // Lấy categoryId từ URL khi trang load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategoryId(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      setError(null);
      axiosInstance
        .get(`/categories/${categoryId}`)
        .then((response) => {
          setCategoryData(response.data);
        })
        .catch((err) => {
          setError('Có lỗi xảy ra khi tải dữ liệu.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categoryId]);


  return (
    <div className="min-h-screen  max-w-screen">

      <Banner></Banner>
      <main className="container mx-auto py-8 ">

        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-lobster text-4xl font-semibold">Hôm nay ăn gì</h2>
          </div>

          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {categoryData && !loading && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold">{categoryData.name}</h3>
              <p>{categoryData.description}</p>
            </div>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-8">
            {menuItems.map(({ icon: Icon, title, description, category_id }) => (
              <div
                key={title}
                className="flex flex-col items-center bg-gradient-to-b from-blue-100 to-white rounded-3xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Icon className="w-14 h-14 text-cyan-600 mb-6" />
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                <button
                  onClick={() => {
                    navigate(`/dish?category=${category_id}`);
                    setCategoryId(category_id.toString());
                  }}
                  className="text-red-600 font-semibold hover:underline mt-auto"
                >
                  Khám phá
                </button>
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
