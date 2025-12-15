// import { FastifyInstance } from 'fastify';

// import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
// import { UserController } from '../../controllers/UserController.js';
// import { PasswordController } from '../../controllers/PasswordController.js';

// import { updateUserSchema, updatePasswordSchema, newUserSchema } from '../../schemas/profile.js';

// const plugin: FastifyPluginAsyncTypebox  = async (fastify: FastifyInstance) => {
//   fastify.get('/', {
//     onRequest: [fastify.authenticate],
//   }, UserController.get)

//   // fastify.patch('/', {
//   //   onRequest: [fastify.authenticate],
//   //   schema: newUserSchema
//   // }, UserController.create)

//   fastify.patch('/', {
//     onRequest: [fastify.authenticate],
//     schema: updateUserSchema
//   }, UserController.update)

//   fastify.patch('/password', {
//     onRequest: [fastify.authenticate],
//     schema: {
//       body: updatePasswordSchema
//     }
//   }, PasswordController.updatePassword)

//   //TODO: To be implemented
//   // fastify.patch('/email', {
//   //   onRequest: [fastify.authenticate],
//   //   schema: updatePasswordSchema
//   // }, EmailController.updateEmail) // Use UserController if possible
// }

// export default plugin
