// import { CANVAS_SIZE } from '@/common/constants/canvasSize';

const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const { options, path } = move;

  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;

  if (move.eraser) ctx.globalCompositeOperation = 'destination-out';

  ctx.beginPath();
  path.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.closePath();

  ctx.globalCompositeOperation = 'source-over';
};

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  room: ClientRoom
) => {
  const { usersMoves, movesWithoutUser, myMoves } = room;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const moves = [...movesWithoutUser, ...myMoves];

  usersMoves.forEach((userMoves) => {
    moves.push(...userMoves);
  });

  moves.sort((a, b) => a.timestamp - b.timestamp);

  moves.forEach((move) => {
    handleMove(move, ctx);
  });
};
