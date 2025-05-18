import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  onSearch: (value: string) => void;
  isPopupOpen: boolean;
  value: string; 
}


export default function SearchBox({ onSearch, isPopupOpen, value }: SearchBoxProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative min-w-36">
      <input
        type="text"
        placeholder="Tìm kiếm ..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => !isPopupOpen && setFocused(true)}
        onBlur={() => !value && setFocused(false)}
        disabled={isPopupOpen}
        className="text-black w-full pl-10 pr-4 border-2 border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {focused || value ? (
          <X className="w-5 h-5 cursor-pointer" onClick={() => onSearch("")} />
        ) : (
          <Search className="w-5 h-5 text-black" />
        )}
      </div>
    </div>
  );
}

