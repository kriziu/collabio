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

  io.on('connection', (socket) => {
    console.log('connection');

    socket.join('global');

    const allUsers = io.sockets.adapter.rooms.get('global');
    if (allUsers) io.to('global').emit('users_in_room', [...allUsers]);

    socket.on('draw', (moves, options) => {
      console.log('drawing');
      socket.broadcast.emit('socket_draw', moves, options);
    });

    socket.on('mouse_move', (x, y) => {
      console.log('mouse_move');
      socket.broadcast.emit('mouse_moved', x, y, socket.id);
    });

    socket.on('disconnect', () => {
      console.log('client disconnected');
    });
  });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
