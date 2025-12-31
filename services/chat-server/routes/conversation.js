import fp from 'fastify-plugin';
import getBlockState from '../utils/getBlockState.js';

function conversationPlugin(instance){

	function constructReply(userId){
		let conversations = instance.conversationManager.getUserConversations(userId);
		conversations = conversations.map((conv) => {
			conv = {
				id: conv.id,
				firstUser: JSON.parse(conv.firstUserJson),
				secondUser: JSON.parse(conv.secondUserJson),
				firstUserUnreadCount: conv.firstUserUnreadCount,
				secondUserUnreadCount: conv.secondUserUnreadCount,
				lastMessage: conv.lastMessage,
				lastUpdate: conv.lastUpdate
			}
			const unreadMsgs = (conv.firstUser.id === userId) ? conv.firstUserUnreadCount : conv.secondUserUnreadCount;
			let user = (conv.firstUser.id === userId) ? conv.secondUser : conv.firstUser;
			user = {...user, connectionState: getBlockState(userId, user.id, instance.blockManager)}
			return ({
				id: conv.id,
				friend: user,
				unread_msg: unreadMsgs,
				presence: instance.connectedUsers.has(user.id) ? "online" : "offline",
				lastMsg: conv.lastMessage,
				lastUpdate: conv.lastUpdate
			});
		});
		return (conversations);
	}
	
	instance.get("/conversations", async (req, reply) => {
		let constructedReply = constructReply(req.user.id);
		return (JSON.stringify(constructedReply));
	});
}

export default fp(conversationPlugin, {name: "conversationPlugin"});