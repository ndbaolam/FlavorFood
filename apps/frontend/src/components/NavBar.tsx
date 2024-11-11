/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Search } from './Search';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const menuItems = [
    { href: '', label: 'Trang chủ' },
    { href: 'meals', label: 'Bữa ăn' },
    { href: 'tips', label: 'Mẹo nhà bếp' },
    { href: 'market', label: 'Chợ' },
  ];

  const accountItems = [
    { href: 'profile', label: 'Hồ sơ' },
    { href: 'signout', label: 'Đăng xuất' },
  ];

  return (
    <nav
      className="relative bg-base-200 shadow-lg" >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <img src="./logo.jpg" alt="Logo" className="h-10 w-10 mr-2" />
            <a href="#" className="font-lobster text-2xl">
              FlavorFood
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Search />
            {menuItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-300"
              >
                {label}
              </a>
            ))}

            {/* Account Section */}
            <div className="relative">
              <button
                onClick={toggleAccountMenu}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-300"
              >
                <User className="w-5 h-5 mr-2" />
                Tài khoản
              </button>
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-200 rounded-md shadow-lg py-1 z-50">
                  {accountItems.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-300"
                    >
                      {label}
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {label}
              </a>
            ))}

            {/* Mobile Account Section */}
            <div className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <User className="w-5 h-5 mr-2" />
              Tài khoản
            </div>
            <div className="pl-4 space-y-1">
              {accountItems.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
