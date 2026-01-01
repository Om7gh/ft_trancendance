import { Avatar } from "../contacts/CardsList";
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { VscChevronLeft } from "react-icons/vsc";

import type {User} from "@/types/User";
import { useContext } from "react";
import { ViewportContext } from "@/pages/Chat";

type OnAction = (action: string) => void;
interface ActionButtonProps{
	wrapperStyle: string;
}

interface InviteButtonProps extends ActionButtonProps{
	onInvite: OnAction;
}

interface BlockButtonProps extends ActionButtonProps{
	onBlock: OnAction;
}

interface ContactinfoProps{
	name: string;
	userPresence: string;
}

interface UserActionsProps{
	showActions: boolean;
	onAction: OnAction;
	onTap: () => void;
}


interface ChatHeaderProps{
	contact: User;
	showActions: boolean;
	UsersTab: string;
	presence: string;
	onAction: OnAction;
	onTap: () => void;
}

function Contactinfo({name, userPresence}: ContactinfoProps){

	let statusIconUrl = "../../../public/assets/paddel/offline.svg";
	if (userPresence === "online") {
		statusIconUrl = "../../../public/assets/paddel/online.svg";
	}

	return (
		<div className="ml-6 flex-1">
			<h1 className="text-[clamp(16px,5cqw,25px)] font-bold"> {name} </h1>
			<p className="text-sm capitalize  mt-2 relative">
				{userPresence}
				<span className="w-full h-full absolute ml-2 top-1 bg-no-repeat"
					style={ {backgroundImage: `url(${statusIconUrl})`} }>
				</span>
			</p>
		</div>
	);
}

function UserInvite({wrapperStyle, onInvite}: InviteButtonProps){
	return (
		<div className={wrapperStyle} onClick={(e) => {
			e.stopPropagation()
			onInvite("invite")
			}}>
			<label htmlFor="inviteButton">INVITE</label>
			<input id="inviteButton" type="button" onClick={(e) => e.stopPropagation()}/>
		</div>
	);
}

function UserBlock({wrapperStyle, onBlock}: BlockButtonProps){
	return (
		<div className={wrapperStyle} onClick={(e) => {
			e.stopPropagation()
			onBlock("block")
			}}>
			<label htmlFor="blockButton" className="uppercase">block</label>
			<input onClick={(e) => e.stopPropagation()} id="blockButton" type="button"/>
		</div>
	);
}

function UserActions({showActions, onTap, onAction}: UserActionsProps){
	const viewportInfo = useContext(ViewportContext);
	if (viewportInfo?.isMobile || (viewportInfo?.viewportWidth! <= 1080))
	{
		return (
			<div className="h-full shrink-0">
				{
					showActions ? <TfiClose onClick={onTap} className="h-full ml-auto mr-2 w-[30%] text-violet-500"/> :
					<TfiMenu onClick={onTap} className="h-full ml-auto mr-2 w-[30%] text-violet-500"/>
				}
				{
					showActions && 
					<div className="relative w-full h-[40%]">
						<UserInvite onInvite={onAction} wrapperStyle="bg-violet-500 border-b-2 border-black p-1 text-center h-full font-bold leading-[2.2] text-sm"/>
						<UserBlock onBlock={onAction} wrapperStyle="bg-neon text-center p1 h-full font-bold leading-[2.2] text-sm"/>
					</div>
				}
			</div>
		);
	}
	return (
		<div className="basis-[40%] flex h-full gap-3 items-center text-[70%] text-center leading-5 font-bold justify-center">
			<UserInvite onInvite={onAction} wrapperStyle="bg-violet-500 flex-1 p-1 rounded-2xl"/>
			<UserBlock onBlock={onAction} wrapperStyle="bg-neon flex-1 p-1 rounded-2xl"/>
		</div>
	);
}

function BackButton({onBack, lastView}: {onBack: OnAction; lastView: string}){
	return (
		<div className="absolute rounded-3xl top-0 left-12" onClick={(e) => {
			e.stopPropagation()
			onBack("back")
			}}>
			<VscChevronLeft className="text-[#0D9488] inline text-2xl mb-1"/>
			<label htmlFor="backButton" className="text-gray-400">{lastView}</label>
			<input id="backButton" type="button"/>
		</div>
	);
}

function ChatHeader({contact, UsersTab, onTap, onAction, showActions, presence}: ChatHeaderProps){

	const viewportInfo = useContext(ViewportContext);
	return (
		<div id="ChatHeader" className="min-h-25 mb-3 p-2 flex query-container items-center gap-2 text-gray-300">
			{viewportInfo?.isMobile && <BackButton lastView={UsersTab} onBack={onAction}/>}
			<Avatar imgUrl={contact.photo_url} name={contact.name} type="contact"/>
			<Contactinfo name={contact.name} userPresence={presence}/>
			{
				(contact.connectionState === "active") && <UserActions
					onTap={onTap}
					onAction={onAction}
					showActions={showActions}/>
			}
		</div>
	);
}

export default ChatHeader;

