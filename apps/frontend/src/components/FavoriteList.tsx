import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import { useFavorite } from "../pages/Favourite/FavoriteContext";
import axiosInstance from "../services/axiosInstance";

const FavoriteList: React.FC = () => {
  const { favorites, isFavorite, toggleFavorite, refreshFavorites } = useFavorite();
  const [detailedFavorites, setDetailedFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailedData = await Promise.all(
          favorites.map(async (item) => {
            const response = await axiosInstance.get(`/recipes/${item.recipe_id}`);
            return { ...response.data, favorite_id: item.favorite_id };
          })
        );
        setDetailedFavorites(detailedData);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết món ăn:", error);
      }
    };

    if (favorites.length > 0) {
      fetchDetails();
    } else {
      setDetailedFavorites([]); // Reset when no favorites exist
    }
  }, [favorites]);

  const handleToggleFavorite = async (recipeId: number) => {
    const wasLiked = isFavorite(recipeId);
    await toggleFavorite(recipeId);

    // Optimistically update UI before refreshing favorites
    setDetailedFavorites((prev) =>
      wasLiked
        ? prev.filter((recipe) => recipe.recipe_id !== recipeId)
        : [...prev, favorites.find((item) => item.recipe_id === recipeId)]
    );

    //Ensure synchronization with `RecipeDetail`
    setTimeout(refreshFavorites, 300);
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <main className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-center">Món Ăn Yêu Thích</h2>

        {detailedFavorites.length === 0 ? (
          <p className="text-center text-gray-500">Bạn chưa có món ăn yêu thích nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedFavorites.map((recipe) => (
              <RecipeCard
                key={recipe.favorite_id}
                recipe={recipe}
                isLiked={isFavorite(recipe.recipe_id)}
                onToggleFavorite={() => handleToggleFavorite(recipe.recipe_id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoriteList;
