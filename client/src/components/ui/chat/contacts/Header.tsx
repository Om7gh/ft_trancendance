type OnSearch = (e: React.ChangeEvent<HTMLInputElement>) => void;

interface HeaderProps{
  onSearch: OnSearch,
  children: React.ReactNode
}


function SearchBar({onSearch}: {onSearch: OnSearch}){

  return (
    <div id="SearchBar" className="relative mt-5">
      <label htmlFor="search" className="opacity-0 absolute">search for a user</label>
      <input className="peer basis-lg text-white w-full focus:outline-neon placeholder:text-white
          placeholder:opacity-50 min-w-[100px]
          p-1.5 pl-3 border-3 rounded-xl border-violet-500"
        id="search"
        type="search"
        placeholder="Search for a user"
        onChange={(e) => {onSearch(e)}}
        />
      <span className="inline-block absolute top-[20%] right-[3%] opacity-50
        peer-placeholder-shown:after:content-[url(public/assets/search/search-icon.svg)]">
      </span>
    </div>
  );
}

function Header({onSearch, children}: HeaderProps){
  return (
    <div id="Header" className="basis-[10%]">
      <h1 className="text-gray-300 text-[clamp(12px,1.5vw,25px)] font-bold">Messages</h1>
      <SearchBar onSearch={onSearch}/>
      {children}
    </div>
  );
}


export default Header;