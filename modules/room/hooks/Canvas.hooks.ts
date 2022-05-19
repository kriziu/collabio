import { useEffect, useState } from 'react';

import { socket } from '@/common/lib/socket';
import { useOptions } from '@/common/recoil/options';

import { useBoardPosition } from './useBoardPosition';

let moves: [number, number][] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  handleEnd: () => void
) => {
  const boardPosition = useBoardPosition();
  const movedX = -boardPosition.x.get();
  const movedY = -boardPosition.y.get();

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

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked || blocked) return;

    moves = [[x + movedX, y + movedY]];
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };

  const handleDraw = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) return;

    moves.push([x + movedX, y + movedY]);
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    socket.emit('draw', moves, options);

    setDrawing(false);
    ctx.closePath();
    handleEnd();
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
  };
};
