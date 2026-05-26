// Slayers — Multiplayer WebSocket Relay Server
// Run: npm install && npm start
// Players connect and are assigned to rooms. The server is a pure relay —
// each client is authoritative for their own character. The host's enemy
// death events are broadcast so all clients stay in sync.

const WebSocket = require('ws');
const PORT = process.env.PORT || 8765;
const wss  = new WebSocket.Server({ port: PORT });

const rooms = {}; // roomId → Set<ws>

wss.on('connection', (ws) => {
  ws._roomId   = null;
  ws._playerId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      case 'host': {
        const roomId = genCode();
        rooms[roomId] = new Set([ws]);
        ws._roomId   = roomId;
        ws._playerId = 'p1';
        send(ws, { type: 'hosted', roomId, playerId: 'p1' });
        console.log(`[host] room ${roomId} created`);
        break;
      }

      case 'join': {
        const roomId = (msg.roomId || '').toUpperCase();
        const room   = rooms[roomId];
        if (!room) { send(ws, { type: 'error', msg: 'Room not found' }); return; }
        if (room.size >= 4) { send(ws, { type: 'error', msg: 'Room full (max 4)' }); return; }
        const playerId = 'p' + (room.size + 1);
        ws._roomId   = roomId;
        ws._playerId = playerId;
        room.add(ws);
        send(ws, { type: 'joined', roomId, playerId, playerCount: room.size });
        broadcast(room, { type: 'playerJoined', playerId }, ws);
        console.log(`[join] ${playerId} joined room ${roomId} (${room.size} players)`);
        break;
      }

      // Relay player position / HP state to everyone else in the room
      case 'playerState': {
        const room = rooms[ws._roomId];
        if (!room) return;
        broadcast(room, { ...msg, playerId: ws._playerId }, ws);
        break;
      }

      // Relay game events (enemy death, item pickup, etc.)
      case 'netEvent': {
        const room = rooms[ws._roomId];
        if (!room) return;
        broadcast(room, { ...msg, fromPlayerId: ws._playerId }, ws);
        break;
      }
    }
  });

  ws.on('close', () => {
    const room = rooms[ws._roomId];
    if (!room) return;
    room.delete(ws);
    broadcast(room, { type: 'playerLeft', playerId: ws._playerId });
    if (room.size === 0) {
      delete rooms[ws._roomId];
      console.log(`[close] room ${ws._roomId} empty, removed`);
    } else {
      console.log(`[close] ${ws._playerId} left room ${ws._roomId}`);
    }
  });

  ws.on('error', (e) => console.warn('[ws error]', e.message));
});

function send(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function broadcast(room, obj, exclude = null) {
  const data = JSON.stringify(obj);
  for (const client of room) {
    if (client !== exclude && client.readyState === WebSocket.OPEN)
      client.send(data);
  }
}

function genCode() {
  // 6-char alphanumeric room code, retry if collision
  let code;
  do { code = Math.random().toString(36).substr(2, 6).toUpperCase(); }
  while (rooms[code]);
  return code;
}

console.log(`Slayers multiplayer server listening on ws://localhost:${PORT}`);
console.log('Share your local IP so others on the same network can connect.');
