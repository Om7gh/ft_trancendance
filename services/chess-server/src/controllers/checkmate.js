const send = require('../utils/send');
const { rooms, players, lastOpponents } = require('../utils/state');

catchAsyncError(async function handleCheckmate(app, playerId, winnerTeam) {
  const player = players.get(playerId);
  if (!player || !player.roomId) return;

  const room = rooms[player.roomId];
  if (!room) return;

  const winner =
    winnerTeam === 'WHITE' || winnerTeam === 'BLACK' ? winnerTeam : 'DRAW';

  for (const p of room.players) {
    send(p.connection, {
      type: 'gameOver',
      winner,
      message: winner === 'DRAW' ? 'Draw by stalemate/checkmate' : 'Checkmate',
    });
  }

    const white = room.players.find((p) => p.team === 'WHITE');
    const black = room.players.find((p) => p.team === 'BLACK');
    if (white?.playerId && black?.playerId) {
      console.log('🎮 Recording game result:', {
        roomId: player.roomId,
        white: white.playerId,
        black: black.playerId,
        winner,
        hasRecordGame: typeof app.recordGame === 'function'
      });
      console.log("---------------> ", white.playerId, black.playerId);
      app.recordGame({
        roomId: player.roomId,
        whiteId: white.playerId,
        blackId: black.playerId,
        winnerTeam: winner,
        reason: winner === 'DRAW' ? 'draw' : 'checkmate',
        moves: room.turns ?? 0,
        startedAt: room.createdAt ?? null,
        endedAt: Math.floor(Date.now() / 1000),
      });
      
    } else {
      console.warn('Skipping recordGame (checkmate): missing IDs', {
        white: white?.playerId,
        black: black?.playerId,
      });
    }
  if (room.players.length === 2) {
    const a = room.players[0].playerId;
    const b = room.players[1].playerId;
    lastOpponents.set(a, b);
    lastOpponents.set(b, a);
    const pa = players.get(a);
    const pb = players.get(b);
    if (pa) pa.roomId = null;
    if (pb) pb.roomId = null;
  }

  const rid = player.roomId;
  delete rooms[rid];
})

module.exports = { handleCheckmate };
