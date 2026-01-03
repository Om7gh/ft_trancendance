import Ajv from 'ajv';
import fp from 'fastify-plugin';
import userSchema from '../schemas/userSchema.js';

export default fp(async function validateUserPlugin(fastify, options) {
  try {
    const ajv = new Ajv();
    const validateUser = ajv.compile(userSchema);
    fastify.decorate('validateUser', validateUser);
  } catch (e) {
    throw new Error(e)
  }
});
