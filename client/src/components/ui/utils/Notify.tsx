import { useNavigate } from "react-router-dom"
import { FaHourglassStart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAcceptMatch } from "@/services/friends/AcceptMatch";


interface SenderType {
  username: string,
  id: string,
  avatar: string
}

interface ReceiverType {
  id: string
}

export interface NotificationType  {
  id: string,
  type: string,
  expireTime: number,
  sender: SenderType,
  receiver: ReceiverType
}

function Notify({data, close} : {data : NotificationType, close: () => void}) {
  const navigate = useNavigate()
  const currentDate = Date.now() / 1000;
  const diff = data.expireTime - currentDate;
  if (data.type === "joinMatch") {
    const url = `/dashboard/games/pingpong/remote/joinMatch?rid=${data.sender.id}`;
    const redirectToMatch = () => {
      const diff = data.expireTime - currentDate;
      if (diff <= 0) {
        toast.warning(`${data.sender.id} is expired`, {
          delay: 100,
          position: "top-center"
        })
        return ;
      }
      navigate(url)
    }
      return <div className={`flex items-center justify-between gap-4 text-violet-200 ${diff < 0 ? "grayscale" : "bg-slate-950/30"}  py-1 my-2 rounded-lg border border-violet-500/30 hover:border-violet-500/60 transition-all mx-8`} onClick={close}>
        <div className="flex items-center gap-3 w-full">
          <button onClick={redirectToMatch} className="px-6 py-3 flex justify-between items-center w-full" >
            <div className="flex  items-center gap-5">
              <FaHourglassStart className="w-10 h-10 p-2 text-violet-500 bg-slate-800" />
              <div className="flex flex-col justify-start items-start gap-2">
                <p className="">Tournament</p>
                <span className="text-xs text-violet-300">{data.sender.id}</span>
              </div>
            </div>
            <p  className=" relative w-10 h-10 bg-neon/50 flex items-center justify-center before:content-['→'] before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-3xl before:text-white before:bg-violet-900 before:translate-x-1 before:translate-y-1 before:z-10"></p>
          </button>
        </div>
        {diff < 0 && <p>Expired !</p>}
        </div>
  }
  if (data.type === "friend-request") {
    const url = `profile/${data.sender.username}`
    const navigate = useNavigate()
    return (
      <div className="flex items-center justify-between gap-4 text-violet-200 bg-slate-950/30 px-3 py-2 my-2 rounded-lg border border-violet-500/30 hover:border-violet-500/60 transition-all mx-8">
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
  } if (data.type === "friend-accept") {
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
  } if (data?.type === "inviteToMatch"  && diff > 0) {
    const {refetch} = useAcceptMatch(data?.sender.id);
    const handleClick = () => {
      refetch()
    }
    return (
      <div className={`flex items-center justify-between gap-4 text-violet-200 ${diff < 0 ? "grayscale" : "bg-slate-950/30"}  py-1 my-2 rounded-lg border border-violet-500/30 hover:border-violet-500/60 transition-all mx-8`}>
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
          <button className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-md text-sm font-medium transition-colors" onClick={handleClick}>
            Join
          </button>
          <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition-colors">
            Decline
          </button>
          {diff <= 0 && <p className="text-xs mx-3 text-violet-500">expired</p>}
        </div>
      </div>
    );
  } if (data?.type === "new-message") {
    const url = `/dashboard/chat`
    const navigate = useNavigate()
    return (
      <div className="flex items-center justify-between gap-4 text-violet-200 bg-slate-950/30 px-3 py-2 my-2 rounded-lg border border-violet-500/30 hover:border-violet-500/60 transition-all mx-8">
        <div className="flex items-center gap-3">
          <img 
            src={data?.sender.avatar} 
            alt={data?.sender.username}  
            className="w-12 h-12 border-2 border-violet-500 rounded-full object-cover" 
          />
          <div className="flex flex-col">
            <p className="font-semibold text-violet-300">{data.sender.username}</p>
            <p className="text-sm text-violet-400/70">Sent you a new message</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-violet-900/50 hover:bg-violet-900 rounded-md text-sm font-medium transition-colors" onClick={() => navigate(url)}>
            See message
          </button>
        </div>
      </div>
    );
  }
  
  return null;
}

export default Notify