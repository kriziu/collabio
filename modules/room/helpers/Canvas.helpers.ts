export const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const { options, path } = move;

  ctx.lineWidth = options.lineWidth;
  ctx.strokeStyle = options.lineColor;

  ctx.beginPath();
  path.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.closePath();
};

export const drawAllMoves = (
  ctx: CanvasRenderingContext2D,
  movesWithoutUser: Move[],
  savedMoves: Move[],
  users: { [key: string]: Move[] }
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  movesWithoutUser.forEach((move) => {
    handleMove(move, ctx);
  });

  Object.values(users).forEach((user) => {
    user.forEach((move) => handleMove(move, ctx));
  });

  savedMoves.forEach((move) => handleMove(move, ctx));
};
