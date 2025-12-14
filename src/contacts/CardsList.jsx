
function Avatar({imgUrl, name, type}){

  let avatarStyle = {
    "CardItem": "rounded-xl",
    "contact": "rounded-[50%]",
    "sender": "rounded-[50%] border-2 border-[#F97316] h-[40px] self-end",
    "receiver": "rounded-[50%] border-2 border-[#0D9488] h-[40px] self-end"
  }
  
  return (
    <div className={"max-w-[18%] overflow-clip " + avatarStyle[type]}>
      <img src={imgUrl}
        alt={name + "'s profile"}
        className="h-full w-full object-cover"/>
    </div>
  );
}

function UserInfo({name, wins, userWins, unread_msg}){
  return (
    <div className="flex-1 self-center relative text-white ">
      <h1 className="font-bold relative text-md">{name}
      </h1>
        {
          unread_msg > 0 &&
          <div className="min-w-4 absolute text-center top-0 left-[94%] ml-auto text-[0.6em]
                overflow-clip rounded-[30px] bg-[#F97316]">
            {unread_msg}
          </div >
        }
      {/* <p className="mt-[5px] font-normal">You {wins} - {userWins} Opponent</p> */}
      <p className="mt-[5px] font-normal">Placeholder</p>
    </div>
  );
}

function CardItem({card, cardSelected, onSelect}){

  let friend = card.friend;
  let listStyle = (!cardSelected) ? "flex gap-2 mt-3 w-full h-[8%]" :
    "flex gap-2 mt-3 w-full h-[8%] bg-[#0D9488]/30 rounded-xl \
    shadow-2xl border-l-[3px] p-[3px] border-l-[#0D9488]";
  return (
    <li className={listStyle} onClick={() => onSelect(card)}>
      <Avatar imgUrl={friend.photo_url} name={friend.name} type="CardItem"/>
      <UserInfo name={friend.name} wins={friend.your_wins}
        userWins={friend.friend_wins} unread_msg={card.unread_msg}/>
    </li>
  );
}

function CardsList({cards, selectedCard, onCardSelect}){

  return  (
    <ul id="CardsList" className="h-[87%] scrollbar overflow-auto">
      {
          cards.map(card => <CardItem
            key={card.friend.id}
            card={card}
            cardSelected={card.friend.id === selectedCard.friend?.id}
            onSelect={onCardSelect}
            unreadCount={card.unread_msg}
          />)
      }
    </ul>
  );
}

export {Avatar};

export default CardsList;
