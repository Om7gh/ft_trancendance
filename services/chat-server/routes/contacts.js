import axios from 'axios';
import fp from 'fastify-plugin';
// import findConversation from "../utils/findConversatoin.js";
// import friendConnectionState from '../utils/friendConnectionState.js';
import getBlockState from '../utils/getBlockState.js';

function contactPlugin(instance, opt){
	function responseNormelizer(response, clientId){
		return response.map((user) => {
			const {id, username: name, avatar: photo_url } = user; 
			return ({
				id: 0,
				friend: {
					id: id,
					name: name,
					photo_url: photo_url,
					connectionState: getBlockState(clientId, user.id, instance.blockManager)
					// connectionState: friendConnectionState(opt.contacts.blockDb, clientId, user.id)
				},
				unread_msg: 0,
				presence: instance.connectedUsers.has(id) ? "online" : "offline"
			})
		} 
	);
	}
	
	async function getContacts(req){
		const response = await axios.request({
			url: "http://identity:4000/friends",
			headers:{
				Cookie: req.headers.cookie
			}
		});
		return (response.data);
	}

	instance.get("/contacts", async (req, reply) => {

		try {
			var contacts = await getContacts(req);
		}
		catch (error){
			return (error);
		}
		const filterdContacts = contacts.filter((contact) => {
			return (
				// !findConversation(opt.contacts.convDB, req.user.id, contact.id)
				!instance.conversationManager.hasConversation(req.user.id, contact.id)
			)
		});

		return (responseNormelizer(filterdContacts, req.user.id));
	});
}

export default fp(contactPlugin, {name: 'contactsPlugin'});