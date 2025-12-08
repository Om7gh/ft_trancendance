import { Avatar } from "../contacts/UsersList";
import { TfiMenu } from "react-icons/tfi";

function Contactinfo({contact, isOnline}){

	let status = "Offline";
	let statusIconUrl = "/src/assets/paddel/offline.svg";
	
	if (isOnline){
		status = "Online";
		statusIconUrl = "/src/assets/paddel/online.svg";
	}

	return (
		<div className="ml-6 flex-1">
			<h1 className="text-xl font-bold"> {contact.name}</h1>
			<p className="text-sm relative">
				{status}
				<span className="w-full h-full absolute left-11 top-1 bg-no-repeat" style={ {backgroundImage: `url(${statusIconUrl})`} }>
				</span>
			</p>
		</div>
	);
}


// invite: 
// block: 

function UserInvite({inviteStyle}){
	return (
		<div className={inviteStyle}>
			<label htmlFor="inviteButton">INVITE</label>
			<input id="inviteButton" type="button"/>
		</div>
	);
}

function UserBlock({blockStyle}){
	return (
		<div className={blockStyle}>
			<label htmlFor="blockButton">BLOCK</label>
			<input id="blockButton" type="button"/>
		</div>
	);
}


function UserActions({isWideScreen})
{
	if (isWideScreen)
	{
		return (
			<div className="basis-[25%] flex h-full gap-3 items-center text-[70%] text-center leading-5 font-bold justify-center">
				<UserInvite inviteStyle="bg-[#0D9488] flex-1 h-[23%] rounded-2xl"/>
				<UserBlock blockStyle="bg-[#F97316] flex-1 h-[23%] rounded-2xl"/>
			</div>
		);
	}
	return (
		<div className="basis-[15%] h-full">
			<TfiMenu className="h-full ml-auto mr-2 w-[30%] text-[#0D9488]"/>
			<div className="relative w-full h-[40%]">
				<UserInvite inviteStyle="bg-[#0D9488] text-center  h-full font-bold leading-[2.2] text-sm"/>
				<UserBlock blockStyle="bg-[#F97316] text-center h-full font-bold leading-[2.2] text-sm"/>
			</div>
		</div>
	);
}

function ChatHeader({contact, screenWidth}){

	const isWideScreen = screenWidth > 200;
	
	return (
		<div id="ChatHeader" className="bg-[#262732] h-[15%] flex flex-wrap items-center gap-2 text-white">
			<Avatar imgUrl={contact.photo_url} name={contact.name} type="contact"/>
			<Contactinfo contact={contact} isOnline={true}/>
			<UserActions isWideScreen={true}/>
		</div>
	);
}

export default ChatHeader;