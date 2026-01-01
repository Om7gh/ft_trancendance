const { catchAsyncError } = require("../utils/catchAsyncError");

const getPlayerGameHistory = catchAsyncError((db, username) => {

  const result = db
    .prepare(
      `
        SELECT 
          id,
          room_id as roomId,
          white_player_id as whitePlayerId,
          black_player_id as blackPlayerId,
          winner_team as winnerTeam,
          reason,
          moves,
          started_at as startedAt,
          ended_at as endedAt
        FROM games
        WHERE LOWER(white_player_id) = LOWER(?) OR LOWER(black_player_id) = LOWER(?)
        ORDER BY ended_at DESC
        LIMIT 50
      `
    )
    .all(username, username);
  
  return result;
});

const getGameStats = catchAsyncError((db, username) => {
  const result = db
    .prepare(
      `
        SELECT 
          COUNT(*) as totalGames,
          SUM(CASE 
            WHEN (winner_team = 'WHITE' AND LOWER(white_player_id) = LOWER(?)) OR 
                 (winner_team = 'BLACK' AND LOWER(black_player_id) = LOWER(?)) 
            THEN 1 ELSE 0 
          END) as wins,
          SUM(CASE 
            WHEN (winner_team = 'BLACK' AND LOWER(white_player_id) = LOWER(?)) OR 
                 (winner_team = 'WHITE' AND LOWER(black_player_id) = LOWER(?)) 
            THEN 1 ELSE 0 
          END) as losses,
          SUM(CASE WHEN winner_team = 'DRAW' THEN 1 ELSE 0 END) as draws
        FROM games
        WHERE LOWER(white_player_id) = LOWER(?) OR LOWER(black_player_id) = LOWER(?)
      `
    )
    .get(username, username, username, username, username, username);
  return result;
});

module.exports = { getPlayerGameHistory, getGameStats };
