export const drawFromSocket = (
  socketMoves: [number, number][],
  socketOptions: CtxOptions,
  ctx: CanvasRenderingContext2D,
  afterDraw: () => void
) => {
  ctx.lineWidth = socketOptions.lineWidth;
  ctx.strokeStyle = socketOptions.lineColor;

  ctx.beginPath();
  socketMoves.forEach(([x, y]) => {
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.closePath();

  afterDraw();
};

export const drawOnUndo = (
  ctx: CanvasRenderingContext2D,
  savedMoves: [number, number][][],
  users: { [key: string]: [number, number][][] }
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  Object.values(users).forEach((user) => {
    user.forEach((userMove) => {
      ctx.beginPath();
      userMove.forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.closePath();
    });
  });

  savedMoves.forEach((movesArr) => {
    ctx.beginPath();
    movesArr.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.closePath();
  });
};
