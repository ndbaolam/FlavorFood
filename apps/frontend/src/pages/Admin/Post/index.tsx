import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../../Meals/recipe.interface';
import SearchBox from "../../../components/Search";
import { PencilRuler, SquarePlus, Trash2 } from 'lucide-react';
import CreatePost from "../../../components/Admin/Post/CreatePost";
import RecipeDetailPopup from "../../../components/Admin/Post/RecipeDetailPopup";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from 'react-toastify';

interface Category {
  category_id: number;
  title: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [editingPost, setEditingPost] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    return savedCategory ? (savedCategory === 'all' ? 'all' : parseInt(savedCategory)) : 'all';
  });
  const LIMIT = 5;

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory.toString());
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<Category[]>('/categories', {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

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

      setIsPopupOpen(false);
      const response = await axiosInstance.get<Recipe[]>('/recipes', {
        withCredentials: true,
      });
      setPosts(response.data);
      setCurrentPage(1);

      toast.success("Tạo bài viết thành công");
    } catch (err: any) {
      setError(err.message);
      toast.error("Tạo bài viết thất bại");
    }
  };

  const handleUpdatePost = async (updatedPost: Recipe) => {
    setError(null);
    try {
      await axiosInstance.patch(`/recipes/${updatedPost.recipe_id}`, updatedPost, {
        withCredentials: true,
      });

      setEditingPost(null);
      setIsPopupOpen(false);

      const response = await axiosInstance.get<Recipe[]>('/recipes', {
        withCredentials: true,
      });

      setPosts(response.data);
      setCurrentPage(1);
      toast.success("Cập nhật bài viết thành công");
    } catch (err: any) {
      setError(err.message);
      toast.error("Cập nhật bài viết thất bại");
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
      setCurrentPage(1);

      toast.success("Xóa bài viết thành công");
      setSelectedPosts(selectedPosts.filter(id => id !== recipeId));
    } catch (err: any) {
      setError(err.message);
      toast.error("Xóa bài viết thất bại");
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

      setPosts(response.data);
      setCurrentPage(1);

      toast.success("Xóa bài viết thành công");
      setSelectedPosts([]);
    } catch (err: any) {
      setError(err.message);
      toast.error("Xóa bài viết thất bại");
    }
  };

  const handleEdit = (recipeId: number) => {
    const postToEdit = posts.find((post) => post.recipe_id === recipeId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setIsPopupOpen(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [searchTitle, selectedCategory]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum: number, label?: string) => (
      <button
        key={label || pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`px-3 py-1 rounded ${currentPage === pageNum
          ? "bg-blue-500 text-white font-medium"
          : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
      >
        {label || pageNum}
      </button>
    );

    const paginationItems = [];

    paginationItems.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded mr-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
        aria-label="Trang trước"
      >
        &lt;
      </button>
    );

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(renderPageButton(i));
      }
    } else {
      paginationItems.push(renderPageButton(1));

      if (currentPage > 2) {
        paginationItems.push(<span key="ellipsis1" className="px-2">...</span>);
      } else if (currentPage === 2) {
        paginationItems.push(renderPageButton(2));
      }

      if (currentPage > 2) {
        paginationItems.push(renderPageButton(currentPage));
      }

      if (currentPage < totalPages - 1) {
        paginationItems.push(renderPageButton(currentPage + 1));
      }

      if (currentPage < totalPages - 2) {
        paginationItems.push(<span key="ellipsis2" className="px-2">...</span>);
      } else if (currentPage === totalPages - 2) {
        paginationItems.push(renderPageButton(totalPages - 1));
      }

      if (currentPage < totalPages) {
        paginationItems.push(renderPageButton(totalPages));
      }
    }

    paginationItems.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded ml-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
        aria-label="Trang sau"
      >
        &gt;
      </button>
    );

    return (
      <div className="flex justify-end items-center space-x-1 mt-6">
        {paginationItems}
      </div>
    );
  };

  return (
    <div>
      <div className="text-4xl font-bold ml-3">
        Quản lý tài công thức
      </div>
      <div className=" mt-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <div>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsPopupOpen(true);
              }}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
            >
              <SquarePlus className="text-white" size={22} />
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
            className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
            disabled={selectedPosts.length === 0}
          >
            <Trash2 className="text-red-600 text-bold hover:text-red-800" size={22} />
            <span className='text-base text-bold text-center'>Xóa</span>
          </button>

        </div>

        <div className="flex space-x-3">
          <SearchBox onSearch={setSearchTitle} isPopupOpen={isPopupOpen} value={searchTitle} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="border-2 border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between p-4 text-md">
        <div>
          Tổng số công thức: {filteredPosts.length}
        </div>
        <div>
          Trang {currentPage} / {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto ml-4 mr-4 mb-4">
        <table className="min-w-full bg-white shadow-md border border-black">
          <thead>
            <tr className="bg-blue-700 text-white border-b  border-black">
              <th className="p-3 border-r border-white">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedPosts(e.target.checked ? posts.map((p) => p.recipe_id) : [])
                  }
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                />
              </th>
              <th className="p-3 text-center border-r border-white ">Tên món ăn</th>
              <th className="p-3 text-center border-r border-white ">Danh mục</th>
              <th className="p-3 text-center border-r border-white ">Ngày tạo</th>
              <th className="p-3 text-center border-r border-white ">Cập nhật</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <tr
                  key={post.recipe_id}
                  className="border-b hover:bg-gray-100  "
                  onClick={() => handleRecipeClick(post)} >
                  <td className="p-3 text-center border-black border-b">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.recipe_id)}
                      onChange={() => toggleSelect(post.recipe_id)}
                    />
                  </td>
                  <td className="p-3 border-l border-black border-b">{post.title}</td>
                  <td className="p-3 text-center border-l border-black border-b">{post.categories.map((c) => c.title).join(', ')}</td>
                  <td className="p-3 text-center border-l border-black border-b">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-center border-l border-black border-b">{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td className="p-3 border border-black">
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post.recipe_id);
                        }}
                        className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
                      >
                        <PencilRuler className="text-blue-600 hover:text-blue-800" size={22} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.recipe_id);
                        }}

                        className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2 ml-4"
                      >
                        <Trash2 className="text-red-600 hover:text-red-800" size={22} />
                      </button>
                    </div>
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
        {renderPagination()}
      </div>
      {selectedRecipe && (
        <RecipeDetailPopup recipe={selectedRecipe} onClose={closeRecipePopup} />
      )}
    </div>
  );
};

export default Posts;