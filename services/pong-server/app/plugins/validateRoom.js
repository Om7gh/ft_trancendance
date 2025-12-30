import Ajv from 'ajv';
import fp from 'fastify-plugin';
import roomSchema from '../schemas/roomSchema.js';

export default fp(async function validateRoomPlugin(fastify) {
  try {

    const ajv = new Ajv();
    
    const validateRoom = ajv.compile(roomSchema);
    
    fastify.decorate('validateRoom', validateRoom);
  } catch (e) {
    throw new Error(e)
  }
});
