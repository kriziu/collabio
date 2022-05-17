/* eslint-disable no-console */
import { createServer } from 'http';

import express from 'express';
import next, { NextApiHandler } from 'next';
// import { Server } from 'socket.io';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  // const io = new Server(server);

  // app.get('/hello', async (_, res) => {
  //   res.send('Hello World');
  // });

  // io.on('connection', socket => {
  //   console.log('connection');
  //   socket.emit('status', 'Hello from Socket.io');

  //   socket.on('send', data => {
  //     socket.broadcast.emit('new_message', data);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('client disconnected');
  //   });
  // });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
