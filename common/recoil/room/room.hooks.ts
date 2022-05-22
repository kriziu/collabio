import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { roomAtom } from './room.atom';

export const useRoom = () => {
  const room = useRecoilValue(roomAtom);

  return room;
};

export const useSetRoom = () => {
  const setRoom = useSetRecoilState(roomAtom);

  return setRoom;
};

export const useSetRoomId = () => {
  const setRoomId = useSetRecoilState(roomAtom);

  const handleSetRoomId = (id: string) => {
    setRoomId((prev) => ({ ...prev, id }));
  };

  return handleSetRoomId;
};

export const useSetUsers = () => {
  const setUsers = useSetRecoilState(roomAtom);

  const handleAddUser = (userId: string) => {
    setUsers((prev) => {
      const newUsers = prev.users;
      newUsers.set(userId, []);
      return { ...prev, users: newUsers };
    });
  };

  const handleRemoveUser = (userId: string) => {
    setUsers((prev) => {
      const newUsers = prev.users;

      const userMoves = newUsers.get(userId);

      newUsers.delete(userId);
      return {
        ...prev,
        users: newUsers,
        movesWithoutUser: [...prev.movesWithoutUser, ...(userMoves || [])],
      };
    });
  };

  const handleAddMoveToUser = (userId: string, moves: Move) => {
    setUsers((prev) => {
      const newUsers = prev.users;
      const oldMoves = prev.users.get(userId);

      newUsers.set(userId, [...(oldMoves || []), moves]);
      return { ...prev, users: newUsers };
    });
  };

  const handleRemoveMoveFromUser = (userId: string) => {
    setUsers((prev) => {
      const newUsers = prev.users;
      const oldMoves = prev.users.get(userId);
      oldMoves?.pop();

      newUsers.set(userId, oldMoves || []);
      return { ...prev, users: newUsers };
    });
  };

  return {
    handleAddUser,
    handleRemoveUser,
    handleAddMoveToUser,
    handleRemoveMoveFromUser,
  };
};

export const useMyMoves = () => {
  const [room, setRoom] = useRecoilState(roomAtom);

  const handleAddMyMove = (move: Move) => {
    setRoom((prev) => ({ ...prev, myMoves: [...prev.myMoves, move] }));
  };

  const handleRemoveMyMove = () => {
    const newMoves = [...room.myMoves];
    newMoves.pop();

    setRoom((prev) => ({ ...prev, myMoves: newMoves }));
  };

  return { handleAddMyMove, handleRemoveMyMove, myMoves: room.myMoves };
};
