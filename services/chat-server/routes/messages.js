import Websocket from 'ws';
import fp from 'fastify-plugin';
import areFriends from "../utils/areFriends.js";
import userInConversation from '../utils/userInConversation.js';
import ConversationManager from '../classes/ConversationsManager.js';
import UsersBlocksManager from '../classes/UsersBlockManager.js';
import MessageManager from "../classes/MessageManager.js"
import messageSchema from '../schemas/messages.js';
import RequestValidator from '../classes/RequestValidator.js';

function messagesPlugin(instance) {

    const connectedUsers = new Map();
	const activeUserConv = new Map();
	const presenceInterests = new Map();

	instance.decorate('conversationManager', new ConversationManager(instance.betterSqlite3));
	instance.decorate('messageManager', new MessageManager(instance.betterSqlite3));
	instance.decorate('blockManager', new UsersBlocksManager(instance.betterSqlite3));
	
	const reqValidator = new RequestValidator();
	const getOptions = {
		schema: {
			params: messageSchema
		}
	}

	instance.decorate('connectedUsers', connectedUsers);

	function handleIncomingMessages(incomingMsg, clientSocket, clientReq) {
		try {
			clientReq.log.debug(`incoming msg: ${incomingMsg}`);
			let parsedMsg = JSON.parse(incomingMsg);

			async function sendToNotification(msg) {
				try {
					const sender = {
						id: clientReq.user.id,
						username: clientReq.user.username,
						avatar: clientReq.user.avatar,
					};

					const receiver = {
						id: parsedMsg.target.id,
					};
					await axios.post('http://notification:9005/send', {
						data: [{
							id: randomUUID(),
							type: 'new-message',
							expireTime: 0,
							sender,
							receiver,
						}
					]});
				}
				catch (error) {
					clientSocket.send("Error Happen while sending notification");
				}
			}
			
			function notifyOrSend(msg, conv) {
				if (connectedUsers.has(parsedMsg.target.id)){
					if (!activeUserConv.has(parsedMsg.target.id) || activeUserConv.get(parsedMsg.target.id) !== conv.id){
						instance.conversationManager.incrementUserUnreadCount(parsedMsg.sender.id);
					}
					connectedUsers.get(parsedMsg.target.id).send(JSON.stringify({type: "message", ...msg}));
					clientReq.log.debug(`server send via websocket: ${JSON.stringify({type: "message", ...msg})}`);
				}
				else {
					instance.conversationManager.incrementUserUnreadCount(parsedMsg.sender.id);
					sendToNotification(msg);
				}
				instance.conversationManager.updateLastMessage(conv.id, msg.content);
			}

			function handleNewConversation(){
				let conversation = instance.conversationManager.addConversation(parsedMsg.sender, parsedMsg.target);
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
				return (conversation)
			}
			
			async function handleSendMessage() {
				try {
					if (clientReq.user.id !== parsedMsg.sender.id)
						throw Error("you aren't the authorized sender");

					const result = await areFriends(clientReq.headers.cookie, parsedMsg.target.id);
					if (!result)
						throw Error("You can only message your contacts.");

					if (instance.blockManager.hasBlockedBy(parsedMsg.target.id, parsedMsg.sender.id))
						throw Error("You can't send messages to this user");
					let conversation = instance.conversationManager.hasConversation(parsedMsg.sender.id, parsedMsg.target.id);
					conversation === undefined && (conversation = handleNewConversation());
					let message = instance.messageManager.addMessage(conversation.id, parsedMsg.sender.id, parsedMsg.content);
					notifyOrSend(message, conversation);
				}
				catch(e){
					clientSocket.send(JSON.stringify({
						type: "error",
						message: e.message
					}));
				}
			}

			function handleEnterConversation() {
				let actionByUserId = clientReq.user.id;
				if (activeUserConv.has(actionByUserId) && activeUserConv.get(actionByUserId) === parsedMsg.conversationId)
					return ;
				if (!userInConversation(actionByUserId, parsedMsg.conversationId, instance.conversationManager)){
					clientSocket.send(`You don't belong to conversation ${parsedMsg.conversationId}`);
					return ;
				}
				instance.conversationManager.resetUserUnreadCount(actionByUserId);
				activeUserConv.set(actionByUserId, parsedMsg.conversationId);
			}

			function handleLeaveConversation() {
				let actionByuserId = clientReq.user.id;
				if (!activeUserConv.has(actionByuserId) || activeUserConv.get(actionByuserId) !== parsedMsg.conversationId){
					clientSocket.send("Can't leave this conversation");
					return ;
				}
				activeUserConv.delete(actionByuserId);
			}

			function handleWatchUsers(){
				let userId = clientReq.user.id;
				if (presenceInterests.has(userId)){
					presenceInterests.delete(userId);
					presenceInterests.set(userId, parsedMsg.users);
				}
				presenceInterests.set(userId, parsedMsg.users);
			}

			async function handleUserBlock(){
				try {
					if (clientReq.user.id === parsedMsg.targetId)
						throw Error("You cannot block yourself!");
					const result = areFriends(clientReq.headers.cookie, parsedMsg.targetId);
					if (!result)
						throw Error("You are not allowed to block this user");
					if (
						instance.blockManager.hasBlockedBy(clientReq.user.id, parsedMsg.targetId)
						||
						instance.blockManager.hasBlockedBy(parsedMsg.targetId, clientReq.user.id)
					)
						throw Error("You cannot block this user!");
					instance.blockManager.addBlock(clientReq.user.id, parsedMsg.targetId);
					if (connectedUsers.has(parsedMsg.targetId)){
						connectedUsers.get(parsedMsg.targetId).send(JSON.stringify({
							type: "connection-update",
							stateBy: clientReq.user.id,
							connectionState: "blocked_by_them"
						}));
					}
				}
				catch(e) {
					clientSocket.send(JSON.stringify({
						type: "error",
						message: e.message
					}));
				}
			}

			async function handleUserUnblock(){
				try {
					if (clientReq.user.id === parsedMsg.targetId)
						throw Error("You cannot Unblock yourself!");
					const result = await areFriends(clientReq.headers.cookie, parsedMsg.targetId);
					if (!result)
						throw Error("You are not allowed to unblock this user");
					if (!instance.blockManager.hasBlockedBy(clientReq.user.id, parsedMsg.targetId))
						throw Error("User is not blocked!");
					if (connectedUsers.has(parsedMsg.targetId)){
						connectedUsers.get(parsedMsg.targetId).send(JSON.stringify({
							type: "connection-update",
							stateBy: clientReq.user.id,
							connectionState: "active"
						}));
					}
					instance.blockManager.removeBlock(clientReq.user.id, parsedMsg.targetId);
				}
				catch(e) {
					clientSocket.send(JSON.stringify({
						type: "error",
						message: e.message
					}));
				}
			}

			switch (parsedMsg.action) {
				case "send-message": {
					reqValidator.isValidRequest(parsedMsg, "message-action");
					handleSendMessage();
					break ;
				}
				case "watch-users": {
					reqValidator.isValidRequest(parsedMsg, "presence-action");
					handleWatchUsers();
					break;
				}
				case "enter-conversation":
				case "leave-conversation":{
					reqValidator.isValidRequest(parsedMsg, "conversation-action");
					(parsedMsg.action === "enter-conversation") ? handleEnterConversation() :
					handleLeaveConversation();
					break ;
				}
				case "block-user":
				case "unblock-user":{
					reqValidator.isValidRequest(parsedMsg, "block-action");
					(parsedMsg.action === "block-user") ? handleUserBlock() :
					handleUserUnblock();
					break;
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
		let socketUserId = req.user.id;
		presenceInterests.forEach((users, interstedUser, map) => {
			if (users.find((id) => id === socketUserId) !== undefined){
				if (connectedUsers.has(interstedUser)){
					connectedUsers.get(interstedUser).send(JSON.stringify({
						type: "user-presence",
						presence: presenceChange,
						userId: socketUserId
					}));
				}
			}
		});
	}

	function handleConnectionClose(code, reason, req){
		broadcastPresenceChange('offline', req);
		connectedUsers.delete(req.user.id);
		activeUserConv.delete(req.user.id);
		presenceInterests.delete(req.user.id);
		req.log.info('client close its connection');
		req.log.info(`its code: ${code} and its reason: ${reason}`);
	}

	function handleConnectionError(error, req){
		req.log.error(`websocket error hinstanceen ${error}`);
	}
 
	instance.get("/messages", {websocket: true}, (socket, req) => {
        connectedUsers.set(req.user.id, socket);
		broadcastPresenceChange('online', req);
		socket.on('message', (msg) => handleIncomingMessages(msg, socket, req));
		socket.on('close', (code, reason) => handleConnectionClose(code, reason, req));
		socket.on('error', (err) => handleConnectionError(err, req));
	})

	instance.get("/messages/:convId", getOptions ,async (req, reply) => {
		const convId = Number(req.params.convId);

		if (!userInConversation(req.user.id, convId, instance.conversationManager))
		{
			reply.code(403);
			throw new Error(`You don't belong to conversation ${convId}`);
		}
		let historyMsgs = instance.messageManager.getUserHistoryMsgs(convId);
		return (historyMsgs);
	});
}

export default fp(messagesPlugin, {name: "messagePlugin"});