import {FastifyInstance} from 'fastify'
import {FriendshipController} from '../../controllers/FriendshipController.js' 

const plugin = async (fastify: FastifyInstance) => {
  const opts = {
    onRequest: [fastify.authenticate],
  }

  // Friend related routes
  fastify.get   ('/', opts, FriendshipController.get);
  fastify.delete('/:uid', opts, FriendshipController.delete);

  // Friend requestes related routes
	fastify.get   ('/requests/received', opts, FriendshipController.getReceivedRequests);
  fastify.get   ('/requests/sent', opts, FriendshipController.getSentRequests);
  fastify.post  ('/requests', opts, FriendshipController.request);

  // Approve routes
  fastify.patch ('/requests/:uid/approve', opts, FriendshipController.approve);
  // fastify.patch ('/requests/approve', opts, FriendshipController.approveAll);

  // Reject routes
  fastify.delete('/requests/:uid/reject', opts, FriendshipController.reject);
  // fastify.delete('/requests/reject', opts, FriendshipController.rejectAll);

}

export default plugin;