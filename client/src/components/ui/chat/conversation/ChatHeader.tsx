import { Avatar } from "../contacts/CardsList";
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { VscChevronLeft } from "react-icons/vsc";

import type User from "@/types/User";

type OnAction = (e: React.MouseEvent<HTMLDivElement>, action: string) => void;

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
	isMobile: boolean;
	showActions: boolean;
	onAction: OnAction;
	onTap: () => void;
}

interface ChatHeaderProps{
	contact: User;
	showActions: boolean;
	isMobile: boolean;
	UsersTab: string;
	presence: string;
	onAction: OnAction;
	onTap: () => void;
}

function Contactinfo({name, userPresence}: ContactinfoProps){

	let statusIconUrl = "/src/assets/paddel/offline.svg";
	if (userPresence === "online") {
		statusIconUrl = "/src/assets/paddel/online.svg";
	}

	return (
		<div className="ml-6 flex-1">
			<h1 className="text-xl font-bold"> {name} </h1>
			<p className="text-sm capitalize relative">
				{userPresence}
				<span className="w-full h-full absolute left-11 top-1 bg-no-repeat" style={ {backgroundImage: `url(${statusIconUrl})`} }>
				</span>
			</p>
		</div>
	);
}

function UserInvite({wrapperStyle, onInvite}: InviteButtonProps){
	return (
		<div className={wrapperStyle} onClick={(e) => onInvite(e, "invite")}>
			<label htmlFor="inviteButton">INVITE</label>
			<input id="inviteButton" type="button"/>
		</div>
	);
}

function UserBlock({wrapperStyle, onBlock}: BlockButtonProps){
	return (
		<div className={wrapperStyle} onClick={(e) => onBlock(e, "invite")}>
			<label htmlFor="blockButton">BLOCK</label>
			<input id="blockButton" type="button"/>
		</div>
	);
}

function UserActions({isMobile, showActions, onTap, onAction}: UserActionsProps)
{
	if (isMobile)
	{
		return (
			<div className="basis-[15%] h-full">
				{
					showActions ? <TfiClose onClick={onTap} className="h-full ml-auto mr-2 w-[30%] text-[#0D9488]"/> :
					<TfiMenu onClick={onTap} className="h-full ml-auto mr-2 w-[30%] text-[#0D9488]"/>
				}
				{
					showActions && 
					<div className="relative w-full h-[40%]">
						<UserInvite onInvite={onAction} wrapperStyle="bg-[#0D9488] text-center h-full font-bold leading-[2.2] text-sm"/>
						<UserBlock onBlock={onAction} wrapperStyle="bg-[#F97316] text-center h-full font-bold leading-[2.2] text-sm"/>
					</div>
				}
			</div>
		);
	}
	return (
		<div className="basis-[25%] flex h-full gap-3 items-center text-[70%] text-center leading-5 font-bold justify-center">
			<UserInvite onInvite={onAction} wrapperStyle="bg-[#0D9488] flex-1 h-[23%] rounded-2xl"/>
			<UserBlock onBlock={onAction} wrapperStyle="bg-[#F97316] flex-1 h-[23%] rounded-2xl"/>
		</div>
	);
}

function BackButton({onBack, lastView}: {onBack: OnAction; lastView: string}){
	return (
		<div className="absolute rounded-3xl top-[5%] left-1" onClick={(e) => onBack(e, "back")}>
			<VscChevronLeft className="text-[#0D9488] inline text-2xl mb-1"/>
			<label htmlFor="backButton" className="text-gray-400">{lastView}</label>
			<input id="backButton" type="button"/>
		</div>
	);
}

function ChatHeader({contact, UsersTab, isMobile, onTap, onAction, showActions, presence}: ChatHeaderProps){

	return (
		<div id="ChatHeader" className="bg-[#262732] h-[15%] flex flex-wrap relative items-center gap-2 text-white">
			{isMobile && <BackButton lastView={UsersTab} onBack={onAction}/>}
			<Avatar imgUrl={contact.photo_url} name={contact.name} type="contact"/>
			<Contactinfo name={contact.name} userPresence={presence}/>
			<UserActions isMobile={isMobile} showActions={showActions} onTap={onTap} onAction={onAction}/>
		</div>
	);
}

export default ChatHeader;

