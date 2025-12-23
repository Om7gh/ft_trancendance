import fp from 'fastify-plugin'
import contacts from "../utils/friends.js";
import findConversation from "../utils/findConversatoin.js" 

function contactPlugin(instance, opt){
    function responseNormelizer(response){
        return response.map((user) => ({
            id: 0,
            friend: user,
            unread_msg: 0,
            presence: instance.connectedUsers.has(user.id) ? "online" : "offline"
        }));
    }
    
    instance.get("/contacts/:userId", async (req, reply) => {
        const requestBy = +req.params.userId;
		let filterdContacts = contacts.filter((friend) => findConversation(opt.contacts.convDB, requestBy, friend.id) === undefined);
		return (responseNormelizer(filterdContacts));
    });
}

export default fp(contactPlugin, {name: 'contactsPlugin'});