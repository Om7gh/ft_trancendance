import fastify from 'fastify';
import websocket from '@fastify/websocket';
import cors from '@fastify/cors';
import contacts from "../routes/contacts.js";
import messages from "../routes/messages.js";
import conversation from "../routes/conversation.js";

const serverOptions = {
	logger: {
		level: "debug",
		transport: {
			target: 'pino-pretty'
		}
	}
}

async function main() {

	let convDb = [];
	let msgDb = [];

	let app = fastify(serverOptions);

	app.register(cors);
	
	app.register(websocket);
	
	app.register(messages, {
		msg: {
			convDb: convDb,
			msgDb: msgDb
		}
	});

	app.register(contacts, {
		contacts: { convDB: convDb }
	});

	app.register(conversation, {
		conv: { convDb: convDb }
	});

	app.listen({port: 9004})
	.then((address) => {
		app.log.info(`Chat server is started! Ready to accept connections on ${address}`);
	})
	.catch((err) => {
		app.log.info(`error accured: ${err}`);
	});
}

main();