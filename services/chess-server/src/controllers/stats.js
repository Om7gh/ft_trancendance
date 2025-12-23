const { getGameStats } = require("../repositories");

const getStats = async function(req, rep) {
    const {uid} = req.query;
    if (!uid)
       return rep.code(400).send({message: "Missing Username"})
     const stats = getGameStats(req.server.db, uid);
     return rep.send({
      stats: {
        totalGames: stats.totalGames || 0,
        wins: stats.wins || 0,
        losses: stats.losses || 0,
        draws: stats.draws || 0,
        winRate: stats.totalGames > 0 
          ? ((stats.wins / stats.totalGames) * 100).toFixed(2) 
          : '0.00'
      },
      })
}

module.exports = {getStats}