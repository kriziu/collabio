const handleMove = (move: Move, ctx: CanvasRenderingContext2D) => {
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
  room: ClientRoom
) => {
  const { usersMoves, movesWithoutUser, myMoves } = room;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  movesWithoutUser.forEach((move) => {
    handleMove(move, ctx);
  });

  usersMoves.forEach((userMoves) => {
    userMoves.forEach((move) => {
      handleMove(move, ctx);
    });
  });

  myMoves.forEach((move) => handleMove(move, ctx));
};
