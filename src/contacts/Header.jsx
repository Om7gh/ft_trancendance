
function SearchBar({onSearch}){
  return (
    <div id="SearchBar" className="relative mt-[30px]">
      <label htmlFor="search" className="opacity-0 absolute">search for a user</label>
      <input className="peer basis-lg text-white w-full placeholder:text-white
          placeholder:opacity-50
          p-[5px] pl-3 border-3 rounded-xl border-[#0D9488]"
        id="search"
        type="search"
        placeholder="Search here"
        onChange={(e) => {onSearch(e)}}
        />
      <span className="inline-block absolute top-[20%] right-[3%] opacity-50
        peer-placeholder-shown:after:content-[url(assets/search-icon-white/basicSearch.svg)]">
      </span>
    </div>
  );
}

function Header({onSearch, children}){
  return (
    <div id="Header" className="basis-[10%]">
      <h1 className="text-white text-3xl font-bold">Messages</h1>
      <SearchBar onSearch={onSearch}/>
      {children}
    </div>
  );
}


export default Header;