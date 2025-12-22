import axios from 'axios';
import { SqliteError } from 'better-sqlite3';
import {
    type FastifyReply,
    type FastifyRequest,
    FastifyInstance,
} from 'fastify';
import { asUserInfo } from '../dto/user-dto.js';
import { User } from '../models/user.js';
import { UsernameBody } from '../schemas/auth.js';

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
        } catch (err: any) {
            console.error(err);
            return reply.notFound('no user found');
        }
    }

    private static async getStatistics(gameService: string, uid: string) {
        const res = await axios.get(`${gameService}/statistics?uid=${uid}`);
        return res?.data;
    }

    static async user(
        this: FastifyInstance,
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const { username } = request.params as UsernameBody;
            const user = this.usersRepository.findByUsername(username);
            if (!user) {
                return reply.notFound('--- user not found ---');
            }

            const fullUser = {
                user: asUserInfo(user),
                // chess:
                //     (await UserController.getStatistics(
                //         'http://chess:9000',
                //         user.uid
                //     )) || null,
                pong:
                    (await UserController.getStatistics(
                        'http://pong:9001',
                        user.uid
                    )) || null,
                friends: this.friendshipRepository.getFriendships(user.id)
            };
            return reply.send(fullUser);
        } catch (err: any) {
            console.error(err);
            return reply.badRequest(err.message);
        }
    }
}
