import { useCallback, useEffect, useState } from 'react';

import { useSetRecoilState } from 'recoil';

import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';
import { useOptions } from '@/common/recoil/options';
import usersAtom, { useUsers } from '@/common/recoil/users';

import { drawOnUndo } from '../helpers/Canvas.helpers';
import { useBoardPosition } from './useBoardPosition';

const savedMoves: [number, number][][] = [];

let moves: [number, number][] = [];

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

      drawOnUndo(ctx, savedMoves, users);

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
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) return;

    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();

    moves.push([getPos(x, movedX), getPos(y, movedY)]);
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);

    ctx.closePath();

    savedMoves.push(moves);

    socket.emit('draw', moves, options);

    moves = [];

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
  handleEnd: () => void
) => {
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    socket.on('user_draw', (newMoves, options, userId) => {
      if (ctx) {
        ctx.lineWidth = options.lineWidth;
        ctx.strokeStyle = options.lineColor;

        ctx.beginPath();
        newMoves.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.closePath();

        handleEnd();

        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          newUsers[userId] = [...newUsers[userId], newMoves];
          return newUsers;
        });
      }
    });

    socket.on('user_undo', (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        newUsers[userId] = newUsers[userId].slice(0, -1);

        if (ctx) {
          drawOnUndo(ctx, savedMoves, newUsers);
          handleEnd();
        }

        return newUsers;
      });
    });

    return () => {
      socket.off('user_draw');
      socket.off('user_undo');
    };
  }, [ctx, handleEnd, setUsers]);
};
