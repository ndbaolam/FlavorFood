import React, { useState } from 'react';
import { Home, Info, Settings, Mail, BookOpen, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: '#home', icon: Home, label: 'Home' },
    { href: '#about', icon: Info, label: 'About' },
    { href: '#services', icon: Settings, label: 'Services' },
    { href: '#contact', icon: Mail, label: 'Contact' },
  ];

  const dropdownItems = [
    { href: '#blog', icon: BookOpen, label: 'Blog' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className="relative bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold">MyWebsite</a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {menuItems.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </a>
            ))}

            {/* Desktop Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                More
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                {dropdownItems.map(({ href, icon: Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </a>
            ))}
            {dropdownItems.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;