import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    if (req.url.startsWith('/socket.io')) {
      // Let Socket.io handle it
      return;
    }
    if (req.url === '/api/rooms' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      const activeRooms = Array.from(rooms.keys()).filter(
        room => rooms.get(room).size > 0
      );
      res.end(JSON.stringify({ rooms: activeRooms }));
      return;
    }
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // In-memory storage for rooms and users (demo only)
  const rooms = new Map(); // room -> Set of sockets
  const roomMessages = new Map(); // room -> array of messages

  io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ room, nickname }) => {
      socket.nickname = nickname;
      socket.join(room);

      // Track users in room
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }
      rooms.get(room).add(socket.id);

      // Send previous messages
      const messages = roomMessages.get(room) || [];
      socket.emit('room-messages', messages);

      // Notify others of join
      socket.to(room).emit('user-joined', { nickname });
      console.log(`Notifying others in ${room} that ${nickname} joined`);

      console.log(`${nickname} joined room: ${room}`);
    });

    socket.on('send-message', ({ room, text, nickname }) => {
      const msgData = { nickname, text, timestamp: Date.now() };
      // Store message
      if (!roomMessages.has(room)) {
        roomMessages.set(room, []);
      }
      roomMessages.get(room).push(msgData);
      io.to(room).emit('room-messages', msgData);
      console.log(`Message in ${room}: ${text}`);
    });

    socket.on('typing', ({ room, nickname }) => {
      socket.to(room).emit('user-typing', { nickname });
    });

    socket.on('stop-typing', ({ room, nickname }) => {
      socket.to(room).emit('user-stop-typing', { nickname });
    });

    socket.on('disconnect', () => {
      const room = Array.from(socket.rooms).find(r => r !== socket.id); // Find the room
      if (room && rooms.has(room)) {
        rooms.get(room).delete(socket.id);
        if (rooms.get(room).size === 0) {
          rooms.delete(room);
        }
        // Notify others of leave
        socket.to(room).emit('user-left', { nickname: socket.nickname });
      }
      console.log('User disconnected:', socket.id);
    });
  });

  httpServer.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
