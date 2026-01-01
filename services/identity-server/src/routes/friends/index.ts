import {FastifyInstance} from 'fastify'
import {FriendshipController} from '../../controllers/FriendshipController.js' 
import { uidBodySchema, uidParamsSchema } from '../../schemas/friendship.js'

const plugin = async (fastify: FastifyInstance) => {
  const opts = {
    onRequest: [fastify.authenticate],
  }

  // Friend related routes
  fastify.get   ('/', opts, FriendshipController.get);
  fastify.get   ('/:uid', {...opts, schema: {...uidParamsSchema}}, FriendshipController.getFriend);
  fastify.delete('/:uid', {...opts, schema: {...uidParamsSchema}}, FriendshipController.delete);

  // Friend requestes related routes
  fastify.get   ('/requests/received', opts, FriendshipController.getReceivedRequests);
  fastify.get   ('/requests/sent', opts, FriendshipController.getSentRequests);
  fastify.post  ('/requests', {...opts, schema: {...uidBodySchema}}, FriendshipController.request);

  // Approve routes
  fastify.put   ('/requests/:uid/approve', {...opts, schema: {...uidParamsSchema}}, FriendshipController.approve);

  // Reject routes
  fastify.delete('/requests/:uid/reject', {...opts, schema: {...uidParamsSchema}}, FriendshipController.reject);
  fastify.delete('/requests/:uid/cancel', {...opts, schema: {...uidParamsSchema}}, FriendshipController.cancelRequest);

}

export default plugin;
