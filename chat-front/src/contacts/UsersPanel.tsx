import Header from "./Header.tsx";
import FilterTabs from "./FilterTabs.tsx";
import CardsList from "./CardsList.tsx";
import StatusResolver from "./JsxByStatus.tsx";
import Card from "../types/UserCard.ts";

interface UsersPanelProps{
  selectedCard: Card | null,
  visibleCards: Card[],
  updateVisibleCards: React.Dispatch<React.SetStateAction<number>>,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  selectedTab: React.RefObject<string>,
  onCardSelect: (selectedCard: Card) => void,
  getCardStatus: (tabName: string) => string
}

function UsersPanel({ selectedCard, onCardSelect, visibleCards, updateVisibleCards, setSearchQuery, selectedTab, getCardStatus}: UsersPanelProps){

  function handelTabNavigation(e: React.MouseEvent<HTMLButtonElement>, tabName: string){
    e.stopPropagation();
    selectedTab.current = tabName;
    updateVisibleCards(prev => ++prev);
    setSearchQuery("");
  }
  
  function handleUserSearch(e: React.ChangeEvent<HTMLInputElement>){
    setSearchQuery(e.target.value);
  }

  return (
    <div id="UsersPanel" className="flex-1 h-full flex flex-col">
      <Header key={selectedTab.current} onSearch={handleUserSearch}>
        <FilterTabs selectedTab={selectedTab.current} onNav={handelTabNavigation}/>
      </Header>
      <StatusResolver status={getCardStatus(selectedTab.current)} content={visibleCards} view={selectedTab.current} onAction={handelTabNavigation}>
        <CardsList cards={visibleCards} selectedCard={selectedCard} onSelect={onCardSelect}/>
      </StatusResolver>
    </div>
  );
}

export default UsersPanel;