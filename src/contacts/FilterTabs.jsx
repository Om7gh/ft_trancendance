
function FilterTab({tabName, selected, onNav}){

  if (selected)
    return (
      <button
        className="flex-1 font-bold border rounded-xl border-[#0D9488] bg-[#0D9488]/20"
        onClick={ (e) => { onNav(e, tabName) } }>
          {tabName}
      </button>
    );
  return (
    <button
      className="flex-1 font-normal"
      onClick={ (e) => { onNav(e, tabName) } }>
        {tabName}
    </button>
  );
}

function FilterTabs({selectedTab, onNav}){

  return (
    <div id="FilterTabs" className="text-white flex gap-3 p-[5px] mt-5">
      <FilterTab tabName={"Chats"} selected={selectedTab === "Chats"} onNav={onNav}/>
      <FilterTab tabName={"Unread"} selected={selectedTab === "Unread"} onNav={onNav}/>
      <FilterTab tabName={"Contacts"} selected={selectedTab === "Contacts"} onNav={onNav}/>
    </div>
  );
}

export default FilterTabs;