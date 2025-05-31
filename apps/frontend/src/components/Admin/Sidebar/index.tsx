import { Link, useLocation } from "react-router-dom";
import {
  Users,
  FileText,
  Lightbulb,
  Store,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface Props {
  setActivePage: (page: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const AdminSidebar: React.FC<Props> = ({
  setActivePage,
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    { to: "/admin/accounts", icon: <Users className="w-5 h-5" />, label: "Quản lý tài khoản" },
    { to: "/admin/posts", icon: <FileText className="w-5 h-5" />, label: "Quản lý công thức" },
    { to: "/admin/tips", icon: <Lightbulb className="w-5 h-5" />, label: "Quản lý mẹo vặt" },
    { to: "/admin/stores", icon: <Store className="w-5 h-5" />, label: "Quản lý cửa hàng" },
  ];

  const handlePageChange = (label: string) => {
    setActivePage(label);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile open button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-md text-white"
        onClick={() => setIsOpenMobile(!isOpenMobile)}
      >
        <Menu className="w-6 h-6" />
      </button>


        <aside
          className={`
            fixed md:relative top-0 left-0 h-full border-r-2 border-gray-200 shadow-sm z-40
            transition-all duration-300 bg-white
            ${isCollapsed ? "w-16" : "w-64"}
            ${isOpenMobile ? "block" : "hidden"} md:block
          `}
        >
        <div className="hidden md:block absolute top-1/2 right-[-12px] transform -translate-y-1/2 z-50">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full shadow"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="mt-16 px-2">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => handlePageChange(item.label)}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } space-x-2 py-2 px-4 rounded-lg w-full text-left transition ${
                    isActive
                      ? "bg-blue-700 font-bold text-white"
                      : "hover:bg-blue-300 hover:text-black"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpenMobile(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
