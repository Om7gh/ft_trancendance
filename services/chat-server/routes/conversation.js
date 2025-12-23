import fp from 'fastify-plugin';

function conversationPlugin(instance, opt){

	function constructReply(userId){
		let conversations = opt.conv.convDb.filter((conv) => conv.user1.id === userId || conv.user2.id === userId);
		conversations = conversations.map((conv) => {
			let unreadMsgs = (conv.user1.id === userId) ? conv.user1UnreadCount : conv.user2UnreadCount;
			let user = (conv.user1.id === userId) ? conv.user2 : conv.user1;
			return ({
				id: conv.id,
				friend: user,
				unread_msg: unreadMsgs,
				presence: instance.connectedUsers.has(user.id) ? "online" : "offline"
			});
		});
		return (conversations);
	}
	
	instance.get("/conversations/:userId", async (req, reply) => {
		let constructedReply = constructReply(+req.params.userId);
		return (JSON.stringify(constructedReply));
	});
}

export default fp(conversationPlugin, {name: "conversationPlugin"});``