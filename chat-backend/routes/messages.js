import fp from 'fastify-plugin';
import Messages from "../classes/Messages.js";
import Conversations from "../classes/Conversations.js";
import findConversation from "../utils/findConversatoin.js";
import Websocket from 'ws';


function messagesPlugin(instance, opt) {

    let connectedUsers = new Map();
	let activeUserConv = new Map();
	let presenceInterests = new Map();

	instance.decorate('connectedUsers', connectedUsers);

	function handleIncomingMessages(incomingMsg, clientSocket, clientReq) {
		try {
			clientReq.log.debug(`incoming msg: ${incomingMsg}`);
			let parsedMsg = JSON.parse(incomingMsg);
			
			function notifyOrSend(msg, conv) {
				if (connectedUsers.has(parsedMsg.target.id)){
					if (!activeUserConv.has(parsedMsg.target.id) || activeUserConv.get(parsedMsg.target.id) !== conv.id){
						(parsedMsg.sender.id !== conv.user1.id) && (conv.user1UnreadCount += 1);
						(parsedMsg.sender.id !== conv.user2.id) && (conv.user2UnreadCount += 1);
					}
					connectedUsers.get(parsedMsg.target.id).send(JSON.stringify({type: "message", ...msg}));
					clientReq.log.debug(`server send via websocke: ${JSON.stringify({type: "message", ...msg})}`);
				}
				else {
					(parsedMsg.sender.id !== conv.user1.id) && (conv.user1UnreadCount += 1);
					(parsedMsg.sender.id !== conv.user2.id) && (conv.user2UnreadCount += 1);	
					sendToNotification(msg);
				}
			}
			
			function sendToNotification(msg) {
				instance.log.info(`${msg} will be send to notification service`);
			}

			function handleNewConversation(){
				let conversation = new Conversations(parsedMsg.sender, parsedMsg.target);
				let targetIsConnected = connectedUsers.has(parsedMsg.target.id);
				
				if (targetIsConnected){
					connectedUsers.get(parsedMsg.target.id).send(JSON.stringify({
						type: "new-conversation",
						conversation: {
							id: conversation.id,
							friend: parsedMsg.sender,
							unread_msg: 0,
							presence: "online"
						}
					}));
				}

				if (clientSocket.readyState === Websocket.OPEN){
					clientSocket.send(JSON.stringify({
						type: "new-conversation",
						conversation: {
							id: conversation.id,
							friend: parsedMsg.target,
							unread_msg: 0,
							presence: targetIsConnected ? "online" : "offline"
						}
					}));
				}
				opt.msg.convDb.push(conversation);
				return (conversation)
			}
			
			function handleSendMessage() {
				let conversation = findConversation(opt.msg.convDb, parsedMsg.sender.id, parsedMsg.target.id);
				conversation === undefined && (conversation = handleNewConversation());
				let message = new Messages(conversation.id, parsedMsg.sender.id, parsedMsg.content);
				opt.msg.msgDb.push(message);
				notifyOrSend(message.message, conversation);
			}

			function handleEnterConversation() {
				let actionByUserId = +clientReq.params.userId;

				if (activeUserConv.has(actionByUserId) && activeUserConv.get(actionByUserId) === parsedMsg.conversationId)
					return ;
				let conv = opt.msg.convDb.find((conv) => conv.id === parsedMsg.conversationId);
				if (conv === undefined || (conv.user1.id !== actionByUserId && conv.user2.id !== actionByUserId)){
					clientSocket.send(`You don't belong to conversation ${parsedMsg.conversationId}`);
					return ;
				}
				(actionByUserId === conv.user1.id) && (conv.user1UnreadCount = 0);
				(actionByUserId === conv.user2.id) && (conv.user2UnreadCount = 0);
				activeUserConv.set(actionByUserId, parsedMsg.conversationId);
			}

			function handleLeaveConversation() {
				let actionByuserId = +clientReq.params.userId;
				if (!activeUserConv.has(actionByuserId) || activeUserConv.get(actionByuserId) !== parsedMsg.conversationId)
					return ;
				activeUserConv.delete(actionByuserId, parsedMsg.conversationId);
			}

			function handleWatchUsers(){
				let userId = +clientReq.params.userId;
				if (presenceInterests.has(userId)){
					presenceInterests.delete(userId);
					presenceInterests.set(userId, parsedMsg.users);
				}
				presenceInterests.set(userId, parsedMsg.users);
			}

			switch (parsedMsg.action) {
				case "send-message": {
					handleSendMessage();
					break ;
				}
				case "watch-users": {
					handleWatchUsers();
					break;
				}
				case "enter-conversation":{
					handleEnterConversation();
					break ;
				}
				case "leave-conversation":{
					handleLeaveConversation();
					break ;
				}
				default: {
					throw new Error("Action property is missing/invalid");
				}
			}
		}
		catch(e){
			clientSocket.send(e.message);
		}
	}

	function broadcastPresenceChange(presenceChange, req){
		let socketUserId = +req.params.userId;
		presenceInterests.forEach((users, interstedUser, map) => {
			if (users.find((UID) => +UID === socketUserId) !== undefined){
				connectedUsers.get(interstedUser).send(JSON.stringify({
					type: "user-presence",
					presence: presenceChange,
					userId: socketUserId
				}));
			}
		});
	}

	function handleConnectionClose(code, reason, req){
		broadcastPresenceChange('offline', req);
		connectedUsers.delete(+req.params.userId);
		activeUserConv.delete(+req.params.userId);
		req.log.info('client close its connection');
		req.log.info(`its code: ${code} and its reason: ${reason}`);
	}

	function handleConnectionError(error, req){
		req.log.error(`websocket error hinstanceen ${error}`);
	}
 
	instance.get("/messages/:userId", {websocket: true}, (socket, req) => {
        connectedUsers.set(+req.params.userId, socket);
		broadcastPresenceChange('online', req);
		socket.on('message', (msg) => handleIncomingMessages(msg, socket, req));
		socket.on('close', (code, reason) => handleConnectionClose(code, reason, req));
		socket.on('error', (err) => handleConnectionError(err, req));
	})

	instance.get("/messages/:userId/:convId", async (req, reply) => {
		
		let conv = opt.msg.convDb.find((conv) => conv.id === +req.params.convId);
		if (conv === undefined || (conv.user1.id !== +req.params.userId && conv.user2.id !== +req.params.userId))
		{
			reply.code(403);
			throw new Error(`You don't belong to conversation ${req.params.convId}`);
		}
		let historyMsgs = opt.msg.msgDb.filter((msg) => msg.convId === +req.params.convId).map((msg) => msg.message);
		reply.log.debug(`reply: ${JSON.stringify(historyMsgs)}`);
		reply.type('application/json');
		return (historyMsgs);
	});
}

export default fp(messagesPlugin, {name: "messagePlugin"});