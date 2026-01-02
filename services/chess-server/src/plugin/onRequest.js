const axios = require("axios")
module.exports = async function onRequestHook(request, reply) {
        try {
            const cookie = request.headers.cookie;

            if (!cookie) 
                throw new Error("No cookie");
            const response = await axios.get("http://identity:4000/auth/userinfo", {
                headers: {
                    Cookie: cookie,
                }
            });
            request.user = await response.data;
        } catch (err) {
            reply.code(401)
            reply.send((err.message !== "No cookie")
                ? "Refresh your access token"
                : err.message
            );
            return reply;
        }
    };
