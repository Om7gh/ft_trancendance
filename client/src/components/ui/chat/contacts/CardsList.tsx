import type {Card} from "@/types/UserCard.ts"
import { useNavigate } from "react-router-dom";

type OnSelect = (selectedCard: Card) => void;

interface AvatarProps{
  imgUrl: string;
  name: string;
  type: "CardItem"
      | "contact"
      | "sender"
      | "receiver";
}

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


function Avatar({imgUrl, name, type}: AvatarProps){
  const navigate = useNavigate()

  const avatarStyle = {
    "CardItem": "rounded-[50%]",
    contact: "rounded-[50%] max-w-30 max-h-20",
    sender: "rounded-[50%] border-2 border-neon h-[40px] self-end",
    receiver: "rounded-[50%] border-2 border-violet-500 h-[40px] self-end"
  }
  
  return (
    <div className={"overflow-clip aspect-square " + avatarStyle[type]}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/dashboard/profile/${name}`);
      }}>
      <img src={imgUrl}
        alt={name + "'s profile"}
        className="h-full w-full object-cover"/>
    </div>
  );
}

function UserInfo({name, unread_msg}: {name: string, unread_msg: number}){
  return (
    <div className="flex-1 self-center relative text-white ">
      <h1 className="font-bold relative text-md">{name}
      </h1>
        {
          unread_msg > 0 &&
          <div className="min-w-4 absolute text-center top-0 left-[94%] ml-auto text-[0.6em]
                overflow-clip rounded-[30px] bg-neon">
            {unread_msg}
          </div >
        }
      <p className="mt-1.25 font-normal">Placeholder</p>
    </div>
  );
}

function CardItem({card, isSelected, onSelect}: CardItemProps){

  const friend = card.friend;
  let listStyle = "flex gap-4 bg-blue-100/0 mt-3 p-2 w-full h-20"
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
