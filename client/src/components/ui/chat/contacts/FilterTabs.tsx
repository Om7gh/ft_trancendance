import React from "react";

type TabName = string;
type OnNav = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => void;

interface TabProps{
  tabName: TabName,
  selected: boolean,
  onNav: OnNav
}

interface FilterTabProps{
  selectedTab: TabName,
  onNav: OnNav
}

function TabBar({tabName, selected, onNav}: TabProps){

  if (selected)
    return (
      <button
        className="flex-1 p-0.5 font-bold border rounded-xl border-violet-500 bg-violet-500/20"
        onClick={ (e) => onNav(e, tabName)  }>
          {tabName}
      </button>
    );
  return (
    <button
      className="flex-1"
      onClick={ (e) => { onNav(e, tabName) } }>
        {tabName}
    </button>
  );
}

function FilterTabs({selectedTab, onNav}: FilterTabProps){

  return (
    <div id="FilterTabs" className="text-white flex flex-wrap gap-2 mt-5">
      <TabBar tabName={"Chats"} selected={selectedTab === "Chats"} onNav={onNav}/>
      <TabBar tabName={"Unread"} selected={selectedTab === "Unread"} onNav={onNav}/>
      <TabBar tabName={"Contacts"} selected={selectedTab === "Contacts"} onNav={onNav}/>
    </div>
  );
}

export default FilterTabs;