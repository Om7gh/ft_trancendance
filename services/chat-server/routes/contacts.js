import fp from 'fastify-plugin'
import findConversation from "../utils/findConversatoin.js" 
import axios from 'axios';

function contactPlugin(instance, opt){
    function responseNormelizer(response){
        return response.map((user) => {
            const {id, first_name: name, avatar: photo_url } = user; 
            return ({
                id: 0,
                friend: {id, name, photo_url},
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
        return (response.data.data);
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
                findConversation(opt.contacts.convDB, req.user.id, contact.id) === undefined
            )
        });

		return (responseNormelizer(filterdContacts));
    });
}

export default fp(contactPlugin, {name: 'contactsPlugin'});