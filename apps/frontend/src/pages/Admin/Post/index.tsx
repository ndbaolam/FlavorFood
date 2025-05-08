import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../Meals/recipe.interface';
import SearchBox from "../../../components/Search";
import { PencilRuler, SquarePlus, Trash2 } from 'lucide-react';
import CreatePost from "../../../components/Admin/Post/CreatePost";
import RecipeDetailPopup from "../../../components/Admin/Post/RecipeDetailPopup";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from 'react-toastify';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Recipe[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [editingPost, setEditingPost] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const LIMIT = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<Recipe[]>('/recipes', {
          withCredentials: true,
        });
        setPosts(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAddPost = async (newPost: Recipe) => {
    setError(null);
    try {
      await axiosInstance.post('/recipes', newPost, {
        withCredentials: true,
      });
  
      const response = await axiosInstance.get<Recipe[]>('/recipes');
      setPosts(response.data);
      setIsPopupOpen(false);
      toast.success("Tạo bài viết thành công");
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleUpdatePost = async (updatedPost: Recipe) => {
    setError(null);
    try {
      await axiosInstance.patch(`/recipes/${updatedPost.recipe_id}`, updatedPost, {
        withCredentials: true,
      });
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.recipe_id === updatedPost.recipe_id ? { ...post, ...updatedPost } : post
        )
      );
      setIsPopupOpen(false);
      setEditingPost(null);
      toast.success("Cập nhật bài viết thành công");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipePopup = () => {
    setSelectedRecipe(null);
  };

  const toggleSelect = (recipeId: number) => {
    setSelectedPosts((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleDelete = async (recipeId: number) => {
    setError(null);
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`, {
        withCredentials: true,
      });

      const response = await axiosInstance.get<Recipe[]>('/recipes', {
        withCredentials: true,
      });
      setPosts(response.data);
      toast.success("Xóa bài viết thành công");
      setSelectedPosts(selectedPosts.filter(id => id !== recipeId));

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBulkDelete = async () => {
    setError(null);
    try {
      await Promise.all(selectedPosts.map(recipeId =>
        axiosInstance.delete(`/recipes/${recipeId}`, { withCredentials: true })
      ));

      const response = await axiosInstance.get<Recipe[]>('/recipes', {
        withCredentials: true,
      });
      toast.success("Xóa bài viết thành công");
      setPosts(response.data);

      setSelectedPosts([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (recipeId: number) => {
    const postToEdit = posts.find((post) => post.recipe_id === recipeId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setIsPopupOpen(true);
    }
  };


  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  
  const filteredPosts = sortedPosts.filter((post) => {
    const matchesTitle = post.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      post.categories.some((category) =>
        category.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
  
    const matchesCategory = selectedCategory === 'all' ||
      post.categories.some((category) => category.category_id === selectedCategory);
  
    return matchesTitle && matchesCategory;
  });
  
  const totalPages = Math.ceil(filteredPosts.length / LIMIT);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

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
              onSubmit={editingPost ? handleUpdatePost : handleAddPost}
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
        <div className="flex space-x-3">
          <SearchBox onSearch={setSearchTitle} isPopupOpen={isPopupOpen} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="48">Khai vị</option>
            <option value="51">Món chính</option>
            <option value="49">Tráng miệng</option>
            <option value="50">Ăn vặt</option>
          </select>
        </div>

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
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
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
      {selectedRecipe && (
        <RecipeDetailPopup recipe={selectedRecipe} onClose={closeRecipePopup} />
      )}
    </div>
  );
};

export default Posts;
