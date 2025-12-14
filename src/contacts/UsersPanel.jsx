import Header from "./Header.jsx";
import FilterTabs from "./FilterTabs.jsx";
import CardsList from "./CardsList.jsx";
import {useEffect, useRef} from 'react'
import {cardsFilterByTab, cardsFilterByQuery} from '../utils/filter.jsx';

function UsersPanel({selectedCard, onCardSelect, shownCards, setShownCards, refreshCards, socket}){

  let selectedTab = useRef("Chats");

  useEffect(() => {
    cardsFilterByTab(shownCards, selectedTab.current)
    .then((cards) => {
      socket?.send(JSON.stringify({
        action: "watch-users",
        users: cards.map((card) => card.friend.id)
      }));
      setShownCards(cards)
    })
    .catch((err) => console.log(`error is thrown: ${err}`));
  }, [refreshCards]);
  
  
  function handelTabNavigation(e, tabName){
    e.stopPropagation();
    cardsFilterByTab(shownCards, tabName)
    .then((cards) => {
      socket?.send(JSON.stringify({
        action: "watch-users",
        users: cards.map((card) => card.friend.id)
      }));
      setShownCards(cards)
    })
    .catch((err) => console.log(`error is thrown: ${err}`));

    selectedTab.current = tabName;
  }

  function handleUserSearch(e){
    cardsFilterByTab(shownCards, selectedTab.current)
    .then((cards) => {
      let result = cardsFilterByQuery(e.target.value, cards);
      setShownCards(result);
    });
  }

  return (
    <div id="UsersPanel" className="flex-1 h-full flex flex-col">
      <Header key={selectedTab.current} onSearch={handleUserSearch}>
        <FilterTabs selectedTab={selectedTab.current} onNav={handelTabNavigation}/>
      </Header>
      <CardsList cards={shownCards} selectedCard={selectedCard} onCardSelect={onCardSelect}/>
    </div>
  );
}


export default UsersPanel;