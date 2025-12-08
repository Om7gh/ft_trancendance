
function Avatar({imgUrl, name, type}){

  let avatarStyle = {
    "userItem": "rounded-xl",
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
          (unread_msg > 0) &&
          <div className="min-w-4 absolute text-center top-0 left-[94%] ml-auto text-[0.6em]
                overflow-clip rounded-[30px] bg-[#F97316]">
            {unread_msg}
          </div >
        }
      <p className="mt-[5px] font-normal">You {wins} - {userWins} Opponent</p>
    </div>
  );
}

function UserItem({user, selected, onSelect}){

  let listStyle = (!selected) ? "flex gap-2 mt-3 w-full h-[8%]" :
    "flex gap-2 mt-3 w-full h-[8%] bg-[#0D9488]/30 rounded-xl \
    shadow-2xl border-l-[3px] p-[3px] border-l-[#0D9488]";
  return (
    <li className={listStyle} onClick={() => onSelect(user)}>
      <Avatar imgUrl={user.photo_url} name={user.name} type="userItem"/>
      <UserInfo name={user.name} wins={user.your_wins}
        userWins={user.friend_wins} unread_msg={(selected) ? 0 : user.unread_msg}/>
    </li>
  );
}

function UsersList({users, friendSelected, onSelect}){

  return  (
    <ul id="UsersList" className="h-[87%] scrollbar overflow-auto">
      {
        (users !== null) && users.map(user => <UserItem
            key={user.id}
            user={user}
            selected={friendSelected !== null && user.id === friendSelected.id}
            onSelect={onSelect}
          />)
      }
    </ul>
  );
}

export {Avatar};

export default UsersList;