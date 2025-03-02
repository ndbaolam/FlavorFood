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
      const formattedData = response.data.map((item: { favorite_id: number; recipe: any }) => ({
        favorite_id: item.favorite_id,
        recipe_id: item.recipe.recipe_id,
      }));
      setFavorites(formattedData);

      // Lưu danh sách yêu thích vào localStorage để giữ trạng thái khi tải lại trang
      localStorage.setItem("favorites", JSON.stringify(formattedData));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu thích:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchFavorites();
    } else {
      //Lấy danh sách yêu thích từ localStorage nếu không có accessToken
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [accessToken]);

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

      //Lưu vào localStorage để đảm bảo trạng thái yêu thích được giữ khi tải lại trang
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
