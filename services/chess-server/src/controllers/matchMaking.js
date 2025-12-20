const { v4: uuid } = require('uuid');
const send = require('../utils/send');
const { players, rooms } = require('../utils/state');

const matchmakingQueue = []; // {playerId, player socket}
let i = 0;
function handleMatchmaking(playerId, connection) {
  console.log('playerID = ', playerId);
  console.log(players);
  i++;
  console.log(i);
  if (players.has(playerId)) {
    const { roomId } = players.get(playerId);
    const room = rooms[roomId];

    if (room) {
      console.log(room);
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

      console.log(`Player ${playerId} rejoined room ${roomId}`);
      return;
    }

    players.delete(playerId);
  }

  // ✅ 2. Prevent duplicate queue entry
  if (matchmakingQueue.some((p) => p.playerId === playerId)) {
    console.log(`Player ${playerId} is already in matchmaking queue`);
    return;
  }

  // ✅ 3. Normal matchmaking
  matchmakingQueue.push({ playerId, connection });

  send(connection, {
    type: 'enterMatchmaking',
    gameOver: false,
  });

  if (matchmakingQueue.length >= 2) {
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();
    createMatch(player1, player2);
  }
}

function createMatch(player1, player2) {
  Object.keys(rooms).forEach((key) => {
    const value = user[key];
    console.log(value);
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
