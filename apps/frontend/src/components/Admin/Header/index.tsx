import {  useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { User } from "../../../pages/Profile/Profile.interface";

const AdminHeader = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleAccountMenu = () => {
    setIsAccountOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get<User>("/auth/profile");
        setAvatarUrl(response.data.avatar || "../../avatar.jpg");
        setUserName(`${response.data.first_name} ${response.data.last_name}`);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", { withCredentials: true });
      setAvatarUrl(null);
      navigate("/admin/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  const accountItems = [
    {
      label: "Đăng xuất",
      icon: <LogOut className="w-5 h-5 mr-2" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white border-2 border-gray-200 shadow-sm flex justify-between items-center z-50">
      <div className="flex items-center space-x-3 ml-8">
        <img src="/logo.png" alt="Logo" className="h-14" />
      </div>

      <div className="flex items-center space-x-6 relative" ref={menuRef}>

        <div className="flex items-center space-x-2 mr-4" onClick={toggleAccountMenu}>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={avatarUrl || "../../avatar.jpg"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className=" font-medium">{userName}</span>
        </div>
        {isAccountOpen && (
          <div className="absolute right-4 top-full mt-3 w-40 bg-white border rounded shadow-md z-10">
            {accountItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center px-4 py-2 hover:bg-blue-100 text-base text-left mr-20"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
