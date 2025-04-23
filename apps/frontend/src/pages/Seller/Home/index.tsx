import { PencilRuler, SquarePlus, Trash2 } from "lucide-react";
import { FoodIngredient } from "./foodIngredientinterface";
import { useEffect, useState } from "react";
import SearchBox from "../../../components/Search";
import CreateIngredient from "../../../components/Seller/CreateForm/CreateIngredient";
import { on } from "events";
import { Ingredient } from "../../Market/store.interface";

const SellerHome = () => {
  const [food, setFood] = useState<FoodIngredient[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedIngredientId, setIngredientId] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
const [editingData, setEditingData] = useState<Partial<Ingredient>>({});

  const LIMIT = 6;

  const products: Ingredient[] = [
    {
      food_id: 1,
      title: "Thịt heo ba chỉ",
      price: 120000,
      quantity: 15,
      created_at: new Date("2024-12-01T08:00:00"),
      updated_at: new Date("2025-01-05T10:30:00")
    },
    {
      food_id: 2,
      title: "Trứng gà",
      price: 4000,
      quantity: 100,
      created_at: new Date("2025-01-10T09:15:00"),
      updated_at: new Date("2025-02-01T11:00:00")
    },
    {
      food_id: 3,
      title: "Gạo thơm",
      price: 22000,
      quantity: 50,
      created_at: new Date("2024-11-20T07:45:00"),
      updated_at: new Date("2025-01-15T12:00:00")
    },
    {
      food_id: 4,
      title: "Dầu ăn",
      price: 35000,
      quantity: 30,
      created_at: new Date("2024-10-05T10:00:00"),
      updated_at: new Date("2025-01-25T14:20:00")
    },
    {
      food_id: 5,
      title: "Hành lá",
      price: 15000,
      quantity: 25,
      created_at: new Date("2025-01-01T08:30:00"),
      updated_at: new Date("2025-01-03T09:45:00")
    },
    {
      food_id: 6,
      title: "Tỏi",
      price: 30000,
      quantity: 20,
      created_at: new Date("2025-01-02T11:00:00"),
      updated_at: new Date("2025-01-10T12:30:00")
    },
    {
      food_id: 7,
      title: "Nước mắm",
      price: 28000,
      quantity: 18,
      created_at: new Date("2024-12-25T13:00:00"),
      updated_at: new Date("2025-01-18T15:00:00")
    },
    {
      food_id: 8,
      title: "Đường trắng",
      price: 18000,
      quantity: 40,
      created_at: new Date("2025-01-05T08:00:00"),
      updated_at: new Date("2025-01-22T10:00:00")
    },
    {
      food_id: 9,
      title: "Muối",
      price: 10000,
      quantity: 35,
      created_at: new Date("2024-12-10T07:30:00"),
      updated_at: new Date("2025-01-08T09:00:00")
    },
    {
      food_id: 10,
      title: "Ớt tươi",
      price: 25000,
      quantity: 12,
      created_at: new Date("2024-12-15T10:45:00"),
      updated_at: new Date("2025-01-12T11:45:00")
    }
  ];

  const handleAddIngredient = (newIngredient: FoodIngredient) => {
    setFood((prev) => [...prev, newIngredient]);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    setFood(products);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

  const sortedFood = [...food].sort((a, b) => {
    const dateDiff = b.updated_at.getTime() - a.updated_at.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });
  
  const filteredFood = sortedFood.filter((item) =>
    item.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredFood.length / LIMIT);
  const paginatedFood = filteredFood.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  return (
    <div className="m-12 border border-white rounded-xl shadow-lg bg-white">
      <div className="mb-4 p-4">
        <h1 className="text-center font-bold text-3xl">Danh sách nguyên liệu</h1>

        <div className="flex justify-between mt-8 items-center">
          <div className="flex space-x-3 ml-8">
            <button 
              onClick={() => {
                setIsPopupOpen(true);
              }}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2">

              <SquarePlus className="text-white" size={18} />
              <span>Tạo nguyên liệu</span>
            </button>
            {isPopupOpen && (
              <CreateIngredient
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handleAddIngredient}
              />
            )}

            <button
              // onClick={handleBulkDelete}
              className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
              // disabled={selectedIngredientId.length === 0}
            >
              <Trash2 className="text-red-600 hover:text-red-800" size={18} />
              <span>Xóa</span>
            </button>
          </div>

          <div className="mr-8">
            <SearchBox onSearch={setSearchTitle} isPopupOpen={isPopupOpen} />
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
                      setIngredientId(e.target.checked ? food.map((f) => f.food_id) : [])
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
                paginatedFood.map((product: FoodIngredient) => {
                  const isEditing: boolean = editingId === product.food_id;
          
                  return (
                  <tr key={product.food_id} className="border-b">
                    <td className="p-3">
                    <input
                      type="checkbox"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setIngredientId(e.target.checked ? [product.food_id] : [])
                      }
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
                    <td className="p-3">{product.updated_at.toLocaleDateString()}</td>
                    <td className="p-3 flex justify-center space-x-3">
                    {isEditing ? (
                      <>
                      <button
                        onClick={() => {
                        const updatedFood: FoodIngredient[] = food.map((item) =>
                          item.food_id === product.food_id
                          ? {
                            ...item,
                            ...editingData,
                            updated_at: new Date(), 
                            }
                          : item
                        );
                        setFood(updatedFood);
                        setEditingId(null);
                        setEditingData({});
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                        setEditingId(null);
                        setEditingData({});
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Hủy
                      </button>
                      </>
                    ) : (
                      <>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setEditingId(product.food_id);
                        setEditingData({
                          title: product.title,
                          price: product.price,
                          quantity: product.quantity,
                        });
                        }}
                        className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                      >
                        <PencilRuler className="text-blue-600 hover:text-blue-800" size={18} />
                      </button>
                      <button
                        className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                      >
                        <Trash2 className="text-red-600 hover:text-red-800" size={18} />
                      </button>
                      </>
                    )}
                    </td>
                  </tr>
                  );
                })
                ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                  Không tìm thấy kết quả nào
                  </td>
                </tr>
                )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerHome;
