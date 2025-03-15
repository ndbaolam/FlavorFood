import { Search, Bell } from "lucide-react";
import './index.css';
const AdminHeader = () => {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
       <div className="flex items-center">
        <img src="./logo.png" alt="Logo" className="h-12 w-12 mr-2" />
        <a href="#" className="flavorfood-logo">FlavorFood</a>
      </div>
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Tìm kiếm tài khoản, bài viết..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
      </div>
      <div className="flex items-center space-x-6">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <div className="flex items-center space-x-2">
          <img src="/admin-avatar.jpg" alt="Admin" className="w-10 h-10 rounded-full" />
          <span className="text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
