import { BarLoader } from "react-spinners";
import type {Card} from "@/types/UserCard"
import type {Message} from "@/types/Message"

import ErrorImg from "@assets/illustrations/errorState.svg";
import EmptyMsgImg from "@assets/illustrations/Work chat-cuate.svg";
import EmptyConvImg from "@assets/illustrations/startConversation.svg";
import EmptyContactImg from "@assets/illustrations/emptyContacts.svg";

type OnAction = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => void;

interface StatusResolverProps{
  status: string,
  content: Card[] | Message[],
  view: string,
  children: React.ReactNode
  onAction?: OnAction,
}

function EmptyContacts(){
    return (
    <div className="h-[87%] flex flex-col justify-center items-center text-gray-300">
      <img src={EmptyContactImg}/>
      <p className="font-bold text-gray-200"> No contacts found</p>
      <p>See Chats or add new ones</p>
    </div>
  );
}

function EmptyConversations({onAction}: {onAction: OnAction}){
    return (
    <div className="h-[87%] flex flex-col justify-center items-center text-gray-300">
        <img src={EmptyConvImg}/>
        <p className="font-bold text-gray-200"> No conversation found</p>
        <p>Chat with a contact to start.</p>
        <button onClick={(e) => {onAction(e, "Contacts")}} className="m-6 bg-[#F97316]/80 p-1.5 rounded-4xl text-gray-200">Start a conversation</button>
    </div>
  );
}

function EmptyMessages(){
    return (
    <div className="h-[87%] flex flex-col justify-center items-center text-gray-300">
      <img src={EmptyMsgImg}/>
      <p className="font-bold text-gray-200"> No messages yet</p>
      <p>Your conversations will appear here, start typing</p>
    </div>
  );
}

function EmptyStatus({view, onAction}: {view: string, onAction?: OnAction}){
    if (view === "Chats" && onAction)
        return <EmptyConversations onAction={onAction}/>
    if (view === "Contacts")
        return <EmptyContacts/>
    if (view === "Messages")
        return <EmptyMessages/>
}

function LoadingStatus(){
  return (
    <div className="h-[87%] flex flex-col justify-center items-center">
      <p className="text-gray-200 font-bold"> Getting things ready</p>
      <p className="text-gray-200 "> Just a moment... </p>
      <BarLoader color="#ff9100"
        height={3}
        width={200}
        cssOverride={{ margin: "15px", borderRadius: "10px" }}/>
    </div>
  );
}

function ErrorStaus(){
  return (
    <div className="h-[87%] flex flex-col justify-center items-center">
      <img src={ErrorImg}/>
      <p className="text-gray-200 font-bold">Something went wrong</p>
    </div>
  );
}

function StatusResolver({status, content, view, onAction, children}: StatusResolverProps){
  switch (status){
    case "loading": {
     return <LoadingStatus/>
    }
    case "error": {
      return <ErrorStaus/>
    }
    case "fulfilled": {
      if (content.length === 0){
        return <EmptyStatus view={view} onAction={onAction}/>
      }
      return <>{children}</>
    }
  }
}

export default StatusResolver