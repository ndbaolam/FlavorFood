import { useEffect, useState } from "react";

const IngredientsFetcher = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm gọi API và xử lý dữ liệu
  const fetchIngredients = async () => {
    try {
      const response = await fetch("https://d1.supercook.com/dyn/lang_ings");
      const data = await response.json();
      const transformedData = transformData(data);
      setIngredients(transformedData.ingredients);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu nguyên liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi dữ liệu từ API sang định dạng mong muốn
  const transformData = (apiData) => {
    let transformedIngredients = [];

    apiData.forEach((group) => {
      group.items.forEach((item) => {
        transformedIngredients.push({
          id: Math.floor(Math.random() * 10000), // Tạo ID ngẫu nhiên (có thể thay thế bằng ID thực tế nếu có)
          name: item,
          type: group.group_name,
          image: "/images/default_ingredient.png",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          unit: "gram",
          description: "Đang tải...",
        });
      });
    });

    return { ingredients: transformedIngredients };
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Danh sách nguyên liệu</h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="p-3 border rounded-lg">
            <img src={ingredient.image} alt={ingredient.name} className="w-16 h-16 mx-auto" />
            <p className="text-center font-medium mt-2">{ingredient.name}</p>
            <p className="text-sm text-gray-500 text-center">{ingredient.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsFetcher;
