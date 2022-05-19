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
    ctx.stroke();
  });
  ctx.closePath();

  afterDraw();
};
