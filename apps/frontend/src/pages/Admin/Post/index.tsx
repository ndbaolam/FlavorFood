import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../Meals/recipe.interface';
import SearchBox from "../../../components/Search";
import { PencilRuler, SquarePlus, Trash2 } from 'lucide-react';
import CreatePost from "../../../components/Admin/Post/CreatePost";
import RecipeDetailPopup from "../../../components/Admin/Post/RecipeDetailPopup";
const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Recipe[]>([
    {
      recipe_id: 431,
      title: "Cá Trắm Kho Riềng Vũ Đại - Món Ngon Với Nước Mắm",
      description: "Cách làm món cá trắm kho riềng Vũ Đại với Nước mắm Ngon Nguyên Bản. Ướp và nấu với nước mắm, món thêm đậm đà khó cưỡng.",
      difficulty_level: "Trung bình",
      time: 120,
      image: "https://assets.unileversolutions.com/recipes-v3/248001-default.jpg",
      serving: 4,
      rating: { averageRating: 0, reviews: 0 },
      created_at: new Date("2025-03-24T11:05:42.676Z"),
      updated_at: new Date("2025-03-30T11:05:42.676Z"),
      categories: [
        { category_id: 51, title: "Món chính" }
      ],
      ingredients: [
        { id: 1766, ingredient: "riềng giã nát", quantity: 75, unit: "gram" },
        { id: 1765, ingredient: "cá trắm đen", quantity: 400, unit: "gram" },
        { id: 1768, ingredient: "ớt cay cắt nhỏ", quantity: 2, unit: "quả" },
        { id: 1767, ingredient: "riềng củ đập dập", quantity: 25, unit: "gram" }
      ],
      nutrition: [
        { id: 1025, name: "Năng lượng (kcal)", amount: 153.68, unit: "kcal" },
        { id: 1026, name: "Chất đạm (g)", amount: 14.11, unit: "g" }
      ],
      steps: [
        { number: 1, step: "Khử mùi tanh của cá cùng muối, gừng và nước cốt chanh. Cắt thành khoanh, để ráo nước." },
        { number: 2, step: "Lót riềng củ đập dập xuống đáy niêu, xếp cá thành lớp. Rải ớt, gừng và riềng lên trên." },
        { number: 3, step: "Kho cá trên lửa to, sau đó nhỏ lửa, đun liu riu đến khi cá mềm rục." }
      ]
    },
    {
      recipe_id: 432,
      title: "Ốc Bưu Nhồi Thịt",
      description: "Cách làm món ốc bưu nhồi thịt với Nước mắm Ngon Nguyên Bản. Đậm đà hương vị truyền thống.",
      difficulty_level: "Trung bình",
      time: 120,
      image: "https://assets.unileversolutions.com/recipes-v3/248002-default.jpg",
      rating: { averageRating: 0, reviews: 0 },

      created_at: new Date("2025-03-24T11:05:42.721Z"),
      updated_at: new Date("2025-03-25T11:05:42.721Z"),
      serving: 4,
      categories: [
        { category_id: 51, title: "Món chính" }
      ],
      ingredients: [
        { id: 1775, ingredient: "ốc bưu", quantity: 1, unit: "kilogram" },
        { id: 1776, ingredient: "thịt xay", quantity: 100, unit: "gram" }
      ],
      nutrition: [
        { id: 1031, name: "Chất đạm (g)", amount: 53.16, unit: "g" },
        { id: 1032, name: "Đường (g)", amount: 10.55, unit: "g" }
      ],
      steps: [
        { number: 1, step: "Pha nước mắm Knorr cùng hỗn hợp đường và nước lọc theo tỉ lệ 1:1:1." },
        { number: 2, step: "Đun sôi hỗn hợp trên lửa vừa phải, khuấy đều và vớt bọt." }
      ]
    }
  ]);

  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [editingPost, setEditingPost] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleAddPost = (newPost: Recipe) => {
    if (editingPost) {
      setPosts(posts.map((post) => post.recipe_id === editingPost.recipe_id ? newPost : post));
      setEditingPost(null);
    } else {
      setPosts([...posts, { ...newPost, recipe_id: posts.length + 1 }]);
    }
    setIsPopupOpen(false);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipePopup = () => {
    setSelectedRecipe(null);
  };

  { isPopupOpen && <CreatePost onClose={() => setIsPopupOpen(false)} onSubmit={handleAddPost} /> }

  const toggleSelect = (postId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter((post) => post.recipe_id !== postId));
  };

  const handleBulkDelete = () => {
    setPosts(posts.filter((post) => !selectedPosts.includes(post.recipe_id)));
    setSelectedPosts([]);
  };

  const handleEdit = (postId: number) => {
    const postToEdit = posts.find((post) => post.recipe_id === postId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setIsPopupOpen(true);
    }
  };
 

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
    post.categories.some((category) =>
      category.title.toLowerCase().includes(searchTitle.toLowerCase())
    )
  );

  return (
    <div className="m-12 border border-white rounded-xl shadow-lg bg-white">
      <div className="mb-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <div>
            <button
             onClick={() => {
              setEditingPost(null);
              setIsPopupOpen(true);
            }}
            className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
          >
              <SquarePlus className="text-white" size={18} />
              <span>Tạo công thức</span>
            </button>

            {isPopupOpen && (
              <CreatePost
                onClose={() => {
                  setIsPopupOpen(false);
                  setEditingPost(null);
                }}
                onSubmit={handleAddPost}
                initialData={editingPost || undefined}
                isEditing={!!editingPost}
              />
            )}
          </div>

          <button
            onClick={handleBulkDelete}
            className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
            disabled={selectedPosts.length === 0}
          >
            <Trash2 className="text-red-600 hover:text-red-800" size={18} />
            <span>Xóa</span>
          </button>
        </div>

        <SearchBox onSearch={setSearchTitle} isPopupOpen={isPopupOpen} />
      </div>


      <div className="overflow-x-auto ml-4 mr-4 mb-4 rounded-lg ">
        <table className="min-w-full bg-white shadow-md rounded-lg border">
          <thead>
            <tr
             className="bg-blue-700 text-white text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedPosts(e.target.checked ? posts.map((p) => p.recipe_id) : [])
                  }
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                />
              </th>
              <th className="p-3">Tên món ăn</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Cập nhật lần cuối</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr 
                key={post.recipe_id} 
                className="border-b hover:bg-gray-100 "
                onClick={() => handleRecipeClick(post)} >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.recipe_id)}
                      onChange={() => toggleSelect(post.recipe_id)}
                    />
                  </td>
                  <td className="p-3">{post.title}</td>
                  <td className="p-3">{post.categories.map((c) => c.title).join(', ')}</td>
                  <td className="p-3">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(post.recipe_id);
                      }}
                      className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                    >
                      <PencilRuler className="text-blue-600 hover:text-blue-800" size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.recipe_id);
                      }}
            
                      className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                    >
                      <Trash2 className="text-red-600 hover:text-red-800" size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  Không tìm thấy kết quả nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedRecipe && (
        <RecipeDetailPopup recipe={selectedRecipe} onClose={closeRecipePopup} />
      )}
    </div>
  );
};

export default Posts;
