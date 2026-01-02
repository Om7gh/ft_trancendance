import { BarLoader } from "react-spinners";
import type {Card} from "@/types/UserCard"
import type {Message} from "@/types/Message"

import ErrorImg from "@assets/illustrations/error.svg";
import EmptyMsgImg from "@assets/illustrations/emptyMsgs.svg";
import EmptyConvImg from "@assets/illustrations/emptyConv.svg";
import EmptyContactImg from "@assets/illustrations/emptyContacts.svg";

type OnAction = (e: React.MouseEvent<HTMLButtonElement>, tabName: string) => void;

interface StatusResolverProps{
	status: string,
	content: Card[] | Message[],
	view: string,
	children: React.ReactNode
	onAction?: OnAction,
}

interface EmptyProps{
	primaryMsg: string;
	imgUrl?: string;
	secondaryMsg?: string;
	children?: React.ReactNode;
}

function Placeholder({imgUrl, primaryMsg, secondaryMsg, children}: EmptyProps){
	return (
		<div className="h-[87%] flex flex-col justify-center items-center text-gray-300 text-[clamp(8px,1vw,20px)]">
			<img
				src={imgUrl}
				alt="illustration image for empty data or error in case of error"
				className="h-[clamp(10px,50%,200px)] w-[clamp(50px,80%,400px)]"/>
			<p className="font-bold">{primaryMsg}</p>
			<p className="text-gray-400">{secondaryMsg}</p>
			{children}
		</div>
	);
}

function EmptyStatus({view, onAction}: {view: string, onAction?: OnAction}){
		if (view === "Chats" && onAction)
			return (
				<Placeholder
					imgUrl={EmptyConvImg}
					primaryMsg={"No conversation found"}
					secondaryMsg={"Chat with a contact to start"}>
						<button onClick={(e) => {onAction(e, "Contacts")}}
							className="m-6 bg-violet-500/80 p-2 rounded-4xl text-gray-200">
							Start a conversation
						</button>
				</Placeholder>
			);
		if (view === "Contacts")
			return (
				<Placeholder
					imgUrl={EmptyContactImg}
					primaryMsg={"No contacts found"}
					secondaryMsg={"See Chats or add new ones"}>
				</Placeholder>
			);
		if (view === "Messages")
			return (
				<Placeholder
					imgUrl={EmptyMsgImg}
					primaryMsg={"No messages yet"}
					secondaryMsg={"Your conversations will appear here, start typing"}>
				</Placeholder>
			);
}

function StatusResolver({status, content, view, onAction, children}: StatusResolverProps){
	switch (status){
		case "loading": {
			return (
				<Placeholder
					primaryMsg="Getting things ready"
					secondaryMsg="Just a moment..." >
						<BarLoader color="#22d3eecc"
							height={3}
							width={200}
							cssOverride={{ margin: "15px", borderRadius: "10px" }}/>
				</Placeholder>
			);
		}
		case "error": {
			return (
				<Placeholder
					imgUrl={ErrorImg}
					primaryMsg="Something went wrong">
				</Placeholder>
			);
		}
		case "fulfilled": {
			if (content.length === 0){
				return <EmptyStatus view={view} onAction={onAction}/>
			}
			return <>{children}</>
		}
	}
}

export {Placeholder};
export default StatusResolver