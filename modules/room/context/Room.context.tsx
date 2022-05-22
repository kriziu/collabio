import { createContext, ReactChild, useEffect } from 'react';

import { MotionValue, useMotionValue } from 'framer-motion';
import { useSetRecoilState } from 'recoil';

import { socket } from '@/common/lib/socket';
import usersAtom, { useUsersIds } from '@/common/recoil/users';

export const roomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactChild }) => {
  const setUsers = useSetRecoilState(usersAtom);
  const usersIds = useUsersIds();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on('new_user', (newUser) => {
      setUsers((prevUsers) => ({ ...prevUsers, [newUser]: [] }));
    });

    socket.on('user_disconnected', (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        delete newUsers[userId];
        return newUsers;
      });
    });

    return () => {
      socket.off('new_user');
      socket.off('user_disconnected');
    };
  }, [setUsers, usersIds]);

  return (
    <roomContext.Provider value={{ x, y }}>{children}</roomContext.Provider>
  );
};

export default RoomContextProvider;
