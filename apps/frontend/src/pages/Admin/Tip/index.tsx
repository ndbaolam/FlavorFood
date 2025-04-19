import React, { useEffect, useState } from 'react';
import { TipsItem } from '../../Tips/tip.interface';
import { SquarePlus, Trash2, PencilRuler } from 'lucide-react';
import CreateTip from "../../../components/Admin/Tip/CreateTip";
import SearchBox from "../../../components/Search";
import TipDetailPopup from "../../../components/Admin/Tip/TipDetailPopup";
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';

const Tip: React.FC = () => {
  const [tip, setTip] = useState<TipsItem[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<TipsItem | null>(null);
  const [selectedTipIds, setSelectedTipIds] = useState<number[]>([]);
  const [editingTip, setEditingTip] = useState<TipsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const LIMIT = 6;

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
      setError(err.message );
    
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
      setError(err.message );
    }
  };

  const handleEdit = (tipId: number) => {
    const tipToEdit = tip.find((t) => t.tip_id === tipId);
    if (tipToEdit) {
      setEditingTip(tipToEdit);
      setIsPopupOpen(true);
    }
  };

  const filteredTips = tip.filter((t) =>
    t.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTips.length / LIMIT);

  const paginatedTips = filteredTips.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);
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
                setEditingTip(null);
                setIsPopupOpen(true);
              }}
              className="text-white bg-blue-700 px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
            >
              <SquarePlus className="text-white" size={18} />
              <span>Tạo mẹo vặt nhà bếp</span>
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
            className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
            disabled={selectedTipIds.length === 0}
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
            <tr className="bg-blue-700 text-white text-left">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedTipIds(e.target.checked ? tip.map((t) => t.tip_id) : [])
                  }
                  checked={selectedTipIds.length === tip.length && tip.length > 0}
                />
              </th>
              <th className="p-3">Tiêu đề mẹo vặt</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Cập nhật lần cuối</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedTips.length > 0 ? (
              paginatedTips.map((t) => (
                <tr
                  key={t.tip_id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTipClick(t)}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedTipIds.includes(t.tip_id)}
                      onChange={() => toggleSelect(t.tip_id)}
                    />
                  </td>
                  <td className="p-3">{t.title}</td>
                  <td className="p-3"> {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'N/A'}</td>

                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(t.tip_id);
                      }}
                      className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
                    >
                      <PencilRuler className="text-blue-600 hover:text-blue-800" size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.tip_id);
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
                <td colSpan={5} className="p-4 text-center text-gray-500">
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
      {selectedTip && (<TipDetailPopup tip={selectedTip} onClose={closeTipPopup} />)}
    </div>
  );
};

export default Tip;