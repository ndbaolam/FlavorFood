import { Link } from "react-router-dom";
import { Home, Users, FileText, Lightbulb, Settings, LogOut } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-blue-100 h-screen shadow-lg flex flex-col justify-between p-6">
      {/* Menu Chính */}
      <div>

        <ul className="space-y-3">
          <li>
            <Link to="/admin/dashboard" className="flex items-center p-3 hover:bg-blue-600 rounded-lg">
              <Home className="w-5 h-5 mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/accounts" className="flex items-center p-3 hover:bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 mr-2" /> Quản lý tài khoản
            </Link>
          </li>
          <li>
            <Link to="/admin/posts" className="flex items-center p-3 hover:bg-blue-600 rounded-lg">
              <FileText className="w-5 h-5 mr-2" /> Quản lý bài viết
            </Link>
          </li>
          <li>
            <Link to="/admin/tips" className="flex items-center p-3 hover:bg-blue-600 rounded-lg">
              <Lightbulb className="w-5 h-5 mr-2" /> Quản lý Tips
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="flex items-center p-3 hover:bg-blue-600 rounded-lg">
              <Settings className="w-5 h-5 mr-2" /> Cài đặt
            </Link>
          </li>
        </ul>
      </div>

      {/* Nút Đăng Xuất */}
      <div>
        <button className="flex items-center  p-3 bg-blue-400 text-white  rounded-lg hover:bg-blue-600">
          <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
