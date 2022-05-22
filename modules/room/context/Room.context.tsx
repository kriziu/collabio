import { createContext, ReactChild, useEffect } from 'react';

import { MotionValue, useMotionValue } from 'framer-motion';

import { socket } from '@/common/lib/socket';
import { useSetUsers } from '@/common/recoil/room';
import { useSetRoom } from '@/common/recoil/room/room.hooks';

export const roomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
  const setRoom = useSetRoom();
  const { handleAddUser, handleRemoveUser } = useSetUsers();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on('room', (room, usersToParse) => {
      const users = new Map<string, Move[]>(JSON.parse(usersToParse));

      setRoom((prev) => ({
        ...prev,
        users,
        movesWithoutUser: room.drawed,
      }));
    });

    socket.on('new_user', (newUser) => {
      handleAddUser(newUser);
    });

    socket.on('user_disconnected', (userId) => {
      handleRemoveUser(userId);
    });

    return () => {
      socket.off('room');
      socket.off('new_user');
      socket.off('user_disconnected');
    };
  }, [handleAddUser, handleRemoveUser, setRoom]);

  return (
    <roomContext.Provider value={{ x, y }}>{children}</roomContext.Provider>
  );
};

export default RoomContextProvider;
