import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBox( ) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => !query && setFocused(false)}
        className="w-full p-2 pl-10 pr-4 border rounded-full outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {focused || query ? <X className="w-5 h-5 cursor-pointer" onClick={() => { setQuery(""); setFocused(false); }} /> : <Search className="w-5 h-5" />}
      </div>
    </div>
  );
}
