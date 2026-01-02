import Avatar from "./Avatar.tsx";
import type {Card} from "@/types/UserCard.ts"

type OnSelect = (selectedCard: Card) => void;
interface CardItemProps{
	card: Card;
	isSelected: boolean;
	onSelect: OnSelect;
}

interface CardsListProps {
	cards: Card[];
	selectedCard: Card | null;
	onSelect: OnSelect;
}

interface UserInfoProps{
	name: string;
	unread_msg: number;
	lastMsg: string;
}

function UserInfo({name, unread_msg, lastMsg}: UserInfoProps){

	let displayedLastMsg = (lastMsg.length === 0)
		? "Empty"
		: lastMsg.slice(0, 10);
	(lastMsg.length > 10) ? displayedLastMsg += "..." : displayedLastMsg;

	return (
		<div className="flex-1 self-center relative text-white ">
			<h1 className="font-bold relative text-md">{name}
			</h1>
				{
					unread_msg > 0 &&
					<div className="min-w-4 absolute text-center top-0 left-[94%] ml-auto text-[0.6em]
								overflow-clip rounded-[30px] bg-violet-600">
						{unread_msg}
					</div >
				}
			<p className="mt-1.25 font-normal text-gray-300 text-[10px]">
				{displayedLastMsg}
			</p>
		</div>
	);
}

function CardItem({card, isSelected, onSelect}: CardItemProps){

	const friend = card.friend;
	let listStyle = "flex gap-4 bg-blue-100/0 mt-3 p-2 max-w-[100%] h-20"
	if (isSelected){
		listStyle += " bg-violet-500/20 rounded-xl  \
		shadow-2xl border-l-[3px]  border-l-violet-500";
	}
	return (
		<li className={listStyle} onClick={() => onSelect(card)}>
			<Avatar imgUrl={friend.photo_url}
				name={friend.name}
				type="CardItem"
			/>
			<UserInfo name={friend.name}
				unread_msg={card.unread_msg}
				lastMsg={card.lastMsg}
			/>
		</li>
	);
}

function CardsList({cards, selectedCard, onSelect}: CardsListProps){
	return  (
		<ul id="CardsList" className="h-[87%] mt-3 scrollbar overflow-auto">
			{
				cards.map(card => <CardItem
					key={card.friend.id}
					card={card}
					isSelected={card.friend.id === selectedCard?.friend?.id}
					onSelect={onSelect}
				/>)
			}
		</ul>
	);
}

export {Avatar};

export default CardsList;
