import { type FastifyRequest, type FastifyReply } from 'fastify';
import { SqliteError } from 'better-sqlite3';
import { User } from '../models/user.js';

export class UserController {

  static async get(request: FastifyRequest, reply: FastifyReply) {
    const user = request.session.user;
    reply.send(user)
  }

  //TODO: Implement a getter for CONNECTIONS

  static async update(request: FastifyRequest, reply: FastifyReply) {
    const fastify = request.server;
    const { sub } = await request.verifyConfirmToken()
    if (!sub) {
      return reply.badRequest('invalid token')
    }
    const user = fastify.usersRepository.findByUID(sub as string)
    if (!user) {
      return reply.badRequest('user not found')
    }
    const data = request.body as User;
    try {
      fastify.usersRepository.update(user.id, data)
    } catch (err) {
      if (err instanceof SqliteError || err instanceof Error) {
        reply.badRequest(err.message);
      }
      reply.badRequest("An unknown error occurred");
    }
  }

}
