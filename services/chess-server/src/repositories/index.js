const getPieceStyle = (db, username) => {
  return db
    .prepare(
      `
            SELECT pieces FROM players WHERE username = ?
        `
    )
    .get(username);
};

const getPlayerGameHistory = (db, username) => {
  return db
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
        WHERE white_player_id = ? OR black_player_id = ?
        ORDER BY ended_at DESC
        LIMIT 50
      `
    )
    .all(username, username);
};

const getGameStats = (db, username) => {
  return db
    .prepare(
      `
        SELECT 
          COUNT(*) as totalGames,
          SUM(CASE 
            WHEN (winner_team = 'WHITE' AND white_player_id = ?) OR 
                 (winner_team = 'BLACK' AND black_player_id = ?) 
            THEN 1 ELSE 0 
          END) as wins,
          SUM(CASE 
            WHEN (winner_team = 'BLACK' AND white_player_id = ?) OR 
                 (winner_team = 'WHITE' AND black_player_id = ?) 
            THEN 1 ELSE 0 
          END) as losses,
          SUM(CASE WHEN winner_team = 'DRAW' THEN 1 ELSE 0 END) as draws
        FROM games
        WHERE white_player_id = ? OR black_player_id = ?
      `
    )
    .get(username, username, username, username, username, username);
};

module.exports = { getPieceStyle, getPlayerGameHistory, getGameStats };
