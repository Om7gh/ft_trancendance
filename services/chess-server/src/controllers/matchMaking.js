const { v4: uuid } = require('uuid');
const send = require('../utils/send');
const { players, rooms } = require('../utils/state');

const matchmakingQueue = []; // {playerId, player socket}
function handleMatchmaking(playerId, connection) {
  if (players.has(playerId)) {
    const { roomId } = players.get(playerId);
    const room = rooms[roomId];

    if (room) {
      const player = room.players.find((p) => p.playerId === playerId);
      if (player) {
        player.connection = connection;
      }

      players.set(playerId, { connection, roomId });

      send(connection, {
        type: 'gameResume',
        roomId,
        board: room.board,
        yourTeam: player.team,
        currentTurn: room.currentTurn,
        turns: room.turns,
        opponentConnected: room.players.length === 2,
      });

      return;
    }

    players.delete(playerId);
  }

  if (matchmakingQueue.some((p) => p.playerId === playerId)) {
    console.log(`⚠️ Player ${playerId} is already in matchmaking queue`);
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
      console.log(`⚠️ Player ${player1.playerId} attempted to match with themselves`);
      // Put one back in the queue
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

function createMatch(player1, player2) {
  console.log('🎮 Creating match between:', {
    player1Id: player1.playerId,
    player2Id: player2.playerId
  });
  
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

  console.log('🎮 Room created:', {
    roomId,
    players: rooms[roomId].players.map(p => ({ playerId: p.playerId, team: p.team }))
  });

  players.set(player1.playerId, { connection: player1.connection, roomId });
  players.set(player2.playerId, { connection: player2.connection, roomId });

  send(player1.connection, {
    type: 'gameStart',
    yourTeam: 'WHITE',
    opponentConnected: true,
    roomId,
  });

  send(player2.connection, {
    type: 'gameStart',
    yourTeam: 'BLACK',
    opponentConnected: true,
    roomId,
  });
}

function removeFromQueue(playerId) {
  const index = matchmakingQueue.findIndex((p) => p.playerId === playerId);
  if (index !== -1) matchmakingQueue.splice(index, 1);
}

module.exports = { handleMatchmaking, removeFromQueue };
