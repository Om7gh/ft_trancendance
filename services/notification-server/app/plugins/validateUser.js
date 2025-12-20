import Ajv from 'ajv';
import fp from 'fastify-plugin';
import userSchema from '../schemas/userSchema.js';

export default fp(async function validateUser(fastify, options) {
  const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,
    coerceTypes: true
  });
  
  const validateUser = ajv.compile(userSchema.body);

  fastify.decorate('validateUser', validateUser);
});
