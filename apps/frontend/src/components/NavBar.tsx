import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Users,
  LogOut,
  Home,
  ChefHat,
  Lightbulb,
  ShoppingBasket,
  Heart,
  Store,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { User } from "../pages/Profile/Profile.interface";

interface NavbarProps {
  setActivePage: (page: string) => void;
  onUserLoggedIn?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setActivePage, onUserLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccountMenu = () => setIsAccountOpen(!isAccountOpen);
  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  };

  const handlePageChange = (label: string) => {
    setActivePage(label);
    setIsMenuOpen(false);
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get<User>("/auth/profile");
      setAvatarUrl(response.data.avatar || "../../avatar.jpg");
      setUserRole(response.data.role || null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAvatarUrl(null);
      setUserRole(null);
    }
  }, []);
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleUserLoggedIn = () => {
      fetchUserProfile();
    };

    window.addEventListener("userLoggedIn", handleUserLoggedIn);
    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", { withCredentials: true });
      setAvatarUrl(null);
      navigate("/sign-in");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  const menuItems = [
    { to: "/", label: "Trang chủ", icon: <Home className="w-5 h-5 mr-2" /> },
    { to: "/dish", label: "Món ăn", icon: <ChefHat className="w-5 h-5 mr-2" /> },
    { to: "/tips", label: "Mẹo vào bếp", icon: <Lightbulb className="w-5 h-5 mr-2" /> },
    { to: "/market", label: "Cửa hàng", icon: <ShoppingBasket className="w-5 h-5 mr-2" /> },
  ];

  if (userRole === "seller") {
    menuItems.push({
      to: "/my-store",
      label: "Cửa hàng của tôi",
      icon: <Store className="w-5 h-5 mr-2" />,
    });
  }

  const accountItems = [
    {
      href: "/profile",
      label: "Thông tin tài khoản",
      icon: <Users className="w-5 h-5 mr-2 text-blue-500" />,
    },
    {
      href: "/favorite",
      label: "Yêu thích",
      icon: <Heart className="w-5 h-5 mr-2 text-red-500" />,
    },
    {
      label: "Đăng xuất",
      icon: <LogOut className="w-5 h-5 mr-2 text-gray-500" />,
      onClick: handleLogout,
    },
  ];

  const isActiveMenu = (to: string): boolean => {
    if (to === "/") return location.pathname === "/";
    if (to === "/dish") return location.pathname.startsWith("/dish");
    if (to === "/tips") return location.pathname.startsWith("/tips");
    if (to === "/market") return location.pathname.startsWith("/market");
    if (to === "/my-store") return location.pathname.startsWith("/my-store");
    return false;
  };


  return (
    <nav
      className="relative bg-white border-b border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => handlePageChange("Trang chủ")}
            >
              <img src="../logo.png" alt="Logo" className="h-14" />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4 ml-auto mr-4">
          {menuItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                  isActiveMenu(to)
                    ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 hover:text-white"
                }`}        
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop account */}
          <div
            className="hidden md:flex items-center space-x-4"
            ref={accountRef}
          >
            {avatarUrl ? (
              <>
                <button
                  onClick={toggleAccountMenu}
                  className="flex items-center w-10 h-10 rounded-full overflow-hidden border focus:outline-none"
                >
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-4 top-20 w-48 bg-white rounded-md shadow-lg z-50">
                    {accountItems.map(({ href, label, icon, onClick }) => (
                      <a
                        key={label}
                        href={href || "#"}
                        onClick={(e) => {
                          if (onClick) {
                            e.preventDefault();
                            closeMenus();
                            onClick();
                          }
                        }}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100"
                      >
                        {icon}
                        {label}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/sign-in"
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md font-medium transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-blue-100"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-2 bg-white border-t border-gray-200">
         {menuItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                  isActiveMenu(to)
                    ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 hover:text-white"
                }`}        
              >
                {icon}
                {label}
              </Link>
            ))}

          <div className="mt-4 border-t border-gray-200 pt-2">
            <p className="text-gray-500 mb-2 font-medium">Tài khoản</p>
            {avatarUrl ? (
              accountItems.map(({ href, label, icon, onClick }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      closeMenus();
                      onClick();
                    }
                  }}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100"
                >
                  {icon}
                  {label}
                </a>
              ))
            ) : (
              <Link
                to="/sign-in"
                className="text-blue-600 hover:underline font-medium"
                onClick={closeMenus}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
