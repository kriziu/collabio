import { useEffect } from 'react';

import { socket } from '@/common/lib/socket';
import { useSetUsers } from '@/common/recoil/room';
import { Move } from '@/common/types/global';

export const useSocketDraw = (drawing: boolean) => {
  const { handleAddMoveToUser, handleRemoveMoveFromUser } = useSetUsers();

  useEffect(() => {
    let moveToDrawLater: Move | undefined;
    let userIdLater = '';

    socket.on('user_draw', (move, userId) => {
      if (!drawing) {
        handleAddMoveToUser(userId, move);
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off('user_draw');

      if (moveToDrawLater && userIdLater) {
        handleAddMoveToUser(userIdLater, moveToDrawLater);
      }
    };
  }, [drawing, handleAddMoveToUser]);

  useEffect(() => {
    socket.on('user_undo', (userId) => {
      handleRemoveMoveFromUser(userId);
    });

    return () => {
      socket.off('user_undo');
    };
  }, [handleRemoveMoveFromUser]);
};
