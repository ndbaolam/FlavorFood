import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const AdminHeader = () => {
  const location = useLocation();

  const pageTitles: { [key: string]: string } = {
    "/admin/accounts": "Quản lý tài khoản",
    "/admin/posts": "Quản lý bài viết",
    "/admin/tips": "Quản lý Tips",
    "/admin/settings": "Cài đặt",
  };

  const matchedPath = Object.keys(pageTitles).find((path) =>
    location.pathname.startsWith(path)
  );

  const activeTitle = pageTitles[matchedPath || ""] || "";

  return (
    <header className="bg-gray-50 shadow p-4 flex justify-between items-center">
      <h2 className="ml-4 text-3xl font-bold">{activeTitle}</h2>
      <div className="flex items-center space-x-4">
        <button>
          <Bell />
        </button>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
};

export default AdminHeader;
