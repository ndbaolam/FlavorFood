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

const SellerHome = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foodId, setFoodId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); 
  const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/auth/profile", { withCredentials: true });
        const userData: User = userRes.data;
        setCurrentUser(userData);
        console.log("currentUser.user_id:", userData.user_id);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <p className="text-xl mb-4">Bạn chưa có cửa hàng, hãy tạo mới!</p>
        <CreateStore onCreate={handleCreateStoreSuccess} currentUser={currentUser} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-8xl mx-auto px-4 items-stretch m-8 min-h-screen">
      <div className="w-full md:w-[40%] h-full">
        <StoreInfor
          className="p-6 h-full"
          store_id={store.store_id}
          currentUser={currentUser}
        />
      </div>

      <div className="w-full md:w-[60%] h-full">
        <div className="border border-white rounded-xl shadow-lg bg-white p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-center mt-4">Danh sách nguyên liệu</h2>
        
          <div className="flex justify-between items-center mb-4">
            {ingredients.length === 0 && (
              <button
                onClick={() => setIsPopupOpen(true)}
                className="ml-4 mt-8 text-white bg-blue-700 text-lg px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
              >
                <SquarePlus className="text-white" size={18} />
                <span>Tạo nguyên liệu</span>
              </button>
            )}
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
          </div>

          <div className="flex-1">
            {ingredientsLoading ? (
              <p className="text-lg text-center text-gray-500">Đang tải nguyên liệu...</p>
            ) : ingredients.length === 0 ? (
              <p className="text-lg text-center text-gray-500">Chưa có nguyên liệu nào.</p>
            ) : (
              <IngredientTable
                store={store} 
                ingredients={ingredients}
              />
            )}
            {error && (
              <p className="text-lg text-center text-red-500 mt-4">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
