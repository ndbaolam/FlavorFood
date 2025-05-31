import { PencilRuler, SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBox from "../../../components/Search";
import CreateIngredient from "../../../components/Seller/CreateForm/CreateIngredient";
import { Ingredient, Store } from "../../../pages/Market/store.interface";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

interface IngredientTableProps {
  className?: string;
  ingredients: Ingredient[];
  store: Store;
}

const IngredientTable = ({ store, className, ingredients }: IngredientTableProps) => {
  const [food, setFood] = useState<Ingredient[]>(ingredients);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedIngredientId, setIngredientId] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Ingredient>>({});

  const LIMIT = 10;

  useEffect(() => {
    setFood(ingredients);
  }, [ingredients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

  const handleAddIngredient = async (newIngredient: Ingredient) => {
    try {
      const response = await axiosInstance.post('/store-ingredients', {
        ...newIngredient,
        store_id: store.store_id,
      });
      setFood((prev) => [...prev, response.data]);
      toast.success("Tạo nguyên liệu thành công!");
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Failed to add ingredient:", error);
      toast.error("Tạo nguyên liệu thất bại!");
    }
  };

  const handleDeleteIngredient = async (ingredientId: number) => {
    try {
      await axiosInstance.delete(`/store-ingredients/${ingredientId}`);
      setFood((prev) => prev.filter((item) => item.ingredient_id !== ingredientId));
      toast.success("Xóa nguyên liệu thành công!");
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast.error("Xóa nguyên liệu thất bại!");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIngredientId.length === 0) {
      toast.warning("Chưa chọn nguyên liệu để xóa!");
      return;
    }

    try {
      await Promise.all(
        selectedIngredientId.map((id) =>
          axiosInstance.delete(`/store-ingredients/${id}`, {
            withCredentials: true,
          })
        )
      );
      setFood((prev) => prev.filter((item) => !selectedIngredientId.includes(item.ingredient_id)));
      setIngredientId([]);
      toast.success("Xóa nguyên liệu thành công!");
    } catch (error) {
      console.error("Error deleting ingredients:", error);
      toast.error("Xóa nguyên liệu thất bại!");
    }
  };


  const handleEditIngredient = async (ingredientId: number, updatedData: Partial<Ingredient>) => {
    const price = Number(updatedData.price);
    const quantity = Number(updatedData.quantity);

    if (isNaN(price) || isNaN(quantity)) {
      toast.error("Giá tiền và số lượng phải là số hợp lệ!");
      return;
    }
    try {
      const response = await axiosInstance.put(`/store-ingredients/${ingredientId}`, {
        ...updatedData,
        price,
        quantity,
      });
      const updatedFood = food.map((item) =>
        item.ingredient_id === ingredientId ? { ...item, ...updatedData } : item
      );
      setFood(updatedFood);
      toast.success("Cập nhật nguyên liệu thành công!");
      setEditingId(null);
      setEditingData({});
    } catch (error) {
      console.error("Error updating ingredient:", error);
      toast.error("Cập nhật nguyên liệu thất bại!");
    }
  };

  const toggleSelect = (ingredientId: number) => {
    setIngredientId((prev) =>
      prev.includes(ingredientId) ? prev.filter((id) => id !== ingredientId) : [...prev, ingredientId]
    );
  };
  const sortedFood = [...food].sort((a, b) => {
    const aUpdatedAt = new Date(a.updated_at);
    const bUpdatedAt = new Date(b.updated_at);
    if (isNaN(aUpdatedAt.getTime()) || isNaN(bUpdatedAt.getTime())) {
      return 0;
    }

    const dateDiff = bUpdatedAt.getTime() - aUpdatedAt.getTime();
    if (dateDiff !== 0) return dateDiff;

    return a.title.localeCompare(b.title);
  });

  const filteredFood = sortedFood.filter((item) =>
    item.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFood.length / LIMIT);
  const paginatedFood = filteredFood.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  return (
    <div className="bg-white">
      <div className="mb-4 ml-4 mr-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2">
              <SquarePlus className="text-white" size={18} />
              <span>Tạo nguyên liệu</span>
            </button>
            {isPopupOpen && (
              <CreateIngredient
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleAddIngredient}
                store={store}
              />
            )}

            <button
              onClick={handleBulkDelete}
              className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
              disabled={selectedIngredientId.length === 0}>
              <Trash2 className="text-red-600 hover:text-red-800" size={18} />
              <span>Xóa</span>
            </button>
          </div>

          <div >
          <SearchBox onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto ml-4 mr-4 mb-4 rounded-lg mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr className="bg-blue-700 text-white text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setIngredientId(e.target.checked ? food.map((f) => f.ingredient_id) : [])
                  }
                  checked={selectedIngredientId.length === food.length && food.length > 0}
                />
              </th>
              <th className="p-3">Tên nguyên liệu</th>
              <th className="p-3">Giá tiền</th>
              <th className="p-3">Số lượng</th>
              <th className="p-3">Cập nhật</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedFood.length > 0 ? (
              paginatedFood.map((product: Ingredient) => {
                const isEditing: boolean = editingId === product.ingredient_id;

                return (
                  <tr key={product.ingredient_id} className="border-b">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIngredientId.includes(product.ingredient_id)}
                        onChange={() => toggleSelect(product.ingredient_id)}

                      />
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.title || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingData({ ...editingData, title: e.target.value })
                          }
                        />
                      ) : (
                        product.title
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.price || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingData({ ...editingData, price: Number(e.target.value) })
                          }
                        />
                      ) : (
                        product.price
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.quantity || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingData({ ...editingData, quantity: Number(e.target.value) })
                          }
                        />
                      ) : (
                        product.quantity
                      )}
                    </td>
                    <td className="p-3">
                      {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : "Chưa có dữ liệu"}
                    </td>

                    <td className="p-3 flex justify-center space-x-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleEditIngredient(product.ingredient_id, editingData)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-black"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(product.ingredient_id);
                              setEditingData(product);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilRuler size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteIngredient(product.ingredient_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={22} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">Không có nguyên liệu</td>
              </tr>
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4  space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientTable;
