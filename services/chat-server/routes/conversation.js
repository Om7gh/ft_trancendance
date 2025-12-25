import fp from 'fastify-plugin';
import friendConnectionState from '../utils/friendConnectionState.js';

function conversationPlugin(instance, opt){

	function constructReply(userId){
		let conversations = opt.conv.convDb.filter((conv) => conv.user1.id === userId || conv.user2.id === userId);
		conversations = conversations.map((conv) => {
			let unreadMsgs = (conv.user1.id === userId) ? conv.user1UnreadCount : conv.user2UnreadCount;
			let user = (conv.user1.id === userId) ? conv.user2 : conv.user1;
			user = {...user, connectionState: friendConnectionState(opt.conv.blockDb, userId, user.id)}
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