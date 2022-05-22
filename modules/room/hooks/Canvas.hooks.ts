import { useCallback, useEffect, useState } from 'react';

import { useSetRecoilState } from 'recoil';

import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';
import { useOptions } from '@/common/recoil/options';
import usersAtom, { useUsers } from '@/common/recoil/users';

import { drawAllMoves, handleMove } from '../helpers/Canvas.helpers';
import { useBoardPosition } from './useBoardPosition';

const movesWithourUser: Move[] = [];
const savedMoves: Move[] = [];

let tempMoves: [number, number][] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  handleEnd: () => void
) => {
  const users = useUsers();

  const boardPosition = useBoardPosition();
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const options = useOptions();

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  });

  const handleUndo = useCallback(() => {
    if (ctx) {
      savedMoves.pop();
      socket.emit('undo');

      drawAllMoves(ctx, movesWithourUser, savedMoves, users);

      handleEnd();
    }
  }, [ctx, handleEnd, users]);

  useEffect(() => {
    const handleUndoKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'z' && e.ctrlKey) {
        handleUndo();
      }
    };

    document.addEventListener('keydown', handleUndoKeyboard);

    return () => {
      document.removeEventListener('keydown', handleUndoKeyboard);
    };
  }, [handleUndo]);

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked || blocked) return;

    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) return;

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    tempMoves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);

    ctx.closePath();

    const move: Move = {
      path: tempMoves,
      options,
    };

    savedMoves.push(move);
    tempMoves = [];

    socket.emit('draw', move);

    drawAllMoves(ctx, movesWithourUser, savedMoves, users);

    handleEnd();
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    handleUndo,
  };
};

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  drawing: boolean,
  handleEnd: () => void
) => {
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

  useEffect(() => {
    socket.on('room', (room, usersToParse) => {
      if (!ctx) return;

      const users = new Map<string, Move[]>(JSON.parse(usersToParse));

      room.drawed.forEach((move) => {
        handleMove(move, ctx);
        movesWithourUser.push(move);
      });

      users.forEach((userMoves, userId) => {
        userMoves.forEach((move) => handleMove(move, ctx));
        setUsers((prevUsers) => ({ ...prevUsers, [userId]: userMoves }));
      });

      handleEnd();
    });

    return () => {
      socket.off('room');
    };
  }, [ctx, handleEnd, setUsers]);

  useEffect(() => {
    let moveToDrawLater: Move | undefined;
    let userIdLater = '';

    socket.on('user_draw', (move, userId) => {
      if (ctx && !drawing) {
        handleMove(move, ctx);
        handleEnd();
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          newUsers[userId] = [...newUsers[userId], move];
          return newUsers;
        });
      } else {
        moveToDrawLater = move;
        userIdLater = userId;
      }
    });

    return () => {
      socket.off('user_draw');

      if (moveToDrawLater && userIdLater && ctx) {
        handleMove(moveToDrawLater, ctx);
        handleEnd();
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          newUsers[userIdLater] = [
            ...newUsers[userIdLater],
            moveToDrawLater as Move,
          ];
          return newUsers;
        });
      }
    };
  }, [ctx, drawing, handleEnd, setUsers]);

  useEffect(() => {
    socket.on('user_undo', (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        newUsers[userId] = newUsers[userId].slice(0, -1);

        if (ctx) {
          drawAllMoves(ctx, movesWithourUser, savedMoves, newUsers);
          handleEnd();
        }

        return newUsers;
      });
    });

    return () => {
      socket.off('user_undo');
    };
  }, [ctx, handleEnd, setUsers]);
};
