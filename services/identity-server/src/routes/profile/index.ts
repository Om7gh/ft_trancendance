import { FastifyInstance } from 'fastify';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { UserController } from '../../controllers/UserController.js';
import { PasswordController } from '../../controllers/PasswordController.js';

import { updatePasswordSchema } from '../../schemas/profile.js';

const plugin: FastifyPluginAsyncTypebox  = async (fastify: FastifyInstance) => {
  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, UserController.get)

  fastify.patch('/', {
    onRequest: [fastify.authenticate],
  }, UserController.update)

  fastify.patch('/password', {
    onRequest: [fastify.authenticate],
    schema: {
      body: updatePasswordSchema
    }
  }, PasswordController.updatePassword)
}

export default plugin
