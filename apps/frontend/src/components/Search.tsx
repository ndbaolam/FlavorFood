import React, { useState, useRef, useEffect } from "react";

export const Search: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={searchRef}
        className={`form-control transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100 visible w-24 md:w-auto"
            : "translate-x-full opacity-0 invisible"
        }`}
      >
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-full bg-gray-800 focus:outline-none transition-colors duration-300"
          aria-label="Search input"
        />
      </div>
      <span
        onClick={handleToggle}
        aria-label={isOpen ? "Close search" : "Open search"}
        className="cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
    </>
  );
};
export default Search;
