import {FastifyReply, FastifyRequest, FastifyInstance} from 'fastify';
import { User } from '../models/user.js';
import { Friend, Friendship } from '../models/friendship.js';
import { UserController } from './UserController.js';

export class FriendshipController {
  static readonly ERR_ALREADY_FRIEND: string = 'The user is already a friend';
  static readonly ERR_NOT_A_FRIEND: string = 'The user is not a friend';
  static readonly ERR_RECORD_NOT_FOUND: string = 'No friend request was made from the provided user'
  static readonly ERR_UNEXCPECTED_ERR: string = 'An unexpected error occurred';

  static async get(request: FastifyRequest, reply: FastifyReply) {
    const fastify = request.server as FastifyInstance;
    const user: User = request.session.user;

    const friend_requests: Friendship[] = fastify.friendshipRepository.get(-1, user.id, user.id, 1);
    const result: Friend[] = friend_requests.map((friendship): Friend => ({
      username: friendship.sender_id == user.id ? friendship.sender_username : friendship.receiver_username,
      fullname: friendship.sender_id == user.id ? friendship.sender_fullname : friendship.receiver_fullname,
      avatar: friendship.sender_id == user.id ? friendship.sender_avatar : friendship.receiver_avatar,
      friends_since: friendship.updated_at
    }));
    const response = {
      success: true,
      data: result
    }
    reply.send(response)
	}

  static async getReceivedRequests(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;

    const friend_requests: Friendship[] = app.friendshipRepository.get(-1, -1, user.id, 0);
    const result: Friend[] = friend_requests.map((friendship): Friend => ({
      username: friendship.sender_username,
      fullname: friendship.sender_fullname,
      avatar: friendship.sender_avatar
    }));
    const response = {
      success: true,
      data: result
    }
    reply.send(response)
  }

	static async getSentRequests(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;

    const friend_requests: Friendship[] = app.friendshipRepository.get(-1, user.id, -1, 0);
    const result: Friend[] = friend_requests.map((friendship): Friend => ({
      username: friendship.receiver_username,
      fullname: friendship.receiver_fullname,
      avatar: friendship.receiver_avatar
    }));
    const response = {
      success: true,
      data: result
    }
    reply.send(response)
	}

  static async request(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;
    const payload = request.body as Pick<User, 'uid'>

    const target = app.usersRepository.findByUID(payload.uid);
    if (!target) {
      return reply.notFound(UserController.ERR_USER_NOT_FOUND);
    }

    app.friendshipRepository.insert({
      sender_id: user.id,
      receiver_id: target.id
    })
    const response = {
      success: true,
      data: null
    }
    reply.send(response)
	}

  static async approve(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;
    const payload = request.body as Pick<User, 'uid'>

    try {
      const target = app.usersRepository.findByUID(payload.uid);
      if (!target) {
        throw new Error(UserController.ERR_USER_NOT_FOUND);
      }
      const friendships: Friendship[] = app.friendshipRepository.get(-1, user.id, target.id);
      if (friendships.length == 0) {
        throw new Error(FriendshipController.ERR_RECORD_NOT_FOUND);
      }
      if (friendships[0].status == 1) {
        throw new Error(FriendshipController.ERR_ALREADY_FRIEND);
      }
      app.friendshipRepository.update(friendships[0].id, {
        status: 1  
      })
      const response = {
        success: true,
        data: null
      }
      return reply.send(response)
    } catch (err) {
      if (err instanceof Error)
        return reply.badRequest(err.message);
      return reply.internalServerError(FriendshipController.ERR_UNEXCPECTED_ERR);
    }

	}

  static async reject(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;
    const payload = request.body as Pick<User, 'uid'>

    try {
      const target = app.usersRepository.findByUID(payload.uid);
      if (!target) {
        throw new Error(UserController.ERR_USER_NOT_FOUND);
      }
      const friendships: Friendship[] = app.friendshipRepository.get(-1, user.id, target.id);
      if (friendships.length == 0) {
        throw new Error(FriendshipController.ERR_RECORD_NOT_FOUND);
      }
      if (friendships[0].status == 1) {
        throw new Error(FriendshipController.ERR_ALREADY_FRIEND);
      }
      app.friendshipRepository.delete(friendships[0].id)
      const response = {
        success: true,
        data: null
      }
      reply.send(response)
    } catch (err) {
      if (err instanceof Error)
        return reply.badRequest(err.message);
      return reply.internalServerError(FriendshipController.ERR_UNEXCPECTED_ERR);
    }
	}

  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const app: FastifyInstance = request.server;
    const user: User = request.session.user;
    const payload = request.body as Pick<User, 'uid'>

    try {
      const target = app.usersRepository.findByUID(payload.uid);
      if (!target) {
        throw new Error(UserController.ERR_USER_NOT_FOUND);
      }
      const friendships: Friendship[] = app.friendshipRepository.get(-1, user.id, target.id);
      if (friendships.length == 0) {
        throw new Error(FriendshipController.ERR_RECORD_NOT_FOUND);
      }
      if (friendships[0].status == 0) {
        throw new Error(FriendshipController.ERR_NOT_A_FRIEND);
      }
      app.friendshipRepository.delete(friendships[0].id)
      const response = {
        success: true,
        data: null
      }
      reply.send(response)
    } catch (err) {
      if (err instanceof Error)
        return reply.badRequest(err.message);
      return reply.internalServerError(FriendshipController.ERR_UNEXCPECTED_ERR);
    }
	}
}