import { PencilRuler, SquarePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBox from "../../../components/Search";
import CreateIngredient from "../../../components/Seller/CreateForm/CreateIngredient";
import { Ingredient, Store } from "../../../pages/Market/store.interface";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../utils/fomatPrice";
import { formatQuantity } from "../../../utils/fomatQuantity";

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
          axiosInstance.delete(`/store-ingredients/${id}`)
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
      await axiosInstance.put(`/store-ingredients/${ingredientId}`, {
        ...updatedData,
        price,
        quantity,
        unit: updatedData.unit
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

  const filteredFood = food.filter((item) =>
    item.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const sortedFood = filteredFood.sort((a, b) => {
    const aUpdatedAt = new Date(a.updated_at).getTime();
    const bUpdatedAt = new Date(b.updated_at).getTime();
    return bUpdatedAt - aUpdatedAt || a.title.localeCompare(b.title);
  });

  const totalPages = Math.ceil(sortedFood.length / LIMIT);
  const paginatedFood = sortedFood.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-100"
      >
        &lt;
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-blue-100"}`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-100"
      >
        &gt;
      </button>
    );

    return <div className="flex justify-end items-center space-x-1 mt-6">{buttons}</div>;
  };

  return (
    <div className="bg-white">
      <div className="mb-4 ml-4 mr-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
            >
              <SquarePlus className="text-white" size={22} />
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
              className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
              disabled={selectedIngredientId.length === 0}
            >
              <Trash2 className="text-red-600 hover:text-red-800" size={22} />
              <span>Xóa</span>
            </button>
          </div>
          <SearchBox onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
        </div>
      </div>
      <div className="flex justify-between p-4 text-md">
        <div>
          Tổng số công thức: {filteredFood.length}
        </div>
        <div>
          Trang {currentPage} / {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full bg-white shadow-md border border-black">
          <thead>
            <tr className="bg-blue-700 text-white border-b border-black">
              <th className="p-3 border-r border-white">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setIngredientId(e.target.checked ? food.map((f) => f.ingredient_id) : [])
                  }
                  checked={selectedIngredientId.length === food.length && food.length > 0}
                />
              </th>
              <th className="p-3 text-center border-r border-white">Tên nguyên liệu</th>
              <th className="p-3 text-center border-r border-white">Giá tiền</th>
              <th className="p-3 text-center border-r border-white">Đơn vị</th>
              <th className="p-3 text-center border-r border-white">Số lượng</th>
              <th className="p-3 text-center border-r border-white">Cập nhật</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFood.length > 0 ? (
              paginatedFood.map((product: Ingredient) => {
                const isEditing = editingId === product.ingredient_id;

                return (
                  <tr key={product.ingredient_id} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-center border-black border-b">
                      <input
                        type="checkbox"
                        checked={selectedIngredientId.includes(product.ingredient_id)}
                        onChange={() => toggleSelect(product.ingredient_id)}
                      />
                    </td>
                    <td className="p-3 border-l border-black border-b">
                      {isEditing ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.title || ""}
                          onChange={(e) =>
                            setEditingData({ ...editingData, title: e.target.value })
                          }
                        />
                      ) : (
                        product.title
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-black border-b">
                      {isEditing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.price || ""}
                          onChange={(e) =>
                            setEditingData({ ...editingData, price: Number(e.target.value) })
                          }
                        />
                      ) : (
                        formatCurrency(product.price)
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-black border-b">
                      {isEditing ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.unit || ""}
                          onChange={(e) =>
                            setEditingData({ ...editingData, unit: e.target.value })
                          }
                        />
                      ) : (
                        product.unit
                      )}
                    </td>

                    <td className="p-3 text-center border-l border-black border-b">
                      {isEditing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full"
                          value={editingData.quantity || ""}
                          onChange={(e) =>
                            setEditingData({ ...editingData, quantity: Number(e.target.value) })
                          }
                        />
                      ) : (
                        formatQuantity(product.quantity)
                      )}
                    </td>
                    <td className="p-3 text-center border-l border-black border-b">
                      {product.updated_at
                        ? new Date(product.updated_at).toLocaleDateString()
                        : "Chưa có dữ liệu"}
                    </td>
                    <td className="p-3 border border-black">
                      <div className="flex justify-center items-center gap-3 h-full">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditIngredient(product.ingredient_id, editingData)}
                              className="text-green-600 hover:text-green-800 px-3 py-1 border-2 border-green-300 rounded-md"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-700 hover:text-black px-3 py-1 border-2 border-gray-300 rounded-md"
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
                              className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
                            >
                              <PencilRuler className="text-blue-600 hover:text-blue-800" size={22} />
                            </button>
                            <button
                              onClick={() => handleDeleteIngredient(product.ingredient_id)}
                              className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
                            >
                              <Trash2 className="text-red-600 hover:text-red-800" size={22} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Không có nguyên liệu nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
};

export default IngredientTable;
