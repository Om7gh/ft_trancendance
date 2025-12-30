import fastify from 'fastify';
import Database from 'better-sqlite3'
import fastifyBetterSqlite3 from '@punkish/fastify-better-sqlite3';
import websocket from '@fastify/websocket';
import onRequestHook from "../hooks/onRequestHandler.js"
import contacts from "../routes/contacts.js";
import messages from "../routes/messages.js";
import conversation from "../routes/conversation.js";
import initDb from '../database/initDb.js';

const serverOptions = {
	logger: {
		level: "debug",
		transport: {
			target: 'pino-pretty'
		}
	}
}

const sqlite3Options = {
	"class": Database,
	pathToDb: "/var/lib/sqlite/chat.db"
}

async function main() {
	const app = fastify(serverOptions);

	app.register(fastifyBetterSqlite3, sqlite3Options);
	
	app.register(onRequestHook);
	
	app.register(websocket);
	
	app.register(messages);

	app.register(contacts);

	app.register(conversation);

	app.ready()
	.then(() => {
		initDb(app.betterSqlite3);
	})
	.catch((err) => {
		app.log.info(`error accured: ${err}`);
	});

	app.listen({port: 9004, host: "0.0.0.0"})
	.then((address) => {
		app.log.info(`Chat server is started! Ready to accept connections on ${address}`);
	})
	.catch((err) => {
		app.log.info(`error accured: ${err}`);
	});
}

main();