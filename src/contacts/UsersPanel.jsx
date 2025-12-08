import Header from "./Header.jsx";
import FilterTabs from "./FilterTabs.jsx";
import UsersList from "./UsersList.jsx";
import {useEffect, useRef} from 'react'
import {friendsFilterByTab, friendsFilterByQuery} from '../utils/friendsFilter.jsx';


function UsersPanel({friendSelected, onSelect, users, setUsers}){

  let selectedTab = useRef("Chats");

  useEffect(() => {
    // comunication with the server happend here by friendsFilterByTab
    setUsers(friendsFilterByTab(selectedTab.current));
  }, []);


  function handelTabNavigation(e, tabName){
    e.stopPropagation();
    let result = friendsFilterByTab(tabName);
    setUsers(result);
    selectedTab.current = tabName;
  }

  function handleUserSearch(e){
    let result = friendsFilterByTab(selectedTab.current);
    result = friendsFilterByQuery(e.target.value, result)
    setUsers(result);
  }

  return (
    <div id="UsersPanel" className="flex-1 h-full flex flex-col">
      <Header key={selectedTab.current} onSearch={handleUserSearch}>
        <FilterTabs selectedTab={selectedTab.current} onNav={handelTabNavigation}/>
      </Header>
      <UsersList onSelect={onSelect} users={users} friendSelected={friendSelected}/>
    </div>
  );
}


export default UsersPanel;