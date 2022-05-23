import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useRoom, useSetRoomId } from '@/common/recoil/room';

import RoomContextProvider from '../context/Room.context';
import Canvas from './Canvas';
import MousePosition from './MousePosition';
import MousesRenderer from './MousesRenderer';
import ToolBar from './toolbar/ToolBar';

const Room = () => {
  const room = useRoom();
  const setRoomId = useSetRoomId();

  const router = useRouter();

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) router.push('/');
      else setRoomId(roomIdFromServer);
    };

    socket.on('joined', handleJoined);

    return () => {
      socket.off('joined', handleJoined);
    };
  }, [router, setRoomId]);

  if (!room.id) {
    const dynamicRoomId = router.query.roomId?.toString();
    if (dynamicRoomId) socket.emit('join_room', dynamicRoomId);
    return null;
  }

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <ToolBar />
        <Canvas />
        <MousePosition />
        <MousesRenderer />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
