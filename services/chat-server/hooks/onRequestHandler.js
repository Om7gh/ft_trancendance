import fp from 'fastify-plugin';
import axios from 'axios';

function onRequestHook(instance, opt){
	async function onRequestHandler(req, reply){
		try {
			const cookie = req.headers.cookie;
			if (!cookie)
				throw new Error("No cookie is set");
			const response = await axios.request({
				url: "http://identity:4000/auths/userinfo",
				headers: {
					Cookie: cookie
				}
			});
			req.user = await response.data;
		}
		catch (err) {
			reply.code(401);
			reply.send(
				(err.message !== "No cookie is set")
				? "Authentication required"
				: err.message
			);
			return (reply);
		}
	}
	
	instance.addHook("onRequest", onRequestHandler);
}

export default fp(onRequestHook);