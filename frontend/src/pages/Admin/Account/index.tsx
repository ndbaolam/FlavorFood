import React, { JSX, useEffect, useState } from "react";
import { User } from "../../Profile/Profile.interface";
import { LockKeyhole } from "lucide-react";
import SearchBox from "../../../components/Search";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from "react-toastify";
import { flexibleSearch } from '../../../utils/vietnameseUtils';
import { formatDate } from '../../../utils/fomatDate';
const LIMIT = 5;

interface Role {
  role_id: number;
  name: string;
}

const Account: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTitle, setSearchTitle] = useState(() => localStorage.getItem("account_searchTitle") || "");
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem("account_selectedRole") || "all");
  const [selectedStatus, setSelectedStatus] = useState(() => localStorage.getItem("account_selectedStatus") || "all");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get<Role[]>("/roles", { withCredentials: true });
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/users", { withCredentials: true });
        const nonAdminAccounts = response.data.filter(account => account.role !== 'admin');
        setAccounts(nonAdminAccounts);
        setFilteredAccounts(nonAdminAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const searched = accounts.filter(account => {
      const fullName = `${account.first_name} ${account.last_name}`;
      const searchFields = [fullName, account.mail];

      const matchesSearch = flexibleSearch(searchFields, searchTitle);

      const matchesRole =
        selectedRole === 'all' ||
        (selectedRole === 'user' && account.role?.toLowerCase() === 'normal') ||
        (selectedRole === 'moderator' && account.role?.toLowerCase() === 'seller');

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && account.status === 'active') ||
        (selectedStatus === 'inactive' && account.status === 'inactive');

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredAccounts(searched);
    setCurrentPage(1);
  }, [searchTitle, accounts, selectedRole, selectedStatus]);
  useEffect(() => {
    localStorage.setItem("account_searchTitle", searchTitle);
  }, [searchTitle]);

  useEffect(() => {
    localStorage.setItem("account_selectedRole", selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    localStorage.setItem("account_selectedStatus", selectedStatus);
  }, [selectedStatus]);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axiosInstance.put(`/users/${id}`, { status: newStatus }, { withCredentials: true });
      toast.success(`Đã chuyển trạng thái tài khoản sang ${newStatus}`);
      setAccounts(prev =>
        prev.map(acc => acc.user_id === id ? { ...acc, status: newStatus } : acc)
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  const handleBulkToggleStatus = async () => {
    try {
      await Promise.all(selectedAccounts.map(async id => {
        const acc = accounts.find(a => a.user_id === id);
        if (acc) {
          const newStatus = acc.status === "active" ? "inactive" : "active";
          await axiosInstance.put(`/users/${id}`, { status: newStatus }, { withCredentials: true });
        }
      }));
      toast.success("Cập nhật trạng thái tài khoản thành công");
      setAccounts(prev =>
        prev.map(acc =>
          selectedAccounts.includes(acc.user_id)
            ? { ...acc, status: acc.status === "active" ? "inactive" : "active" }
            : acc
        )
      );
      setSelectedAccounts([]);
    } catch (error) {
      console.error("Lỗi khi cập nhật hàng loạt:", error);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedAccounts(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredAccount = [...filteredAccounts].sort((a, b) => {
    const dateA = new Date(a.updated_at || 0).getTime();
    const dateB = new Date(b.updated_at || 0).getTime();
    return dateB - dateA;
  });
  const totalPages = Math.ceil(filteredAccount.length / LIMIT);
  const paginatedAccount = filteredAccount.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

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

    const paginationItems: JSX.Element[] = [];

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
        Quản lý tài khoản
      </div>
      <div className="mt-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleBulkToggleStatus}
            className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center gap-x-2"
            disabled={selectedAccounts.length === 0}
          >
            <LockKeyhole className="text-red-600 hover:text-red-800" size={22} />
            <span>Khóa/Mở khóa</span>
          </button>
        </div>
        <div className="flex space-x-3">
          <SearchBox placeholder="Tìm kiếm tên tài khoản" onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-1  focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="moderator">Quản lý cửa hàng</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between p-4 text-md">
        <div>Tổng số tài khoản: {filteredAccounts.length}</div>
        <div>Trang {currentPage} / {totalPages}</div>
      </div>

      <div className="overflow-x-auto ml-4 mr-4 mb-4">
        <table className="min-w-full bg-white shadow-md border border-black">
          <thead>
            <tr className="bg-blue-700 text-white border-b  border-black">
              <th className="p-3 border-r border-white ">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedAccounts(e.target.checked ? paginatedAccount.map(a => a.user_id) : [])
                  }
                  checked={
                    selectedAccounts.length === paginatedAccount.length &&
                    paginatedAccount.length > 0
                  }
                />
              </th>
              <th className="p-3 text-center border-r border-white">Họ và tên</th>
              <th className="p-3 text-center border-r border-white ">Email</th>
              <th className="p-3 text-center border-r border-white ">Vai trò</th>
              <th className="p-3 text-center border-r border-white ">Ngày tạo</th>
              <th className="p-3 text-center border-r border-white ">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccount.length > 0 ? (
              paginatedAccount.map((account) => (
                <tr key={account.user_id} className="border-b hover:bg-gray-100 ">
                  <td className="p-3 text-center border-black border-b">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.user_id)}
                      onChange={() => toggleSelect(account.user_id)}
                    />
                  </td>
                  <td className="p-3 text-center border-l border-black border-b">
                    {account.first_name} {account.last_name}
                  </td>
                  <td className="p-3 border-l border-black border-b">{account.mail}</td>
                  <td className="p-3 text-center border-l border-black border-b">
                    {account.role === "normal"
                      ? "Người dùng"
                      : account.role === "seller"
                        ? "Quản lý cửa hàng"
                        : account.role}
                  </td>
                  <td className="p-3 text-center border-l border-black border-b">{formatDate(account.created_at)}</td>
                  <td className="p-3 text-center border-l border-black border-b">
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${account.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}>
                      {account.status === "active" ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="p-3 border border-black">
                    <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => handleToggleStatus(account.user_id, account.status)}
                        className="text-black px-3 py-1 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                      >
                        <LockKeyhole className="text-red-600 hover:text-red-800" size={22} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Không tìm thấy kết quả nào
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

export default Account;
