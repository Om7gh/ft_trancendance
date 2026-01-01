import { useNavigate } from "react-router-dom";

interface AvatarProps{
  imgUrl: string;
  name: string;
  type: "CardItem"
      | "contact"
      | "sender"
      | "receiver";
}

function Avatar({imgUrl, name, type}: AvatarProps){
  const navigate = useNavigate()

  const avatarStyle = {
    CardItem: "rounded-[50%]",
    contact: "rounded-[50%] max-h-20 min-w-10",
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


export default Avatar;