interface ChatInputProp {
    onSend: (e: React.FormEvent<HTMLFormElement>) => void
}

function MessageInputField(){
    return (
        <div className="flex-1 h-[55%] flex items-center justify-center text-white rounded-3xl bg-[linear-gradient(90deg,rgba(13,148,136,1)0%,rgba(249,115,22,1)100%)]">
            <label htmlFor="messageInput"></label>
            <input id="messageInput" type="text" placeholder="Send a message"
                className="w-[99%] h-[85%] pl-4 bg-[#354358] focus:outline-0 focus:shadow-lg focus:shadow-[#c75b0f] rounded-3xl placeholder:opacity-60"/>
        </div>
    );
}

function SendButton(){
    return (
        <button id="sendButton" className="h-[55%] bg-[#F97316] basis-18 text-center border-t-5 border-[#c75b0f] focus: rounded-2xl active:border active:bg-[#ff6a00]  ">
            <img src="src/assets/button/send-icon.svg" alt="rocket-icon" className=" m-auto"/>
            <span className="block -mt-1 text-white font-bold text-sm">SEND</span>
        </button>
    );
}

function ChatInput({onSend}: ChatInputProp){
    return (
        <form id="chatInputForm" onSubmit={(e) => {onSend(e)}} className="bg-[#354358] h-[10%] justify-center items-center flex gap-2">
            <MessageInputField/>
            <SendButton/>
        </form>
    );
}

export default ChatInput;