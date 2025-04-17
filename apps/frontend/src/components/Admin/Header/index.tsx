import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { User } from "../../../pages/Profile/Profile.interface";

const AdminHeader = () => {
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const pageTitles: { [key: string]: string } = {
    "/admin/accounts": "Quản lý tài khoản",
    "/admin/posts": "Quản lý bài viết",
    "/admin/tips": "Quản lý Tips",
  };

  const matchedPath = Object.keys(pageTitles).find((path) =>
    location.pathname.startsWith(path)
  );
  const activeTitle = pageTitles[matchedPath || ""] || "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get<User>('/auth/profile');
        setAvatarUrl(response.data.avatar || null);
      } catch (error) {
        console.error("Error fetching user profile:", error);

      }
    };

    fetchUserProfile();
  }, []);
  return (
    <header className="bg-gray-50 shadow p-4 flex justify-between items-center">
      <h2 className="ml-4 text-3xl font-bold">{activeTitle}</h2>
      <div className="flex items-center space-x-4">
        <button>
          <Bell />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="../../logo1.png"
              alt="Default Logo"
              className="w-full h-full object-cover"
            />
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
