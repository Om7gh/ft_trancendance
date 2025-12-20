import { SqliteError } from 'better-sqlite3';
import {
    type FastifyReply,
    type FastifyRequest,
    FastifyInstance,
} from 'fastify';
import { User } from '../models/user.js';

export class UserController {
    static readonly ERR_USER_NOT_FOUND: string = 'User not found';

    static async get(request: FastifyRequest, reply: FastifyReply) {
        const user = request.session.user;
        reply.send(user);
    }

    //TODO: Implement a getter for CONNECTIONS

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const fastify = request.server;
        const data = request.body as User;
        const user = request.session.user;

        try {
            fastify.usersRepository.update(user.id, data);
            const response = {
                success: true,
                message: 'Updated',
                next: null,
            };
            return reply.send(response);
        } catch (err) {
            if (err instanceof SqliteError || err instanceof Error) {
                return reply.badRequest(err.message);
            }
            return reply.badRequest('An unknown error occurred');
        }
    }

    static async search(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const query = (request.query as any).q;
            const limit = parseInt((request.query as any).limit) || 50;

            if (!query || query.trim() === '') {
                return reply
                    .status(400)
                    .send({ error: 'Query parameter "q" is required' });
            }

            const users = this.usersRepository.searchUsers(query, limit);
            return reply.send({ users });
        } catch (err) {
            console.error(err);
            return reply.notFound('no user found');
        }
    }
}
