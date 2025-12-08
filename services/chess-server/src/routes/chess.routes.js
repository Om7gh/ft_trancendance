const fp = require('fastify-plugin');
const { chessHandler } = require('../controllers/chess');
const { gameHistory } = require('../controllers/gameHistory');
const { pieceCustomization } = require('../controllers/gameCustomization');

const chessRoutes = async function (fastify) {
  fastify.addHook('onRequest', async function (req, rep) {
    
  });
  fastify.get('/game/chess', { websocket: true }, chessHandler);
  fastify.get('/game/chess/history', gameHistory);
  fastify.get('/game/chess/customization/:username', pieceCustomization);
};

module.exports = fp(chessRoutes);
