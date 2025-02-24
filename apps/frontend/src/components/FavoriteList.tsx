import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

import axiosInstance from "../services/axiosInstance";
import { useFavorite } from "../pages/Favourite/FavoriteContext";

const FavoriteList: React.FC = () => {
  const { favorites, isFavorite, toggleFavorite } = useFavorite();
  const [detailedFavorites, setDetailedFavorites] = useState<any[]>([]);

  const fetchDetailedFavorites = async () => {
    try {
      const detailedData = await Promise.all(
        favorites.map(async (item) => {
          const recipeResponse = await axiosInstance.get(`/recipes/${item.recipe_id}`, {
            withCredentials: true,
          });

          return {
            favorite_id: item.favorite_id,
            ...recipeResponse.data,   
            isFavorite: true,
          };
        })
      );

      setDetailedFavorites(detailedData);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết món ăn:", error);
    }
  };
  useEffect(() => {
    if (favorites.length > 0) {
      fetchDetailedFavorites();
    }
  }, [favorites]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {detailedFavorites.map((recipe) => (
        <RecipeCard
          key={recipe.favorite_id}
          recipe={recipe}
          isLiked={isFavorite(recipe.recipe_id)}
          onToggleFavorite={() => toggleFavorite(recipe.recipe_id)}
        />
      ))}
    </div>
  );
};

export default FavoriteList;
