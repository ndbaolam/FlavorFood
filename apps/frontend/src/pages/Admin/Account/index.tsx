import React, { useEffect, useState } from "react";
import { User } from "../../Profile/Profile.interface";
import { LockKeyhole, Trash2 } from "lucide-react";
import SearchBox from "../../../components/Search";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from "react-toastify";

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
  const LIMIT = 6;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get<Role[]>("/roles", {
          withCredentials: true,
        });
        console.log("Fetched roles:", response.data);
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
        setAccounts(response.data); 
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
      account.role !== 'admin' &&
      (selectedRole === 'all' || 
        (selectedRole === 'user' && account.role === 'norm') ||
        (selectedRole === 'moderator' && account.role === 'seller'))
    );
    setFilteredAccounts(searchedAccounts);
  }, [searchTitle, accounts, selectedRole]);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/users/${id}`, {
        withCredentials: true,
      });
      toast.success("Xóa tài khoản thành công");
      setAccounts((prev) => prev.filter((account) => account.user_id !== id));
      setFilteredAccounts((prev) => prev.filter((account) => account.user_id !== id));
      setSelectedAccounts((prev) => prev.filter((uid) => uid !== id));
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
      setAccounts((prev) => prev.filter((account) => !selectedAccounts.includes(account.user_id)));
      setFilteredAccounts((prev) => prev.filter((account) => !selectedAccounts.includes(account.user_id)));
      setSelectedAccounts([]);
    } catch (error) {
      console.error("Lỗi khi xóa hàng loạt tài khoản:", error);
    }
  };
  const totalPages = Math.ceil(filteredAccounts.length / LIMIT);
  const paginatedAccounts= filteredAccounts.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle]);

  return (
    <div className="m-12 border border-white rounded-xl shadow-lg  bg-white">
      <div className="mb-4 flex items-center justify-between p-4 mt-2">
        <button
          onClick={handleBulkDelete}
          className="text-black px-3 py-1 rounded-lg border-2 flex items-center justify-center gap-x-2 h-[45px]"
          disabled={selectedAccounts.length === 0}
        >
          <Trash2 className="text-red-600 hover:text-red-800" size={18} />
          <span>Xóa</span>
        </button>
        <div className="flex space-x-3">
          <div className="h-[38px]">
            <SearchBox onSearch={setSearchTitle} isPopupOpen={false} />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[45px]"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Normal</option>
            <option value="moderator">Seller</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto ml-4 mr-4 mb-4 rounded-lg ">
        <table className="min-w-full bg-white shadow-md rounded-lg border items-center">
          <thead>
            <tr className="bg-blue-700 text-white text-left items-center justify-center">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedAccounts(
                      e.target.checked ? filteredAccounts.map((a) => a.user_id) : []
                    )
                  }
                  checked={
                    selectedAccounts.length === filteredAccounts.length &&
                    filteredAccounts.length > 0
                  }
                />
              </th>
              <th className="p-3">Họ</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3 "></th>
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
                <td colSpan={6} className="p-4 text-center text-gray-500">
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
    </div>
  );
};

export default Account;