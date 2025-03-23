/* eslint-disable */
import React, { useState } from "react";
import { Menu, X, User, LogOut, Home, ChefHat, Lightbulb, ShoppingBasket } from "lucide-react";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccountMenu = () => setIsAccountOpen(!isAccountOpen);

  const menuItems = [
    { href: "#", label: "Trang chủ", icon: <Home className="w-7 h-7 mr-2" /> },
    { href: "dish", label: "Món ăn", icon: <ChefHat className="w-7 h-7 mr-2" /> },
    { href: "tips", label: "Mẹo vào bếp", icon: <Lightbulb className="w-7 h-7 mr-2" /> },
    { href: "market", label: "Cửa hàng", icon: <ShoppingBasket className="w-7 h-7 mr-2" /> },
  ];

  const accountItems = [
    {
      href: "profile",
      label: "Thông tin tài khoản",
      icon: <User className="w-7 h-7 mr-2" />,
    },
    {
      href: "signout",
      label: "Đăng xuất",
      icon: <LogOut className="w-7 h-7 mr-2 text-black-600" />,
    },
  ];

  return (
    <nav className="relative bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
       
          <div className="flex items-center space-x-6">

            <a href="/" className="flex items-center">
              <img src="./logo1.png" alt="Logo" className="h-16" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center space-x-4">
              {menuItems.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center px-3 py-2 rounded-md text-gray-800 hover:text-blue-900 hover:bg-blue-100 transition duration-200"
                >
                  {icon} {label}
                </a>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleAccountMenu}
                aria-expanded={isAccountOpen}
                className="flex items-center px-3 py-2 rounded-md text-gray-800  hover:text-blue-900 hover:bg-blue-100"
              >
                <User className="w-5 h-5 mr-2" />
                Tài khoản
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {accountItems.map(({ href, label, icon }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      {icon} {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              className="p-2 rounded-md text-gray-700 hover:text-blue-900 hover:bg-blue-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {menuItems.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100"
            >
              {icon} {label}
            </a>
          ))}

          {/* Mobile Account Section */}
          <div className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100">
            <User className="w-5 h-5 mr-2" />
            Tài khoản
          </div>
          <div className="pl-4 space-y-1">
            {accountItems.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100"
              >
                {icon} {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
