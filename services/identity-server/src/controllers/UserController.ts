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
    static readonly ERR_INVALID_FIELD: string = ' is not valid';

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
                    continue;
                }

                if (part.type !== 'field') continue;

                const value = String(part.value);

                const fieldRules: Record<
                    string,
                    { min?: number; max?: number }
                > = {
                    bio: { max: 50 },
                    first_name: { min: 2, max: 10 },
                    last_name: { min: 2, max: 10 },
                };

                const rules = fieldRules[part.fieldname];
                if (!rules) continue;

                const len = value.length;

                if (
                    (rules.min !== undefined && len < rules.min) ||
                    (rules.max !== undefined && len > rules.max)
                ) {
                    return reply.badRequest(
                        value + UserController.ERR_INVALID_FIELD
                    );
                }

                payload[part.fieldname] = value;
            }

            if (Object.keys(payload)?.length === 0) {
                return reply.badRequest('No fields to update');
            }

            const updatedUser = fastify.usersRepository.update(
                user.id,
                payload
            );
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
            console.log(users);
            return reply.send(users);
        } catch (err: any) {
            console.error(err);
            return reply.notFound(UserController.ERR_USER_NOT_FOUND);
        }
    }

    private static async getStatistics(
        gameService: string,
        uid: string
    ): Promise<any> {
        try {
            const res = await axios.get(`${gameService}/statistics?uid=${uid}`);
            return res?.data;
        } catch (err: any) {
            return [];
        }
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
                chess: await UserController.getStatistics(
                    'http://chess:9000',
                    user.username
                ),
                pong: await UserController.getStatistics(
                    'http://pong:9001',
                    user.uid
                ),
                friends: this.friendshipRepository.getFriendships(user.id),
            };
            return reply.send(fullUser);
        } catch (err: any) {
            console.error(err);
            return reply.badRequest(err.message);
        }
    }
}
