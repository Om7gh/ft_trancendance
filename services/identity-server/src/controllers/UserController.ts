import axios from 'axios';
import {
    type FastifyReply,
    type FastifyRequest,
    FastifyInstance,
} from 'fastify';
import { asUserInfo } from '../dto/user-dto.js';
import { UsernameBody } from '../schemas/auth.js';
import { saveUploadedAvatar } from '../utils/avatar-utils.js';

export class UserController {
    static readonly ERR_USER_NOT_FOUND: string = 'User not found';
    static readonly ERR_EMPTY_FIELD: string = ' must not be empty';

    static async get(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user;
        reply.send(user);
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const fastify = request.server;
        const user = request.user;
        
        try {
            const payload: Record<string, string> = {};

            for await (const part of request.parts()) {
                if (part.type === 'file' && part.fieldname === 'avatar') {
                    payload.avatar = await saveUploadedAvatar(
                        user.uid,
                        user.username,
                        part
                    );
                } else if (part.type === 'field') {
                    if (part.fieldname == "first_name" || part.fieldname == "last_name") {
                        if (payload[part.fieldname].length == 0) {
                            return reply.badRequest(payload[part.fieldname] + UserController.ERR_EMPTY_FIELD);
                        }

                    }
                    payload[part.fieldname] = String(part.value);
                }
            }

            if (Object.keys(payload).length === 0) {
                return reply.badRequest('No fields to update');
            }

            const updatedUser = fastify.usersRepository.update(user.id, payload);
            request.user = updatedUser;
            return reply.send(asUserInfo(request.user));
        } catch (err: any) {
            return reply.badRequest(err.message);
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
            console.log(users)
            return reply.send(users);
        } catch (err: any) {
            console.error(err);
            return reply.notFound(UserController.ERR_USER_NOT_FOUND);
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
                return reply.notFound(UserController.ERR_USER_NOT_FOUND);
            }
            const fullUser = {
                user: asUserInfo(user),
                chess:
                    (await UserController.getStatistics(
                        'http://chess:9000',
                        user.username
                    )) || null,
                pong:
                    (await UserController.getStatistics(
                        'http://pong:9001',
                        user.uid
                    )) || null,
                friends: this.friendshipRepository.getFriendships(user.id),
            };
            return reply.send(fullUser);
        } catch (err: any) {
            console.error(err);
            return reply.badRequest(err.message);
        }
    }
}
