import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

export default function SearchBox({ onSearch, isPopupOpen }: SearchBoxProps & { isPopupOpen: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value); 
  };

  return (
    <div className="relative min-w-36">
    <input
      type="text"
      placeholder="Tìm kiếm ..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      onFocus={() => !isPopupOpen && setFocused(true)}
      onBlur={() => !query && setFocused(false)}
      disabled={isPopupOpen} 
      className={`text-black w-full p-2 pl-10 pr-4 rounded-full outline-none border-2 focus:ring-2 focus:ring-blue-400 ${isPopupOpen ? "opacity-50 cursor-not-allowed" : ""}`}
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      {focused || query ? (
        <X className="w-5 h-5 cursor-pointer" onClick={() => handleSearch("")} />
      ) : (
        <Search className="w-5 h-5 text-black" />
      )}
    </div>
  </div>
  );
}
