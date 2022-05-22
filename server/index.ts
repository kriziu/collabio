/* eslint-disable no-console */
import { createServer } from 'http';

import {} from '@/common/types/global';

import express from 'express';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

  app.get('/hello', async (_, res) => {
    res.send('Hello World');
  });

  const rooms = new Map<string, Room>();

  const addMove = (roomId: string, socketId: string, move: Move) => {
    const room = rooms.get(roomId)!;

    if (!room.users.has(socketId)) {
      room.users.set(socketId, [move]);
    }

    room.users.get(socketId)!.push(move);
  };

  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId)!;

    room.users.get(socketId)!.pop();
  };

  const leaveRoom = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const userMoves = room.users.get(socketId)!;

    room.drawed.push(...userMoves);

    room.users.delete(socketId);

    console.log(room);
  };

  io.on('connection', (socket) => {
    const getRoomId = () => {
      const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);

      if (!joinedRoom) return socket.id;

      return joinedRoom;
    };

    console.log('connected to server');

    socket.on('create_room', () => {
      let roomId: string;
      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));

      console.log(roomId);

      socket.join(roomId);

      rooms.set(roomId, { users: new Map(), drawed: [] });
      rooms.get(roomId)?.users.set(socket.id, []);

      io.to(socket.id).emit('created', roomId);
    });

    socket.on('join_room', (roomId: string) => {
      if (rooms.has(roomId)) {
        socket.join(roomId);

        io.to(socket.id).emit('joined', roomId);
      } else io.to(socket.id).emit('joined', '', true);
    });

    socket.on('joined_room', () => {
      console.log('joined room');

      const roomId = getRoomId();

      console.log(roomId);

      const room = rooms.get(roomId);
      if (room) {
        room.users.set(socket.id, []);

        io.to(socket.id).emit('room', room, JSON.stringify([...room.users]));

        socket.broadcast.to(roomId).emit('new_user', socket.id);
      }
    });

    socket.on('leave_room', () => {
      const roomId = getRoomId();
      leaveRoom(roomId, socket.id);

      io.to(roomId).emit('user_disconnected', socket.id);
    });

    socket.on('draw', (move) => {
      const roomId = getRoomId();

      addMove(roomId, socket.id, move);

      socket.broadcast.to(roomId).emit('user_draw', move, socket.id);
    });

    socket.on('undo', () => {
      const roomId = getRoomId();

      undoMove(roomId, socket.id);

      socket.broadcast.to(roomId).emit('user_undo', socket.id);
    });

    socket.on('mouse_move', (x, y) => {
      socket.broadcast.to(getRoomId()).emit('mouse_moved', x, y, socket.id);
    });

    socket.on('disconnecting', () => {
      const roomId = getRoomId();
      leaveRoom(roomId, socket.id);

      io.to(roomId).emit('user_disconnected', socket.id);

      console.log('disconnected from server');
    });
  });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
