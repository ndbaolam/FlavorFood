import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/axiosInstance";

interface FavoriteItem {
  favorite_id: number;
  recipe_id: number;
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (recipeId: number) => Promise<void>;
  isFavorite: (recipeId: number) => boolean;
  refreshFavorites: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const authToken = localStorage.getItem('authToken');

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/favorite`, {
        withCredentials: true,
      });
      const formattedData = response.data.map((item: { favorite_id: number; recipe: any }) => ({
        favorite_id: item.favorite_id,
        recipe_id: item.recipe.recipe_id,
      }));
      setFavorites(formattedData);
      localStorage.setItem("favorites", JSON.stringify(formattedData));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      fetchFavorites();
    } else {
      setFavorites([]);
      localStorage.removeItem("favorites");
    }
  }, [authToken, fetchFavorites]);

  const toggleFavorite = async (recipeId: number) => {
    const isCurrentlyFavorite = favorites.some((item) => item.recipe_id === recipeId);
    let updatedFavorites = [...favorites];

    try {
      if (isCurrentlyFavorite) {
        const favoriteItem = favorites.find((item) => item.recipe_id === recipeId);
        if (favoriteItem) {
          await axiosInstance.delete(`/favorite/${favoriteItem.favorite_id}`, {
            withCredentials: true,
          });
          updatedFavorites = favorites.filter((item) => item.recipe_id !== recipeId);
        }
      } else {
        const response = await axiosInstance.post(
          `/favorite`,
          new URLSearchParams({ recipe_id: recipeId.toString() }).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          }
        );

        updatedFavorites.push({
          favorite_id: response.data.favorite_id,
          recipe_id: recipeId,
        });
      }

      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setTimeout(refreshFavorites, 300);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some((item) => item.recipe_id === recipeId);
  };

  const refreshFavorites = () => {
    fetchFavorites();
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite, refreshFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite phải được sử dụng bên trong FavoriteProvider");
  }
  return context;
};
