const { getPlayerGameHistory, getGameStats } = require('../repositories');

const gameHistory = async function (req, rep) {
  try {
    const { username } = req.query;
    
    if (!username) {
      return rep.status(400).send({
        error: 'Missing username parameter'
      });
    }

    console.log('🔍 Fetching game history for:', username);
    console.log('🔍 Database instance:', !!req.server.db);
    
    const history = await getPlayerGameHistory(req.server.db, username);
    const stats = await getGameStats(req.server.db, username);
    
    console.log('📊 History results:', history.length, 'games');
    console.log('📊 Stats:', stats);

    return rep.send({
      success: true,
      stats: {
        totalGames: stats.totalGames || 0,
        wins: stats.wins || 0,
        losses: stats.losses || 0,
        draws: stats.draws || 0,
        winRate: stats.totalGames > 0 
          ? ((stats.wins / stats.totalGames) * 100).toFixed(2) 
          : '0.00'
      },
      history: history.map(game => ({
        ...game,
        playerTeam: game.whitePlayerId === username ? 'WHITE' : 'BLACK',
        opponent: game.whitePlayerId === username 
          ? game.blackPlayerId 
          : game.whitePlayerId,
        result: game.winnerTeam === 'DRAW' 
          ? 'DRAW'
          : ((game.winnerTeam === 'WHITE' && game.whitePlayerId === username) ||
             (game.winnerTeam === 'BLACK' && game.blackPlayerId === username))
          ? 'WIN'
          : 'LOSS'
      }))
    });
  } catch (error) {
    req.server.log.error('Error fetching game history:', error.message);
   throw error
  }
};

module.exports = { gameHistory };
