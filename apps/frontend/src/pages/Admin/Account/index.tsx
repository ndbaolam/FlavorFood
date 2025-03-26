import React, { useState } from "react";
import { User } from "../../Profile/Profile.interface";
import { LockKeyhole, Trash2 } from "lucide-react";
import SearchBox from "../../../components/Search";


const Account: React.FC = () => {
  const [accounts, setAccounts] = useState<User[]>([
    { user_id: 1, first_name: "Trần", last_name: "Anh", mail: "nguyenvana@example.com", avatar: "", role: "Norm" },
    { user_id: 2, first_name: "Đinh", last_name: "Hoa", mail: "tranthib@example.com", avatar: "", role: "Seller" },
    { user_id: 3, first_name: "Nguyễn", last_name: "Lâm", mail: "levanc@example.com", avatar: "", role: "Admin" },
  ]);

  const [searchTitle, setSearchTitle] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter((account) => account.user_id !== id));
  };

  const handleBlock = (id: number) => {
    alert(`Tài khoản có ID ${id} đã bị khóa!`);
  };

  const toggleSelect = (id: number) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setAccounts(accounts.filter((account) => !selectedAccounts.includes(account.user_id)));
    setSelectedAccounts([]);
  };

  const handleBulkBlock = () => {
    alert(`Các tài khoản có ID ${selectedAccounts.join(", ")} đã bị khóa!`);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.first_name.toLowerCase().includes(searchTitle.toLowerCase()) ||
    account.last_name.toLowerCase().includes(searchTitle.toLowerCase()) ||
    account.mail.toLowerCase().includes(searchTitle.toLowerCase())
  );
  return (
    <div className="m-12 border border-white rounded-xl shadow-lg  bg-white">

      <div className="mb-4 flex items-center justify-between p-4">
        <SearchBox  onSearch={setSearchTitle} />
        <div className="flex space-x-3">
          <button
            onClick={handleBulkBlock}
            className="text-black px-3 py-1 border-2 rounded-lg  border-blue-700 flex items-center gap-x-2"
            disabled={selectedAccounts.length === 0}
          >
            <LockKeyhole className="text-blue-600 hover:text-blue-800" size={18} />
            <span>Chặn  </span>
          </button>
          <button
            onClick={handleBulkDelete}
            className="text-black px-3 py-1 rounded-lg  border-2 border-blue-700 flex items-center gap-x-2"
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
              <th className="p-3 text-center">Hành động</th>
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
                      onClick={() => handleBlock(account.user_id)}
                      className="text-black px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
                    >
                      <LockKeyhole className="text-blue-600 hover:text-blue-800" size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(account.user_id)}
                      className="text-black px-3 py-1 rounded-lg border-2 border-blue-700 flex items-center gap-x-2"
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
