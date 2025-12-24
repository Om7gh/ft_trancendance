import { useNavigate } from "react-router-dom"

interface SenderType {
  username: string,
  id: string,
  avatar: string
}

interface ReceiverType {
  id: string
}

interface NotificationType  {
  id: string,
  type: string,
  expireTime: number,
  sender: SenderType,
  receiver: ReceiverType
}

function Notify({data} : {data : NotificationType}) {
  if (data.type === "friend-request") {
    const url = `profile/${data.sender.username}`
    const navigate = useNavigate()
    return (
      <div className="flex items-center justify-between gap-4 text-violet-200 bg-slate-950/30 px-4 py-3 my-2 rounded-lg border border-violet-500/30 hover:border-violet-500/60 transition-all">
        <div className="flex items-center gap-3">
          <img 
            src={data.sender.avatar} 
            alt={data.sender.username}  
            className="w-12 h-12 border-2 border-violet-500 rounded-full object-cover" 
          />
          <div className="flex flex-col">
            <p className="font-semibold text-violet-300">{data.sender.username}</p>
            <p className="text-sm text-violet-400/70">sent you a friend request</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-violet-900/50 hover:bg-violet-900 rounded-md text-sm font-medium transition-colors" onClick={() => navigate(url)}>
            See Profile
          </button>
        </div>
      </div>
    );
  } else if (data.type === "friend-accept") {
    return (
      <div className="flex items-center justify-between gap-4 text-violet-200 bg-slate-950 px-4 py-3 my-2 rounded-lg border border-teal-500/30 hover:border-teal-500/60 transition-all">
        <div className="flex items-center gap-3">
          <img 
            src={data.sender.avatar} 
            alt={data.sender.username}  
            className="w-12 h-12 border-2 border-teal-500 rounded-full object-cover" 
          />
          <div className="flex flex-col">
            <p className="font-semibold text-teal-300">{data.sender.username}</p>
            <p className="text-sm text-violet-400/70">accepted your friend request</p>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 rounded-md text-sm font-medium transition-colors">
          View Profile
        </button>
      </div>
    );
  } else if (data.type === "inviteToMatch") {
    return (
      <div className="flex items-center justify-between gap-4 text-violet-200 bg-slate-950 px-4 py-3 my-2 rounded-lg border border-blue-500/30 hover:border-blue-500/60 transition-all">
        <div className="flex items-center gap-3">
          <img 
            src={data.sender.avatar} 
            alt={data.sender.username}  
            className="w-12 h-12 border-2 border-blue-500 rounded-full object-cover" 
          />
          <div className="flex flex-col">
            <p className="font-semibold text-blue-300">{data.sender.username}</p>
            <p className="text-sm text-violet-400/70">invited you to a match</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
            Join
          </button>
          <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition-colors">
            Decline
          </button>
        </div>
      </div>
    );
  } else if (data.type === "joinMatch") { // tournament , send the player by notification id
  }
  
  return null;
}

export default Notify