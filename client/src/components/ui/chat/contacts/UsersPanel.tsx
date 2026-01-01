import Header from "./Header.tsx";
import FilterTabs from "./FilterTabs.tsx";
import CardsList from "./CardsList.tsx";
import StatusResolver from "@/utils/JsxByStatus.tsx";
import type {Card} from "@/types/UserCard.ts";

interface UsersPanelProps{
	selectedCard: Card | null;
	visibleCards: Card[];
	setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
	selectedTab: string;
	updateTabName:  React.Dispatch<React.SetStateAction<string>>;
	onCardSelect: (selectedCard: Card) => void;
	getCardStatus: (tabName: string) => string
}

function UsersPanel(
	{
		selectedCard,
		onCardSelect,
		visibleCards,
		setSearchQuery,
		selectedTab,
		updateTabName,
		getCardStatus
	}: UsersPanelProps){

	function handelTabNavigation(e: React.MouseEvent<HTMLButtonElement>, tabName: string){
		e.stopPropagation();
		updateTabName(tabName);
		setSearchQuery("");
	}
	
	function handleUserSearch(e: React.ChangeEvent<HTMLInputElement>){
		setSearchQuery(e.target.value);
	}

	return (
		<div id="UsersPanel" className="flex-1 h-full flex flex-col">
			<Header key={selectedTab} onSearch={handleUserSearch}>
				<FilterTabs selectedTab={selectedTab} onNav={handelTabNavigation}/>
			</Header>
			<StatusResolver status={getCardStatus(selectedTab)}
				content={visibleCards}
				view={selectedTab}
				onAction={handelTabNavigation}>
					<CardsList
						cards={visibleCards}
						selectedCard={selectedCard}
						onSelect={onCardSelect}/>
			</StatusResolver>
		</div>
	);
}

export default UsersPanel;