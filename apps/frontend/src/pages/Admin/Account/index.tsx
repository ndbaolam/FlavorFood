import React, { useEffect, useState } from "react";
import { User } from "../../Profile/Profile.interface";
import { LockKeyhole, Trash2 } from "lucide-react";
import SearchBox from "../../../components/Search";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from "react-toastify";

const LIMIT = 6;

interface Role {
  role_id: number;
  name: string;
}

const Account: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<User[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get<Role[]>("/roles", {
          withCredentials: true,
        });
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
        const response = await axiosInstance.get<User[]>("/users", {
          withCredentials: true,
        });
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
    const searchedAccounts = accounts.filter((account) =>
      (account.first_name?.toLowerCase().includes(searchTitle.toLowerCase()) ||
        account.last_name?.toLowerCase().includes(searchTitle.toLowerCase()) ||
        account.mail?.toLowerCase().includes(searchTitle.toLowerCase())) &&
      (
        selectedRole === 'all' ||
        (selectedRole === 'user' && account.role?.toLowerCase() === 'normal') ||
        (selectedRole === 'moderator' && account.role?.toLowerCase() === 'seller')
      )
    );
    setFilteredAccounts(searchedAccounts);
    setCurrentPage(1); 
  }, [searchTitle, accounts, selectedRole]);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/users/${id}`, { withCredentials: true });
      toast.success("Xóa tài khoản thành công");
      const updated = accounts.filter((acc) => acc.user_id !== id);
      setAccounts(updated);
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedAccounts.map((id) =>
          axiosInstance.delete(`/users/${id}`, { withCredentials: true })
        )
      );
      toast.success("Xóa tài khoản thành công");
      const updated = accounts.filter((acc) => !selectedAccounts.includes(acc.user_id));
      setAccounts(updated);
      setSelectedAccounts([]);
    } catch (error) {
      console.error("Lỗi khi xóa hàng loạt tài khoản:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedAccounts = [...filteredAccounts].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedAccounts.length / LIMIT);
  const paginatedAccounts = sortedAccounts.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const renderPageButton = (pageNum: number) => (
      <button
        key={pageNum}
        onClick={() => handlePageChange(pageNum)}
        className={`px-3 py-1 rounded ${currentPage === pageNum
          ? "bg-blue-500 text-white font-medium"
          : "bg-white text-gray-700 hover:bg-blue-100"
          }`}
      >
        {pageNum}
      </button>
    );

    const paginationItems = [];

    paginationItems.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded mr-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
      >
        &lt;
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(renderPageButton(i));
    }

    paginationItems.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded ml-1 bg-white text-gray-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-blue-100"
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
    <div className="m-12 border border-white rounded-xl shadow-lg bg-white">
      <div className="mt-4 flex items-center justify-between p-4">
        <div className="flex space-x-3">
          <button
            onClick={handleBulkDelete}
            className="text-black px-3 py-1 rounded-lg border-2 flex items-center gap-x-2"
            disabled={selectedAccounts.length === 0}
          >
            <Trash2 className="text-red-600 hover:text-red-800" size={18} />
            <span>Xóa</span>
          </button>
        </div>
        <div className="flex space-x-3">
          <SearchBox onSearch={setSearchTitle} isPopupOpen={false} value={searchTitle} />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Normal</option>
            <option value="moderator">Seller</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between p-4 text-md">
        <div>
          Tổng số tài khoản: {filteredAccounts.length}
        </div>
        <div>
          Trang {currentPage} / {totalPages}
        </div>
      </div>
      <div className="overflow-x-auto ml-4 mr-4 mb-4 rounded-lg">
        <table className="min-w-full bg-white shadow-md rounded-lg border items-center">
          <thead>
            <tr className="bg-blue-700 text-white text-left items-center justify-center">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedAccounts(
                      e.target.checked
                        ? paginatedAccounts.map((a) => a.user_id)
                        : []
                    )
                  }
                  checked={
                    selectedAccounts.length === paginatedAccounts.length &&
                    paginatedAccounts.length > 0
                  }
                />
              </th>
              <th className="p-3">Họ</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ngày tạo</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((account) => (
                <tr key={account.user_id} className="border-b hover:bg-gray-100 items-center">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.user_id)}
                      onChange={() => toggleSelect(account.user_id)}
                    />
                  </td>
                  <td className="p-3">{account.first_name}</td>
                  <td className="p-3">{account.last_name}</td>
                  <td className="p-3">{account.mail}</td>
                  <td className="p-3">{new Date(account.created_at).toLocaleDateString()}</td>
                  <td className="p-3">{account.role.charAt(0).toUpperCase() + account.role.slice(1)}</td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={() => handleDelete(account.user_id)}
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

        {renderPagination()}
      </div>
    </div>
  );
};

export default Account;
