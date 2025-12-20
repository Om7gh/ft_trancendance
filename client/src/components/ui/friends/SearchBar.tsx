import { useState, useRef, useEffect } from 'react';
import { IoSearchSharp, IoCloseSharp } from 'react-icons/io5';

interface UserItem {
  id: string;
  name: string;
  avatar?: string;
  subtitle?: string;
}

export default function SearchBar() {
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchAbort = useRef<AbortController | null>(null);
  const debounceTimer = useRef<number | null>(null);

  const handleClick = () => {
    setActiveSearch((active) => !active);
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    setActiveSearch(false);
    setError(null);
    if (fetchAbort.current) fetchAbort.current.abort();
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
        if (searchQuery === '') {
          setActiveSearch(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery]);

  useEffect(() => {
    setError(null);
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [searchQuery]);

  return (
    <div
      ref={searchRef}
      className={`relative flex items-center transition-all duration-300 ${
        activeSearch ? 'w-full' : 'w-auto'
      }`}
    >
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
            className="w-full pl-10 pr-8 py-2 bg-slate-700/50 border-b-2 border-violet-400 text-slate-100 focus:ring-0 focus:border-violet-500 focus:shadow-lg transition-all outline-none appearance-none rounded-full"
          />
          <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
          {searchQuery && (
            <button
              onClick={handleClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <IoCloseSharp />
            </button>
          )}

          {searchQuery && (
            <div className="absolute left-0 right-0 mt-2 z-5000">
              <div className="max-h-60 overflow-auto bg-violet-950/30 border border-violet-700/30  backdrop-blur-xl shadow-xl shadow-slate-900 p-2">
                {loading && (
                  <div className="flex items-center justify-center py-6 text-sm text-slate-300">
                    Loading...
                  </div>
                )}

                {!loading && error && (
                  <div className="py-4 text-center text-sm text-rose-400">
                    {error}
                  </div>
                )}

                {!loading && !error && results.length === 0 && (
                  <div className="py-4 text-center text-sm text-slate-400">
                    No results for{' '}
                    <span className="font-semibold text-white">
                      {searchQuery}
                    </span>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <ul className="space-y-2">
                    {results.map((u) => (
                      <li key={u.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery(u.name);
                            setResults([]);
                            setActiveSearch(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2  hover:bg-slate-800/50 transition-colors"
                        >
                          <img
                            src={u.avatar ?? '/default-avatar.png'}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div className="text-left">
                            <div className="text-sm text-slate-100 font-medium">
                              {u.name}
                            </div>
                            {u.subtitle && (
                              <div className="text-xs text-slate-400">
                                {u.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="p-2 rounded-full hover:bg-slate-700/50 transition-colors text-white"
          aria-label="Search"
        >
          <IoSearchSharp className="text-2xl" />
        </button>
      )}
    </div>
  );
}
