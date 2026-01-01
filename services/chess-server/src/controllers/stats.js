const { getGameStats, getPlayerGameHistory } = require("../repositories");

const getStats = catchAsyncError(async function(req, rep) {
   try {
    const { uid } = req.query;
    
    if (!uid) {
      return rep.status(400).send({
        error: 'Missing uid parameter'
      });
    }

    const history = getPlayerGameHistory(req.server.db, uid);
    const stats = getGameStats(req.server.db, uid);

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
        playerTeam: game.whitePlayerId === uid ? 'WHITE' : 'BLACK',
        opponent: game.whitePlayerId === uid 
          ? game.blackPlayerId 
          : game.whitePlayerId,
        result: game.winnerTeam === 'DRAW' 
          ? 'DRAW'
          : ((game.winnerTeam === 'WHITE' && game.whitePlayerId === uid) ||
             (game.winnerTeam === 'BLACK' && game.blackPlayerId === uid))
          ? 'WIN'
          : 'LOSS'
      }))
    });
  } catch (error) {
    req.server.log.error('Error fetching game history:', error);
    return rep.status(500).send({
      error: 'Failed to fetch game history'
    });
  }
})

module.exports = {getStats}