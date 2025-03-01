import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import Cookies from "js-cookie";

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
  const accessToken = Cookies.get("access_token");  

  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`/favorite`, {
        withCredentials: true,
      });

      const formattedData = response.data.map((item: { favorite_id: number; recipe: any; }) => ({
        favorite_id: item.favorite_id,
        recipe_id: item.recipe.recipe_id,
      }));
      setFavorites(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessToken)
      fetchFavorites();
  }, []);

  const toggleFavorite = async (recipeId: number) => {
    const isCurrentlyFavorite = favorites.some((item) => item.recipe_id === recipeId);

    try {
      if (isCurrentlyFavorite) {
        const favoriteItem = favorites.find((item) => item.recipe_id === recipeId);

        await axiosInstance.delete(`/favorite/${favoriteItem?.favorite_id}`, {
          withCredentials: true,
        });
      } else {
        await axiosInstance.post(
          `/favorite`,
          new URLSearchParams({ recipe_id: recipeId.toString() }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            withCredentials: true,
          }
        );
      }
      
      fetchFavorites();
    } catch (error) {
      console.error(error);
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
