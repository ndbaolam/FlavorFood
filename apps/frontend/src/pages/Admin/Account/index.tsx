import React, { useEffect, useState } from "react";
import { User } from "../../Profile/Profile.interface";
import { LockKeyhole, Trash2 } from "lucide-react";
import SearchBox from "../../../components/Search";
import axiosInstance from '../../../services/axiosInstance';
import { toast } from "react-toastify";

const Account: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get<User[]>("/users", {
          withCredentials: true,
        });
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
  
    fetchAccounts(); 
  }, []);
  
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/users/${id}`, {
        withCredentials: true,
      });
      toast.success("Xóa tài khoản thành công");
      setAccounts((prev) => prev.filter((account) => account.user_id !== id));
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
      setSelectedAccounts([]);
    } catch (error) {
      console.error("Lỗi khi xóa hàng loạt tài khoản:", error);
    }
  };
  

  const filteredAccounts = accounts.filter((account) =>
    account.first_name.toLowerCase().includes(searchTitle.toLowerCase()) ||
    account.last_name.toLowerCase().includes(searchTitle.toLowerCase()) ||
    account.mail.toLowerCase().includes(searchTitle.toLowerCase())
  );
  return (
    <div className="m-12 border border-white rounded-xl shadow-lg  bg-white">

      <div className="mb-4 flex items-center justify-between p-4">
        <SearchBox onSearch={setSearchTitle} isPopupOpen={false} />
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
      </div>
      <div className="overflow-x-auto ml-4 mr-4 rounded-lg ">
        <table className="min-w-full bg-white shadow-md rounded-lg border items-center">
          <thead>
            <tr className="bg-blue-700 text-white text-left items-center justify-center">
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedAccounts(e.target.checked ? accounts.map((a) => a.user_id) : [])
                  }
                  checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                />
              </th>
              <th className="p-3">ID</th>
              <th className="p-3">Họ</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3 "></th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <tr key={account.user_id} className="border-b hover:bg-gray-100 items-center">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.user_id)}
                      onChange={() => toggleSelect(account.user_id)}
                    />
                  </td>
                  <td className="p-3">{account.user_id}</td>
                  <td className="p-3">{account.first_name}</td>
                  <td className="p-3">{account.last_name}</td>
                  <td className="p-3">{account.mail}</td>
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
      </div>
    </div>
  );
};

export default Account;
