import { useState, useRef, useEffect } from "react";
import { IoSearchSharp, IoCloseSharp } from "react-icons/io5";

export default function SearchBar() {
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setActiveSearch((active) => !active);
  };

  const handleClose = () => {
    setSearchQuery("");
    setActiveSearch(false);
  };

  useEffect(() => {
    if (activeSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        if (searchQuery === "") {
          setActiveSearch(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchQuery]);

  console.log(searchQuery);

  return (
    <div
      ref={searchRef}
      className={`relative flex items-center transition-all duration-300 ${
        activeSearch ? "w-full" : "w-auto"
      }`}>
      {activeSearch ? (
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for friend..."
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-gray-700/50 border-b-2 border-teal-400 text-slate-100 focus:ring-0 focus:border-teal-500 focus:shadow-lg transition-all outline-none appearance-none rounded-full"
          />
          <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400" />
          {searchQuery && (
            <button
              onClick={handleClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <IoCloseSharp />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-white"
          aria-label="Search">
          <IoSearchSharp className="text-2xl" />
        </button>
      )}
    </div>
  );
}
