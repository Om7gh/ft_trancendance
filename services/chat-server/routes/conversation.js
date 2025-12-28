import fp from 'fastify-plugin';
// import friendConnectionState from '../utils/friendConnectionState.js';
import getBlockState from '../utils/getBlockState.js';

function conversationPlugin(instance, opt){

	function constructReply(userId){
		// let conversations = opt.conv.convDb.filter((conv) => conv.firstUser.id === userId || conv.secondUser.id === userId);
		let conversations = instance.conversationManager.getUserConversations(userId);
		// console.log("Fetched conversations from DB:", conversations);
		conversations = conversations.map((conv) => {
			conv = {
				id: conv.id,
				firstUser: JSON.parse(conv.firstUserJson),
				secondUser: JSON.parse(conv.secondUserJson),
				firstUserUnreadCount: conv.firstUserUnreadCount,
				secondUserUnreadCount: conv.secondUserUnreadCount
			}
			const unreadMsgs = (conv.firstUser.id === userId) ? conv.firstUserUnreadCount : conv.secondUserUnreadCount;
			let user = (conv.firstUser.id === userId) ? conv.secondUser : conv.firstUser;
			// user = {...user, connectionState: friendConnectionState(opt.conv.blockDb, userId, user.id)}
			user = {...user, connectionState: getBlockState(userId, user.id, instance.blockManager)}
			return ({
				id: conv.id,
				friend: user,
				unread_msg: unreadMsgs,
				presence: instance.connectedUsers.has(user.id) ? "online" : "offline"
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