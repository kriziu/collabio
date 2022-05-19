import { useEffect, useState } from 'react';

import { socket } from '@/common/lib/socket';

import SocketMouse from './SocketMouse';

const MousesRenderer = () => {
  const [mouses, setMouses] = useState<string[]>([]);

  console.log(mouses);

  useEffect(() => {
    socket.on('users_in_room', (socketIds) => {
      const allUsers = socketIds.filter((socketId) => socketId !== socket.id);
      setMouses(allUsers);
    });

    return () => {
      socket.off('users_in_room');
    };
  }, []);

  return (
    <>
      {mouses.map((socketId) => {
        return <SocketMouse socketId={socketId} key={socketId} />;
      })}
    </>
  );
};

export default MousesRenderer;
