import useGetUsers from '@/services/user/useGetUsers';
import { useState, useRef, useEffect } from 'react';
import { IoSearchSharp, IoCloseSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  uid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  bio: string | null;
}

export default function SearchBar() {
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data, isPending, isError, error } = useGetUsers(debouncedQuery);
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<number | null>(null);

  const handleClick = () => {
    setActiveSearch((active) => !active);
  };

  const handleClose = () => {
    setSearchQuery('');
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
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    if (!searchQuery) {
      setDebouncedQuery('');
      return;
    }

    debounceTimer.current = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [searchQuery]);

  const handleUserClick = (username: string) => {
    navigate(`/dashboard/profile/${username}`);
    handleClose();
  };

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
                {isPending && (
                  <div className="flex items-center justify-center py-6 text-sm text-slate-300">
                    Loading...
                  </div>
                )}

                {!isPending && isError && (
                  <div className="py-4 text-center text-sm text-rose-400">
                    {error?.message || 'Error loading results'}
                  </div>
                )}

                {!isPending && !isError && (!data?.users || data.users.length === 0) && (
                  <div className="py-4 text-center text-sm text-slate-400">
                    No results for{' '}
                    <span className="font-semibold text-white">
                      {searchQuery}
                    </span>
                  </div>
                )}

                {!isPending && !isError && data?.users && data.users.length > 0 && (
                  <ul className="space-y-2">
                    {data.users.map((user: User) => (
                      <li
                        key={user.id}
                        onClick={() => handleUserClick(user.username)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-800/30 cursor-pointer transition-colors"
                      >
                        <img
                          src={user.avatar || '/assets/default-avatar.png'}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover border-2 border-violet-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            @{user.username}
                          </p>
                        </div>
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