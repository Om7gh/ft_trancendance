const fp = require('fastify-plugin');
const { chessHandler } = require('../controllers/chess');
const { gameHistory } = require('../controllers/gameHistory');
const { getStats } = require('../controllers/stats');

const chessRoutes = async function (fastify) {

  fastify.get('/game/chess', { websocket: true }, chessHandler);
  fastify.get('/game/chess/history', gameHistory);
  fastify.get('/statistics', getStats);
};

module.exports = fp(chessRoutes);
