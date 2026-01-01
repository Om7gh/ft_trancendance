import {cardsFilterByQuery} from "./filter.ts";
import type {Card} from "@/types/UserCard.ts"

function visibleCardsResolver(conversationCards: Card[], contactCards: Card[], tabName: string, qurey: string){

	
	function cardsFilterByTab(): Card[]{
		switch (tabName){
			case "Contacts":
				return (contactCards);
			case "Unread":
				return conversationCards.filter(user => user.unread_msg > 0);
			default:
				return conversationCards
		}
	}

	let cards = cardsFilterByTab();
	if (qurey.length !== 0)
		cards = cardsFilterByQuery(qurey, cards);

	// console.log("=== Visible cards IN visibleCardsResolver After: ", cards);
	return (cards);
}

export default visibleCardsResolver;