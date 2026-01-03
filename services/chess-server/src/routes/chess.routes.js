const fp = require('fastify-plugin');
const { chessHandler } = require('../controllers/chess');
const { gameHistory } = require('../controllers/gameHistory');
const { getStats } = require('../controllers/stats');
const onRequest = require("../plugin/onRequest")

const chessRoutes = async function (fastify) {
  fastify.get('/game/chess', { onRequest: [onRequest] ,websocket: true }, chessHandler);
  fastify.get('/game/chess/history', {onRequest: [onRequest] } , gameHistory);
  fastify.get('/statistics', getStats);
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });
};

module.exports = fp(chessRoutes);
