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
import { saveUploadedAvatar } from '../utils/avatar-utils.js';

export class UserController {
    static readonly ERR_USER_NOT_FOUND: string = 'User not found';

    static async get(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user;
        reply.send(user);
    }

    static async update(request: FastifyRequest, reply: FastifyReply) {
        const fastify = request.server;
        const user = request.user;
        
        try {
            let bio: string | undefined;
            let avatar: string | undefined;

            for await (const part of request.parts()) {
                if (part.type === 'file' && part.fieldname === 'avatar') {
                    avatar = await saveUploadedAvatar(
                        user.uid,
                        user.username,
                        part
                    );
                } else if (part.type === 'field' && part.fieldname === 'bio') {
                    bio = String(part.value);
                }
            }

            const updateData: Partial<User> = {};
            if (avatar !== undefined) updateData.avatar = avatar;
            if (bio !== undefined) updateData.bio = bio;

            fastify.usersRepository.update(user.id, updateData);
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
            console.log(users)
            return reply.send(users);
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
