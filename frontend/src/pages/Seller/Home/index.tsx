import { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";
import StoreInfor from "../../../components/Seller/Store/StoreInfor";
import IngredientTable from "../../../components/Seller/Store/IngredientTable";
import CreateStore from "../../../components/Seller/Store/CreateStore";
import { Store } from "../../Market/store.interface";
import { User } from "../../Profile/Profile.interface";
import { SquarePlus } from "lucide-react";
import CreateIngredient from "../../../components/Seller/CreateForm/CreateIngredient";
import { Ingredient } from "../../Market/store.interface";
import React from "react";

const SellerHome = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foodId, setFoodId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"store" | "ingredients">("store");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/auth/profile", { withCredentials: true });
        const userData: User = userRes.data;
        setCurrentUser(userData);

        const storeRes = await axiosInstance.get("/stores", { withCredentials: true });
        const storeList: Store[] = storeRes.data;
        const userStore = storeList.find((store) => store.user.user_id === userData.user_id);
        setStore(userStore || null);
      } catch (error) {
        setError("Có lỗi xảy ra khi tải dữ liệu người dùng hoặc cửa hàng.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (store) {
      const fetchIngredients = async () => {
        setIngredientsLoading(true);
        setError(null);
        try {
          const ingredientsRes = await axiosInstance.get(`stores/${store.store_id}`, { withCredentials: true });
          const storeData = ingredientsRes.data;
          setIngredients(storeData.ingredients || []);
        } catch (error) {
          setError("Có lỗi xảy ra khi tải nguyên liệu.");
          console.error("Error fetching ingredients:", error);
        } finally {
          setIngredientsLoading(false);
        }
      };

      fetchIngredients();
    }
  }, [store]);

  const handleCreateStoreSuccess = (newStore: Store) => {
    setStore(newStore);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        Không thể xác định người dùng.
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-xl mb-4">Bạn chưa có cửa hàng, hãy tạo mới!</p>
        <CreateStore onCreate={handleCreateStoreSuccess} currentUser={currentUser} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen"> 
      <div className="bg-white rounded-lg shadow-md p-4 border-gray-100 border-2">
        <div className="flex space-x-4 mb-6 border-b  border-gray-300">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "store"
                ? "border-b-2 border-blue-600 text-blue-600  text-bold text-xl"
                : "text-black text-bold text-xl"
            }`}
            onClick={() => setActiveTab("store")}
          >
            Thông tin cửa hàng
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "ingredients"
                ? "border-b-2 border-blue-600 text-blue-600  text-bold text-xl"
                : "text-black text-bold text-xl"
            }`}
            onClick={() => setActiveTab("ingredients")}
          >
            Nguyên liệu
          </button>
        </div>

        {activeTab === "store" && (
          <StoreInfor
            className="p-6 h-full"
            store_id={store.store_id}
            currentUser={currentUser}
          />
        )}

        {activeTab === "ingredients" && (
          <div className="flex flex-col">
            <div className="flex justify-start mb-4">
              {ingredients.length === 0 && (
              <button
                onClick={() => setIsPopupOpen(true)}
                className="ml-4 mt-8 text-white bg-blue-700 text-lg px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
              >
                <SquarePlus className="text-white" size={18} />
                <span>Tạo nguyên liệu</span>
              </button>
            )}
            </div>
            {isPopupOpen && (
              <CreateIngredient
                onClose={() => setIsPopupOpen(false)}
                onSubmit={(newIngredient) => {
                  setFoodId(newIngredient.ingredient_id);
                  setIsPopupOpen(false);
                  setIngredients([...ingredients, newIngredient]);
                }}
                store={store}
              />
            )}
            {ingredientsLoading ? (
              <p className="text-lg text-center text-gray-500">Đang tải nguyên liệu...</p>
            ) : ingredients.length === 0 ? (
              <p className="text-lg text-center text-gray-500">Chưa có nguyên liệu nào.</p>
            ) : (
              <IngredientTable store={store} ingredients={ingredients} />
            )}
            {error && <p className="text-lg text-center text-red-500 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerHome;
