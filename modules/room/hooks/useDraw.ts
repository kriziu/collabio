import { useEffect, useState } from 'react';

import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';
import { useOptionsValue } from '@/common/recoil/options';
import { useSetSelection } from '@/common/recoil/options/options.hooks';
import { useSetSavedMoves } from '@/common/recoil/savedMoves';

import { drawRect, drawCircle, drawLine } from '../helpers/Canvas.helpers';
import { useBoardPosition } from './useBoardPosition';
import { useRefs } from './useRefs';

let tempMoves: [number, number][] = [];
let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const { canvasRef } = useRefs();
  const options = useOptionsValue();
  const boardPosition = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();
  const { setSelection } = useSetSelection();

  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext('2d');
    if (newCtx) setCtx(newCtx);
  }, [canvasRef]);

  const setupCtxOptions = () => {
    if (ctx) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
      if (options.mode === 'eraser')
        ctx.globalCompositeOperation = 'destination-out';
      else ctx.globalCompositeOperation = 'source-over';
    }
  };

  const drawAndSet = () => {
    if (!tempImageData)
      tempImageData = ctx?.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );

    if (tempImageData) ctx?.putImageData(tempImageData, 0, 0);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    setDrawing(true);
    setupCtxOptions();

    if (options.shape === 'line' && options.mode !== 'select') {
      ctx.beginPath();
      ctx.lineTo(finalX, finalY);
      ctx.stroke();
    }

    tempMoves.push([finalX, finalY]);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const [finalX, finalY] = [getPos(x, movedX), getPos(y, movedY)];

    setupCtxOptions();
    drawAndSet();

    if (options.mode === 'select') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      drawRect(ctx, tempMoves[0], finalX, finalY, false, true);
      ctx.fillStyle = 'rgba(0, 0, 0)';
      tempMoves.push([finalX, finalY]);

      return;
    }

    switch (options.shape) {
      case 'line':
        if (shift) tempMoves = tempMoves.slice(0, 1);

        drawLine(ctx, tempMoves[0], finalX, finalY, shift);

        tempMoves.push([finalX, finalY]);
        break;

      case 'circle':
        tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      case 'rect':
        tempSize = drawRect(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      default:
        break;
    }
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);

    ctx.closePath();

    if (options.mode === 'select') {
      drawAndSet();
      const x = tempMoves[0][0];
      const y = tempMoves[0][1];
      const width = tempMoves[tempMoves.length - 1][0] - x;
      const height = tempMoves[tempMoves.length - 1][1] - y;

      if (width !== 0 && height !== 0) setSelection({ x, y, width, height });
    }

    const move: Move = {
      rect: {
        ...tempSize,
      },
      circle: {
        ...tempCircle,
      },
      img: {
        base64: '',
      },
      path: tempMoves,
      options,
      timestamp: 0,
      id: '',
    };

    tempMoves = [];
    tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
    tempSize = { width: 0, height: 0 };
    tempImageData = undefined;

    if (options.mode !== 'select') {
      socket.emit('draw', move);
      clearSavedMoves();
    }
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
  };
};
