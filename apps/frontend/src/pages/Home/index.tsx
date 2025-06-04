import React, { useEffect, useState } from 'react';
import { Salad, CakeSlice, Beef, Popcorn } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Banner from '../../components/banner';
import axiosInstance from '../../services/axiosInstance';
import RecipeCard from '../../components/RecipeCard';
import { toast } from 'react-toastify';
import { checkAuth } from '../../utils/auth';
import { useFavorite } from '../../lib/FavoriteContext';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [errorRecipes, setErrorRecipes] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, refreshFavorites } = useFavorite();


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

  useEffect(() => {
    setLoadingRecipes(true);
    axiosInstance
      .get('/recipes', {
        params: {
          feature: true,
          most_rating: true,
          limit: 8,
        },
      })
      .then((response) => {
        const data = response.data;
        const sortedRecipes = data.sort((a: any, b: any) => {
          return (b.average_rating || 0) - (a.average_rating || 0);
        });

        setRecipes(sortedRecipes);
      })
      .catch(() => {
        setErrorRecipes('Không thể tải món ăn thịnh hành.');
      })
      .finally(() => {
        setLoadingRecipes(false);
      });
  }, []);
  const handleToggleFavorite = async (recipeId: number) => {
    try {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
          position: "top-right",
          autoClose: 2000
        });
        navigate('/sign-in', { state: { returnTo: '/dish' } });
        return;
      }

      const wasLiked = isFavorite(recipeId);
      await toggleFavorite(recipeId);

      toast[wasLiked ? "info" : "success"](
        wasLiked ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!",
        { position: "top-right", autoClose: 2000 }
      );

      setTimeout(refreshFavorites, 300);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra khi thao tác với yêu thích!", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  return (
    <div className="min-h-screen  max-w-screen">

      <main className="container mx-auto">
        <Banner></Banner>
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className=" text-black font-lobster text-4xl font-semibold">Hôm nay ăn gì</h2>
          </div>

          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {categoryData && !loading && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-black">{categoryData.name}</h3>
              <p className='text-black'>{categoryData.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

            {menuItems.map(({ icon: Icon, title, description, category_id }) => (
              <div
                key={title}
                className="flex flex-col items-center bg-gradient-to-b from-blue-100 to-white rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Icon className="w-14 h-14 text-cyan-600 mb-6" />
                <h3 className="text-xl font-semibold mb-3 text-black">{title}</h3>
                <p className="text-black mb-6">{description}</p>
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

        <div className="py-12">
          <h2 className="text-4xl font-semibold text-center mb-8 text-black">
            Món ngon nổi bật
          </h2>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe={recipe}
                  isLiked={isFavorite(recipe.recipe_id)}
                  onToggleFavorite={() => handleToggleFavorite(recipe.recipe_id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-black text-lg">Không tìm thấy công thức nào phù hợp.</p>
              </div>
            )}
          </section>

        </div>

        <div className='py-12'>
          <div className=" w-full  mx-auto shadow-lg rounded-3xl flex flex-col md:flex-row items-center md:items-stretch justify-center overflow-hidden">
            <div className="w-full md:w-1/2 h-64 md:h-auto">
              <img
                src="https://www.chowhound.com/img/gallery/14-giada-de-laurentiis-cooking-tips-you-should-know-by-heart/use-salty-water-for-pasta-1728313314.jpg"
                alt="Logo tips"
                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none "
              />
            </div>

            <div className="bg-gradient-to-b from-blue-100 to-white w-full md:w-1/2 flex flex-col items-center justify-center p-8 space-y-6 md:space-y-8">
              <h2 className="font-serif text-2xl md:text-3xl text-slate-800 text-center leading-tight text-black">
                Trở thành đầu bếp tài ba ngay trong căn bếp của bạn
              </h2>
              <p className="text-black text-center leading-relaxed">
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
