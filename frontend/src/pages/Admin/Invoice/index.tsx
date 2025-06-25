import { useEffect, useState, useMemo } from "react";
import axiosInstance from '../../../services/axiosInstance';
import { formatCurrency } from '../../../utils/fomatPrice';
import { formatDate } from '../../../utils/fomatDate';
import SearchBox from "../../../components/Search";
import { flexibleSearch } from "../../../utils/vietnameseUtils";

const AdminInvoice: React.FC = () => {
  const [invoice, setInvoice] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState(() => localStorage.getItem("invoice_searchTitle") || "");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(() => localStorage.getItem("invoice_selectedStatus") || "");

  const [showOnlyExpired, setShowOnlyExpired] = useState(false);

  const LIMIT = 5;
  useEffect(() => {
    localStorage.setItem("invoice_searchTitle", searchTitle);
  }, [searchTitle]);
  useEffect(() => {
    localStorage.setItem("invoice_selectedStatus", selectedStatus);
  }, [selectedStatus]);


  const getStatusInVietnamese = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Đang xử lý';
      case 'expired':
        return 'Hết hạn';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(`/invoice`);
        setInvoice(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy hóa đơn của người dùng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle, selectedStatus, showOnlyExpired]);

  const sortedInvoice = useMemo(() => {
    return [...invoice].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (dateB !== dateA) return dateB - dateA;

      const expiredA = Math.abs(new Date(a.user.expired_at).getTime() - Date.now());
      const expiredB = Math.abs(new Date(b.user.expired_at).getTime() - Date.now());
      if (expiredA !== expiredB) return expiredA - expiredB;

      return a.title.localeCompare(b.title);
    });
  }, [invoice]);

  const filteredInvoice = useMemo(() => {
    return sortedInvoice.filter((t) => {
      const buyerFullName = `${t.user?.first_name || ""} ${t.user?.last_name || ""}`;

      const matchSearch = flexibleSearch([
        t.title || '',
        t.description || '',
        buyerFullName
      ], searchTitle);

      const matchStatus = selectedStatus === '' || t.status === selectedStatus;
      const createdAt = new Date(t.created_at);
      const expiredAt = new Date(createdAt);
      expiredAt.setDate(createdAt.getDate() + t.subscription.day_remain);
      const isExpired = expiredAt < new Date();
      const matchExpired = !showOnlyExpired || isExpired;

      return matchSearch && matchStatus && matchExpired;
    });
  }, [sortedInvoice, searchTitle, selectedStatus, showOnlyExpired]);

  const totalPages = Math.ceil(filteredInvoice.length / LIMIT);

  const paginatedInvoice = useMemo(() => {
    const start = (currentPage - 1) * LIMIT;
    return filteredInvoice.slice(start, start + LIMIT);
  }, [filteredInvoice, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  if (loading) {
    return <div className="text-center p-6 text-lg">Đang tải dữ liệu hóa đơn...</div>;
  }

  return (
    <div>
      <div className="text-4xl font-bold ml-3">Quản lý hoá đơn</div>

      <div className="flex flex-wrap items-end justify-end gap-4 px-4 pt-4">
        <SearchBox placeholder="Tìm kiếm hoá đơn/người mua" onSearch={setSearchTitle} isPopupOpen={isPopupOpen} value={searchTitle} />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border-2 border-gray-300 rounded-lg px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Đã thanh toán</option>
          <option value="pending">Đang xử lý</option>
          <option value="expired">Hết hạn</option>
          <option value="failed">Thất bại</option>
        </select>
      </div>

      <div className="flex justify-between p-4 text-md">
        <div>Tổng số hoá đơn: {filteredInvoice.length}</div>
        <div>Trang {currentPage} / {totalPages}</div>
      </div>

      <div className="overflow-x-auto ml-4 mr-4 mb-4">
        <table className="min-w-full bg-white shadow-md border border-black">
          <thead>
            <tr className="bg-blue-700 text-white border-b border-black">
              <th className="p-3 text-center border-r border-white">Nội dung</th>
              <th className="p-3 text-center border-r border-white">Giá tiền (VNĐ)</th>
              <th className="p-3 text-center border-r border-white">Thời hạn (ngày)</th>
              <th className="p-3 text-center border-r border-white">Người mua</th>
              <th className="p-3 text-center border-r border-white">Email</th>
              <th className="p-3 text-center border-r border-white">Ngày tạo</th>
              <th className="p-3 text-center border-r border-white">Ngày hết hạn</th>
              <th className="p-3 text-center w-36">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoice.length > 0 ? (
              paginatedInvoice.map((t) => (
                <tr key={`${t.invoice_id}-${t.user.id}`} className="border-b border-gray-200">
                  <td className="p-3 border-l border-black border-b">{t.title}</td>
                  <td className="p-3 text-center border-l border-black border-b">{formatCurrency(t.subscription.price)}</td>
                  <td className="p-3 text-center border-l border-black border-b">{t.subscription.day_remain}</td>
                  <td className="p-3 text-center border-l border-black border-b">{t.user.first_name} {t.user.last_name}</td>
                  <td className="p-3 text-center border-l border-black border-b">{t.user.mail}</td>
                  <td className="p-3 text-center border-l border-black border-b">{formatDate(t.created_at)}</td>
                  {(() => {
                    const createdAt = new Date(t.created_at);
                    const expiredAt = new Date(createdAt);
                    expiredAt.setDate(createdAt.getDate() + t.subscription.day_remain);
                    const isExpired = expiredAt < new Date();
                    return (
                      <td className={`p-3 text-center border-l border-black border-b ${isExpired ? 'text-red-600' : ''}`}>
                        {formatDate(expiredAt.toISOString())}
                      </td>
                    );
                  })()}

                  <td className="p-3 text-center border-l border-black border-b w-36">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold
                        ${t.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : t.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : t.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : t.status === "expired"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {getStatusInVietnamese(t.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-3 text-center">Không có hóa đơn nào</td>
              </tr>
            )}
          </tbody>
        </table>
        {renderPagination()}
      </div>
    </div>
  );
};

export default AdminInvoice;