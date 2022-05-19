export declare global {
  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
  }

  interface ServerToClientEvents {
    socket_draw: (newMoves: [number, number][], options: CtxOptions) => void;
    mouse_moved: (x: number, y: number, socketId: string) => void;
    users_in_room: (socketIds: string[]) => void;
  }

  interface ClientToServerEvents {
    draw: (moves: [number, number][], options: CtxOptions) => void;
    mouse_move: (x: number, y: number) => void;
  }
}
