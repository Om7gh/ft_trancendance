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
			level: 'info',
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname',
					singleLine: false,
				},
			},
		},
}

const sqlite3Options = {
	"class": Database,
	pathToDb: process.env.DB_PATH
}

async function main() {
	const app = fastify(serverOptions);

	app
		.register(fastifyBetterSqlite3, sqlite3Options)
		.register(onRequestHook)
		.register(websocket)
		.register(messages)
		.register(contacts)
		.register(conversation);

	try {
		await app.ready();
		initDb(app.betterSqlite3);
		const addresss = await app.listen({
			port: process.env.PORT ?? 9004,
			host: "0.0.0.0"
		});
		app.log.info("Chat server is started.");
		app.log.info(`Ready to accept connections on ${addresss}`);
	}
	catch (error){
		app.log.error(error);
		process.exit(1);
	}
}

main();
