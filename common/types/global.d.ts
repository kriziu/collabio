export declare global {
  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
  }

  interface ServerToClientEvents {
    socket_draw: (newMoves: [number, number][], options: CtxOptions) => void;
  }

  interface ClientToServerEvents {
    draw: (moves: [number, number][], options: CtxOptions) => void;
  }
}
