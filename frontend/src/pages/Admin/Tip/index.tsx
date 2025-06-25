import React, { useEffect, useState } from 'react';
import { TipsItem } from '../../Tips/Tip.interface';
import { SquarePlus, Trash2, PencilRuler } from 'lucide-react';
import CreateTip from "../../../components/Admin/Tip/CreateTip";
import SearchBox from "../../../components/Search";
import TipDetailPopup from "../../../components/Admin/Tip/TipDetailPopup";
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import { flexibleSearch } from '../../../utils/vietnameseUtils';
import { formatDate } from '../../../utils/fomatDate';

const Tip: React.FC = () => {
  const [tip, setTip] = useState<TipsItem[]>([]);
  const [searchTitle, setSearchTitle] = useState(() => localStorage.getItem("tip_searchTitle") || "");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<TipsItem | null>(null);
  const [selectedTipIds, setSelectedTipIds] = useState<number[]>([]);
  const [editingTip, setEditingTip] = useState<TipsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const LIMIT = 5;
  useEffect(() => {
    localStorage.setItem("tip_searchTitle", searchTitle);
  }, [searchTitle]);

  useEffect(() => {
    const fetchTip = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
          withCredentials: true,
        });
        setTip(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, []);

  const handleAddTip = async (newTip: TipsItem) => {
    setError(null);
    try {
      const method = editingTip ? 'PATCH' : 'POST';
      const url = editingTip ? `/tips/${editingTip.tip_id}` : '/tips/create';

      await axiosInstance({
        method,
        url,
        data: newTip,
        withCredentials: true,
      });

      const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
        withCredentials: true,
      });
      setTip(response.data);

      setIsPopupOpen(false);
      setEditingTip(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTipClick = (tip: TipsItem) => {
    setSelectedTip(tip);
  };

  const closeTipPopup = () => {
    setSelectedTip(null);
  };

  const toggleSelect = (tipId: number) => {
    setSelectedTipIds((prev) =>
      prev.includes(tipId) ? prev.filter((id) => id !== tipId) : [...prev, tipId]
    );
  };

  const handleDelete = async (tipId: number) => {
    setError(null);
    try {
      await axiosInstance.delete(`/tips/${tipId}`, {
        withCredentials: true,
      });

      const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
        withCredentials: true,
      });
      toast.success("Xóa tip thành công");
      setTip(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBulkDelete = async () => {
    setError(null);
    try {
      await Promise.all(
        selectedTipIds.map((id) =>
          axiosInstance.delete(`/tips/${id}`, { withCredentials: true })
        )
      );

      const response = await axiosInstance.get<TipsItem[]>('/tips/all', {
        withCredentials: true,
      });
      toast.success("Xóa tip thành công");
      setTip(response.data);

      setSelectedTipIds([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (tipId: number) => {
    const tipToEdit = tip.find((t) => t.tip_id === tipId);
    if (tipToEdit) {
      setEditingTip(tipToEdit);
      setIsPopupOpen(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortedTips = [...tip].sort((a, b) => {
    const dateA = new Date(a.updatedAt || 0).getTime();
    const dateB = new Date(b.updatedAt || 0).getTime();
    return dateB - dateA;
  });

  const filteredTips = sortedTips.filter((t) =>
    flexibleSearch([t.title], searchTitle)
  );

  const totalPages = Math.ceil(filteredTips.length / LIMIT);
  const paginatedTips = filteredTips.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

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
        Quản lý tài mẹo vặt
      </div>
      <div className="mt-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <div>
            <button
              onClick={() => {
                setEditingTip(null);
                setIsPopupOpen(true);
              }}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
            >
              <SquarePlus className="text-white" size={22} />
              <span>Tạo mẹo vặt</span>
            </button>

            {isPopupOpen && (
              <CreateTip
                onClose={() => {
                  setIsPopupOpen(false);
                  setEditingTip(null);
                }}
                onSubmit={handleAddTip}
                initialData={editingTip || undefined}
                isEditing={!!editingTip}
              />
            )}
          </div>

          <button
            onClick={handleBulkDelete}
            className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
            disabled={selectedTipIds.length === 0}
          >
            <Trash2 className="text-red-600 hover:text-red-800" size={22} />
            <span>Xóa</span>
          </button>
        </div>

        <SearchBox placeholder="Tìm kiếm mẹo vặt" onSearch={setSearchTitle} isPopupOpen={isPopupOpen} value={searchTitle} />
      </div>
      <div className="flex justify-between p-4 text-md">
        <div>
          Tổng số mẹo vặt: {filteredTips.length}
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
                    setSelectedTipIds(e.target.checked ? tip.map((t) => t.tip_id) : [])
                  }
                  checked={selectedTipIds.length === tip.length && tip.length > 0}
                />
              </th>
              <th className="p-3 text-center border-r border-white ">Tên mẹo vặt</th>
              <th className="p-3 text-center border-r border-white ">Ngày tạo</th>
              <th className="p-3 text-center border-r border-white ">Cập nhật</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTips.length > 0 ? (
              paginatedTips.map((t) => (
                <tr
                  key={t.tip_id}
                  className="border-b hover:bg-gray-100"
                  onClick={() => handleTipClick(t)}
                >
                  <td className="p-3 text-center border-black border-b">
                    <input
                      type="checkbox"
                      checked={selectedTipIds.includes(t.tip_id)}
                      onChange={() => toggleSelect(t.tip_id)}
                    />
                  </td>
                  <td className="p-3 border-l border-black border-b">{t.title}</td>
                  <td className="p-3 text-center border-l border-black border-b"> {formatDate(t.createdAt)}</td>
                  <td className="p-3 text-center border-l border-black border-b">{formatDate(t.updatedAt)}</td>
                  <td className="p-3 border border-black">
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(t.tip_id);
                        }}
                        className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
                      >
                        <PencilRuler className="text-blue-600 hover:text-blue-800" size={22} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t.tip_id);
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
                <td colSpan={5} className="p-4 text-center text-black">
                  Không tìm thấy kết quả nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
      {selectedTip && (<TipDetailPopup tip={selectedTip} onClose={closeTipPopup} />)}
    </div>
  );
};

export default Tip;