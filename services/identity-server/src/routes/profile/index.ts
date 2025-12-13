import { FastifyInstance } from 'fastify';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { UserController } from '../../controllers/UserController.js';
import { PasswordController } from '../../controllers/PasswordController.js';

import { updateUserSchema, updatePasswordSchema } from '../../schemas/profile.js';

const plugin: FastifyPluginAsyncTypebox  = async (fastify: FastifyInstance) => {
  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, UserController.get)

  fastify.patch('/new', {
    onRequest: [fastify.authenticate],
    schema: updateUserSchema
  }, UserController.update)

  fastify.patch('/update', {
    onRequest: [fastify.authenticate],
    schema: updateUserSchema // User other schema
  }, UserController.update)

  fastify.patch('/update-password', {
    onRequest: [fastify.authenticate],
    schema: {
      body: updatePasswordSchema
    }
  }, PasswordController.updatePassword)

  //TODO: To be implemented
  // fastify.patch('/update-email', {
  //   onRequest: [fastify.authenticate],
  //   schema: updatePasswordSchema
  // }, EmailController.updateEmail)
}

export default plugin
