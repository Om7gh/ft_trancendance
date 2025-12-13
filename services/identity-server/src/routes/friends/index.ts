import {FastifyInstance} from 'fastify'
import {FriendshipController} from '../../controllers/FriendshipController' 

const plugin = async (fastify: FastifyInstance) => {
  const opts = {
    OnRequest: [fastify.authenticate],
  }

  fastify.get('/', opts, FriendshipController.get);

	fastify.get('/requests/received', opts, FriendshipController.getReceivedRequests);
  fastify.get('requests/sent', opts, FriendshipController.getSentRequests);

  fastify.patch('/new', opts, FriendshipController.request);
  fastify.patch('/approve', opts, FriendshipController.approve);
  fastify.post('/reject', opts, FriendshipController.reject);

  fastify.post('/delete', opts, FriendshipController.delete);
  
}

export default plugin;