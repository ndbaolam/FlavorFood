import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, Lightbulb, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const AdminSidebar: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Toggle Sidebar
  const [activePage, setActivePageState] = useState("Dashboard"); // Mặc định vào Dashboard

  const menuItems = [
    { to: "/admin", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
    { to: "/admin/accounts", icon: <Users className="w-5 h-5" />, label: "Quản lý tài khoản" },
    { to: "/admin/posts", icon: <FileText className="w-5 h-5" />, label: "Quản lý bài viết" },
    { to: "/admin/tips", icon: <Lightbulb className="w-5 h-5" />, label: "Quản lý Tips" },
    { to: "/admin/settings", icon: <Settings className="w-5 h-5" />, label: "Cài đặt" },
  ];

  const handlePageChange = (label: string) => {
    setActivePage(label);
    setActivePageState(label);
    setIsOpen(false); // Đóng sidebar khi chọn menu trên mobile
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-md text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-blue-100 p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:relative md:translate-x-0`}
      >
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl text-blue-600 font-bold">Flavor Food</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-4 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => handlePageChange(item.label)}
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg w-full text-left transition ${
                activePage === item.label ? "bg-blue-700 font-bold text-white" : "hover:bg-blue-500"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <button className="flex items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default AdminSidebar;
