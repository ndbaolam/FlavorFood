import React, { useState, useRef, useEffect, useCallback, ReactNode } from "react";
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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userRole, setUserRole] = useState(null as string | null);
  const [isStoreExpired, setIsStoreExpired] = useState(false);
  const [isExpiredTooltipOpen, setIsExpiredTooltipOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
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
      const { avatar, role, expired_at } = response.data;

      setAvatarUrl(avatar || "../../avatar.jpg");
      setUserRole(role || null);

      if (role === "seller" && expired_at) {
        const expiredDate = new Date(expired_at);
        const now = new Date();
        setIsStoreExpired(expiredDate < now);
      } else {
        setIsStoreExpired(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAvatarUrl(null);
      setUserRole(null);
      setIsStoreExpired(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const handleUserLoggedIn = () => fetchUserProfile();
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

      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsExpiredTooltipOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  type MenuItem = {
    to: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  };

  const baseMenuItems: MenuItem[] = [
    { to: "/", label: "Trang chủ", icon: <Home className="w-5 h-5 mr-2" /> },
    { to: "/dish", label: "Món ăn", icon: <ChefHat className="w-5 h-5 mr-2" /> },
    { to: "/tips", label: "Mẹo vào bếp", icon: <Lightbulb className="w-5 h-5 mr-2" /> },
    { to: "/market", label: "Cửa hàng", icon: <ShoppingBasket className="w-5 h-5 mr-2" /> },
  ];

  const menuItems: MenuItem[] =
    userRole === "seller"
      ? [
        ...baseMenuItems,
        {
          to: "/my-store",
          label: "Cửa hàng của tôi",
          icon: <Store className="w-5 h-5 mr-2" />,
          disabled: isStoreExpired,
        },
      ]
      : baseMenuItems;

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
      icon: <LogOut className="w-5 h-5 mr-2 text-black" />,
      onClick: handleLogout,
    },
  ];

  const isActiveMenu = (to: string): boolean => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center" onClick={() => handlePageChange("Trang chủ")}>
            <img src="../logo.png" alt="Logo" className="h-14" />
          </Link>

          <div className="hidden md:flex items-center space-x-4 ml-auto mr-4">
            {menuItems.map(({ to, label, icon, disabled }) => (
              <div key={to} className="relative">
                {disabled ? (
                  <div className="flex items-center px-3 py-2 rounded-md text-gray-400 cursor-not-allowed">
                    {icon}
                    {label}
                    <span
                      onClick={() => setIsExpiredTooltipOpen(!isExpiredTooltipOpen)}
                      className="ml-2 text-sm text-red-500 cursor-pointer hover:underline"
                    >
                      (Đã hết hạn)
                    </span>

                    {isExpiredTooltipOpen && (
                      <div
                        ref={tooltipRef}
                        className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg p-4 rounded-md text-black z-50"
                      >
                        <p className="text-red-600 font-semibold mb-2">
                          Tài khoản cửa hàng đã hết hạn.
                        </p>
                        <Link
                          to="/store-registration"
                          onClick={() => setIsExpiredTooltipOpen(false)}
                          className="block text-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Gia hạn gói
                        </Link>

                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={to}
                    onClick={() => handlePageChange(label)}
                    className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${isActiveMenu(to)
                      ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                      : "text-black hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 hover:text-white"
                      }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4" ref={accountRef}>
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
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "../../public/avatar.jpg";
                    }}
                  />
                </button>
                {isAccountOpen && (
                  <div className="absolute right-4 top-20 w-48 bg-white rounded-lg shadow-lg z-50 text-black">
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
                        className="flex items-center px-4 py-2 hover:bg-blue-100"
                      >
                        {icon}
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/sign-in"
                className="px-4 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md font-medium transition"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-black hover:text-blue-900 hover:bg-blue-100"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 space-y-2 bg-white border-t text-black">
          {menuItems.map(({ to, label, icon, disabled }) => (
            <div key={to}>
              {disabled ? (
                <>
                  <div className="flex items-center px-3 py-2 rounded-md text-gray-400 cursor-not-allowed">
                    {icon}
                    {label}
                    <span
                      onClick={() => setIsExpiredTooltipOpen(!isExpiredTooltipOpen)}
                      className="ml-2 text-sm text-red-500 cursor-pointer hover:underline"
                    >
                      (Đã hết hạn)
                    </span>
                  </div>
                  {isExpiredTooltipOpen && (
                    <div className="ml-6 mt-1 text-sm text-red-600">
                      Tài khoản cửa hàng đã hết hạn.
                      <Link
                        to="/store-registration"
                        className="block mt-1 text-blue-600 underline"
                        onClick={() => {
                          setIsExpiredTooltipOpen(false);
                          closeMenus();
                        }}
                      >
                        Gia hạn gói
                      </Link>

                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={to}
                  onClick={() => handlePageChange(label)}
                  className={`flex items-center px-3 py-2 rounded-md font-medium transition-colors ${isActiveMenu(to)
                    ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white"
                    : "text-black hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 hover:text-white"
                    }`}
                >
                  {icon}
                  {label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-gray-300 pt-2">
            <p className="text-black mb-2 font-medium">Tài khoản</p>
            {avatarUrl ? (
              accountItems.map(({ href, label, icon, onClick }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    if (onClick) {
                      e.preventDefault();
                      closeMenus();
                      onClick();
                    }
                  }}
                  className="flex items-center px-4 py-2 text-black hover:bg-blue-100"
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
