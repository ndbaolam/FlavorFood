import { BookOpen, Calculator, Check, CheckCircle, CircleGauge, Clock, Heart, Users, UtensilsCrossed, Vegan } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLoaderData, LoaderFunctionArgs, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFavorite } from "../../Favourite/FavoriteContext";
import { Recipe } from "../recipe.interface";
import CommentForm from "../../../components/Comment";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  const id = slug?.slice(slug?.search("_") + 1);
  try {
    const response = await axiosInstance.get<Recipe>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw new Response("Error fetching recipe data", { status: 500 });
  }
}

const RecipeDetail: React.FC = () => {
  const recipe = useLoaderData() as Recipe;
  const { isFavorite, toggleFavorite, refreshFavorites } = useFavorite();
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get("reviews", {
          params: {
            recipeId: recipe.recipe_id,

          },
        });
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Lỗi khi tải bình luận!", { position: "top-right", autoClose: 2000 });
      }
    };

    fetchComments();
  }, [recipe.recipe_id]);


  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const isLiked = isFavorite(recipe.recipe_id);

  const checkAuth = async () => {
    try {
      await axiosInstance.get('/auth/profile');
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLike = async () => {
    try {
      const isAuthenticated = await checkAuth();
      
      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào yêu thích!", {
          position: "top-right",
          autoClose: 2000
        });
        navigate('/sign-in', { state: { returnTo: `/dish/${recipe.title}_${recipe.recipe_id}.html` } });
        return;
      }

      const wasLiked = isFavorite(recipe.recipe_id);
      await toggleFavorite(recipe.recipe_id);

      setTimeout(refreshFavorites, 300);

      toast[wasLiked ? "info" : "success"](
        wasLiked ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!",
        { position: "top-right", autoClose: 2000 }
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra khi thao tác với yêu thích!", {
        position: "top-right",
        autoClose: 2000
      });
    }
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <main className="container mx-auto px-4">
        <article>
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          </div>

          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-8">

            <Clock className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Thời gian nấu</strong>
              <p>{recipe.time} phút</p>
            </div>
            <span className="text-gray-400">|</span>
            <Users className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Khẩu phần ăn</strong>
              <p>{recipe.serving} người</p>
            </div>
            <span className="text-gray-400">|</span>
            <CircleGauge className="w-6 h-6 text-black" />
            <div className="text-black">
              <strong>Mức độ</strong>
              <p>{recipe.difficulty_level}</p>
            </div>
            <span className="text-gray-400">|</span>

            <UtensilsCrossed className="w-6 h-6 text-black" />
            <span className="flex flex-wrap gap-2">
              {recipe.categories?.length ? (
                recipe.categories.map((cat) => (
                  <span key={cat.category_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Không có danh mục</span>
              )}
            </span>

            <span className="text-gray-400">|</span>
            <button
              onClick={handleLike}
              className={`w-7 h-7 flex items-center justify-center p-2 rounded-full ${isLiked ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
            >
              <Heart color={isLiked ? "white" : "gray"} fill={isLiked ? "white" : "none"} size={18} />
            </button>
          </div>

          <div className="flex justify-between w-full gap-20">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-2/3 max-h-[500px] object-cover rounded-lg shadow-md"
            />

            <div className="w-1/3 bg-blue-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-center">Thông tin dinh dưỡng</h2>
              <ul className="text-gray-700 space-y-2 mt-16">
                {recipe.nutrition?.length ? (
                  recipe.nutrition.map((nutrient) => (
                    <li key={nutrient.id} className="text-sm flex flex-col">
                      <div className="flex items-center justify-between">
                        <span>{nutrient.name}:</span>
                        <span>{nutrient.amount} {nutrient.unit}</span>
                      </div>
                      <hr className="my-2 border-gray-300" />
                    </li>
                  ))
                ) : (
                  <li>Không có thông tin dinh dưỡng nào.</li>
                )}
              </ul>
              <div className="mt-12 pt-12 border-t text-center">
                <p className="text-gray-600 italic font-medium">
                  "Dinh dưỡng hợp lý là chìa khóa cho một cơ thể khỏe mạnh!"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="p-4 text-gray-700 text-xl">{recipe.description}</h2>
          </div>

          <div className="flex gap-8 ">
            <div className="bg-gray-50 p-4 rounded-lg shadow flex-1 min-w-[300px]">
              <h3 className="text-lg font-semibold text-green-700 flex items-center">
                <Vegan className="mr-2" />
                Thành phần
              </h3>
              <ul className="text-gray-700 space-y-1 mt-4">
                {recipe.ingredients.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    {item.ingredient}: {item.quantity} {item.unit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow flex-1 min-w-[300px]">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                <BookOpen className="mr-2" />
                Hướng dẫn nấu ăn
              </h3>
              <ul className="text-gray-700 space-y-2 mt-4">
                {recipe.steps.map((item) => (
                  <li key={item.number} className="flex items-start gap-2">
                    <span
                      className={`bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold cursor-pointer ${completedSteps[item.number] ? 'line-through' : ''}`}
                      onClick={() => setCompletedSteps((prev) => ({
                        ...prev,
                        [item.number]: !prev[item.number],
                      }))}
                    >
                      {item.number}
                    </span>
                    {item.step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <div className="bg-gray-50 p-6 rounded-lg shadow mt-8">
          <CommentForm recipeId={recipe.recipe_id} />
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Bình luận</h3>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="p-4 border-2 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      {comment.user.avatar && (
                        <img
                          src={comment.user.avatar}
                          alt={`${comment.user.name}'s avatar`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{comment.user.first_name} {comment.user.last_name}</span>
                          <span className="text-yellow-700"> {Array(comment.rating).fill('★').join('')}</span>
                        </div>
                        {comment.created_at && (
                          <span className="text-gray-500 text-sm">
                           {new Date(new Date(comment.created_at).getTime() + 7 * 60 * 60 * 1000).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{comment.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Chưa có bình luận nào.</p>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;