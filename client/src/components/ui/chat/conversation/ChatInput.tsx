import SendIcon from "@/assets/button/send-icon.svg";
import { CgUnblock } from "react-icons/cg";

interface ChatInputProp {
	onSend: (e: React.FormEvent<HTMLFormElement>) => void
	connectionState: string
}

function MessageInputField({disabled}: {disabled: boolean}){
	return (
		<div className="flex-1 h-[60%] flex items-center justify-center text-white font-bold rounded-3xl
			bg-[linear-gradient(90deg,rgba(13,148,136,1)0%,rgba(114,24,199,1)100%)]">
			<label htmlFor="messageInput"></label>
			<input id="messageInput" type="text" placeholder="Send a message" disabled={disabled}
				className="w-[99%] h-[85%] pl-4 bg-[#493b7d] focus:outline-0 rounded-3xl placeholder:opacity-60"/>
		</div>
	);
}

function SendButton(){
	return (
		<button id="sendButton" name="button" value="send" className="h-[55%] bg-violet-600 basis-18 text-center border-t-5
			border-neon/30 rounded-2xl active:border active:bg-violet-600">
			<img src={SendIcon} alt="rocket-icon" className=" m-auto"/>
			<span className="block -mt-1 text-white font-bold text-sm">SEND</span>
		</button>
	);
}

function UnblockButton(){

	return (
		<button id="unblockButton" name="button" value="unblock"
			className="w-[30%] flex justify-center items-center h-[55%] rounded-4xl bg-neon/70 ">
			<CgUnblock className="text-gray-300 text-xl mb-1 mr-2"/>
			<span className="block -mt-1 text-gray-300 font-bold text-[100%] capitalize">unblock</span>
		</button>
	);
}

function ChatInput({onSend, connectionState}: ChatInputProp){
	return (
		<form id="chatInputForm" onSubmit={(e) => {onSend(e)}} className="min-h-25 flex justify-center flex-wrap items-center gap-2">
			{connectionState === "blocking_them" && <UnblockButton/>}
			{
				connectionState !== "blocking_them" && <>
					<MessageInputField disabled={connectionState === "blocked_by_them"}/>
					<SendButton/>
				</>
			}
		</form>
	);
}

export default ChatInput;