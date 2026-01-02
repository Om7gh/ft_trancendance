const { v4: uuid } = require('uuid');
const send = require('../utils/send');
const { players, rooms } = require('../utils/state');
const { catchAsyncError } = require('../utils/catchAsyncError');

const matchmakingQueue = []; // {playerId, player socket}

function handleMatchmaking(playerId, connection) {
  if (matchmakingQueue.some((p) => p.playerId === playerId)) {
    send(connection, {
      type: 'error',
      message: 'You are already in the matchmaking queue',
    });
    return;
  }
  matchmakingQueue.push({ playerId, connection });

  send(connection, {
    type: 'enterMatchmaking',
    gameOver: false,
  });

  if (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();

    if (player1.playerId === player2.playerId) {
      matchmakingQueue.unshift(player1);
      send(player1.connection, {
        type: 'error',
        message: 'Cannot play against yourself. Waiting for another player...',
      });
      return;
    }
    createMatch(player1, player2);
  }
}

const createMatch = catchAsyncError(function (player1, player2) {
  const roomId = uuid();
  rooms[roomId] = {
    players: [
      {
        playerId: player1.playerId,
        connection: player1.connection,
        team: 'WHITE',
      },
      {
        playerId: player2.playerId,
        connection: player2.connection,
        team: 'BLACK',
      },
    ],
    board: null,
    currentTurn: 'WHITE',
    turns: 1,
    createdAt: Date.now(),
  };

  const p1 = players.get(player1.playerId) || {};
  const p2 = players.get(player2.playerId) || {};
  players.set(player1.playerId, { ...p1, connection: player1.connection, roomId });
  players.set(player2.playerId, { ...p2, connection: player2.connection, roomId });

  send(player1.connection, {
    type: 'gameStart',
    yourTeam: 'WHITE',
    opponentConnected: true,
    opponentName: player2.playerId,
    opponnet: player2.playerId,
    roomId,
  });

  send(player2.connection, {
    type: 'gameStart',
    yourTeam: 'BLACK',
    opponentConnected: true,
    opponentName: player1.playerId,
    opponnet: player1.playerId,
    roomId,
  });
})

function removeFromQueue(playerId) {
  const index = matchmakingQueue.findIndex((p) => p.playerId === playerId);
  if (index !== -1) matchmakingQueue.splice(index, 1);
}

module.exports = { handleMatchmaking, removeFromQueue };
