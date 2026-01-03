const { v4: uuid } = require('uuid');
const { URL } = require('url');
const send = require('../utils/send');
const { handleMatchmaking, removeFromQueue } = require('./matchMaking');
const { players, rooms, lastOpponents } = require('../utils/state');
const { syncBoard } = require('./syncBoard');
const { handleChat } = require('./chat');
const { handleDisconnect } = require('./handleDisconnection');
const { handleCheckmate } = require('./checkmate');
const {
  handleRematchRequest,
  handleRematchAccept,
  handleRematchDecline,
} = require('./rematch');
const { catchAsyncError } = require('../utils/catchAsyncError');

const chessHandler = catchAsyncError(async function (connection, req) {
  const app = req.server;

  const clientIP = req.socket.remoteAddress;
  let desiredId = null;
    const u = new URL(req.url, 'http://localhost');
    desiredId = u.searchParams.get('playerId');

  let playerId =
    desiredId && typeof desiredId === 'string' && desiredId.length <= 64
      ? desiredId
      : uuid();
  if (players.has(playerId)) {
    const existingPlayer = players.get(playerId);
    const oldConnection = existingPlayer.connection;

    if (existingPlayer?.roomId && rooms[existingPlayer.roomId]?.players?.length === 2) {
      endGameByDuplicateTab(app, existingPlayer.roomId, playerId, connection);
      if (oldConnection && oldConnection.readyState === 1) {
        try {
          oldConnection.close();
        } catch {}
      }
      existingPlayer.connection = connection;
      existingPlayer.roomId = null;
      console.log(`Duplicate-tab forfeit [${playerId}] from ${clientIP}`);
    } else {
    if (oldConnection && oldConnection.readyState === 1) {
      oldConnection.close();
    }
    existingPlayer.connection = connection;
    console.log(`Player reconnected [${playerId}] from ${clientIP}`);
    }
  } else {
    players.set(playerId, { connection, roomId: null, ip: clientIP });
    console.log(`New connection [${playerId}] from ${clientIP}`);
  }
  connection.on('message', (rawMsg) => {
    let msg;
    try {
      msg = JSON.parse(rawMsg);
    } catch {
      return send(connection, {
        type: 'error',
        message: 'Invalid JSON format',
      });
    }
    handleMessage(app, playerId, msg);
  });
  connection.on('close', () => handleDisconnect(app, playerId, connection));
})

const handleMessage = catchAsyncError(async function (app, playerId, msg) {
  const player = players.get(playerId);
  if (!player) {
    return;
  }

  const { type } = msg;
  switch (type) {
    case 'matchmaking':
      return handleMatchmaking(playerId, player.connection);
    case 'leaveMatchmaking':
      return removeFromQueue(playerId);
    case 'syncBoard':
      return syncBoard(
        playerId,
        msg.board,
        msg.currentTurn,
        msg.turns,
        msg.prevMove
      );
    case 'chat':
      return handleChat(playerId, msg.text);
    case 'checkmate':
      return handleCheckmate(app, playerId, msg.winner);
    case 'rematchRequest':
      return handleRematchRequest(playerId);
    case 'rematchAccept':
      return handleRematchAccept(playerId);
    case 'rematchDecline':
      return handleRematchDecline(playerId);
    default:
      console.log(`Unknown message type: ${type}`);
      if (player)
        send(player.connection, {
          type: 'error',
          message: 'Unknown message type',
        });
  }
})

setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of Object.entries(rooms)) {
    if (room.players.length === 2) {
      const a = room.players[0].playerId;
      const b = room.players[1].playerId;
      lastOpponents.set(a, b);
      lastOpponents.set(b, a);
    }

    const inactive =
      room.players.length === 0 && now - room.createdAt > 600_000;
    if (inactive) {
      delete rooms[roomId];
      console.log(`🧹 Cleaned up inactive room ${roomId}`);
    }
  }
}, 600_000);



function endGameByDuplicateTab(app, roomId, duplicatingPlayerId, reconnectingConnection) {
  const room = rooms[roomId];
  if (!room) return;

  const white = room.players.find((p) => p.team === 'WHITE') || null;
  const black = room.players.find((p) => p.team === 'BLACK') || null;
  const opponentSnapshot = room.players.find((p) => p.playerId !== duplicatingPlayerId) || null;
  if (!opponentSnapshot) return;

  const opponentPlayer = players.get(opponentSnapshot.playerId);
  const opponentConnection = opponentPlayer?.connection || opponentSnapshot.connection;

  send(opponentConnection, {
    type: 'gameOver',
    winner: opponentSnapshot.playerId,
    message: 'Opponent opened a second tab. You win by forfeit.',
  });

  send(reconnectingConnection, {
    type: 'gameOver',
    winner: opponentSnapshot.playerId,
    message: 'You lost: duplicate tab detected.',
  });

  const winnerTeam = opponentSnapshot.team === 'WHITE' ? 'WHITE' : 'BLACK';
  if (white?.playerId && black?.playerId && typeof app.recordGame === 'function') {
    app.recordGame({
      roomId,
      whiteId: white.playerId,
      blackId: black.playerId,
      winnerTeam,
      reason: 'duplicate_tab',
      moves: room.turns ?? 0,
      startedAt: room.createdAt ?? null,
      endedAt: Math.floor(Date.now() / 1000),
    });
  }

  if (white?.playerId && black?.playerId) {
    lastOpponents.set(white.playerId, black.playerId);
    lastOpponents.set(black.playerId, white.playerId);
  }

  const a = players.get(duplicatingPlayerId);
  const b = players.get(opponentSnapshot.playerId);
  if (a) a.roomId = null;
  if (b) b.roomId = null;

  delete rooms[roomId];
}

module.exports = { chessHandler };
