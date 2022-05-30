const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const { options, path } = move;

  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;
  if (move.eraser) ctx.globalCompositeOperation = 'destination-out';

  switch (options.shape) {
    case 'line':
      ctx.beginPath();
      path.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });

      ctx.stroke();
      ctx.closePath();
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(path[0][0], path[0][1], move.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
      break;

    case 'rect':
      ctx.beginPath();
      ctx.rect(path[0][0], path[0][1], move.width, move.height);
      ctx.stroke();
      ctx.closePath();
      break;

    default:
      break;
  }

  ctx.globalCompositeOperation = 'source-over';
};

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  room: ClientRoom,
  options: CtxOptions
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

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;
  if (options.erase) ctx.globalCompositeOperation = 'destination-out';
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number
) => {
  ctx.beginPath();

  const radius = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);

  ctx.arc(from[0], from[1], radius, 0, 2 * Math.PI);

  ctx.stroke();
  ctx.closePath();

  return radius;
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  ctx.beginPath();

  let width = 0;
  let height = 0;

  if (shift) {
    const d = Math.sqrt((x - from[0]) ** 2 + (y - from[1]) ** 2);
    width = d / Math.sqrt(2);
    height = d / Math.sqrt(2);

    if (x - from[0] > 0 && y - from[1] < 0) {
      height = -height;
    } else if (y - from[1] > 0 && x - from[0] < 0) {
      width = -width;
    } else if (x - from[0] < 0 && y - from[1] < 0) {
      width = -width;
      height = -height;
    }
  } else {
    width = x - from[0];
    height = y - from[1];
  }

  ctx.rect(from[0], from[1], width, height);

  ctx.stroke();
  ctx.closePath();

  return { width, height };
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  if (shift) {
    ctx.beginPath();
    ctx.lineTo(from[0], from[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    return;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
};
