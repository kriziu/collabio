export declare global {
  interface CtxOptions {
    lineWidth: number;
    lineColor: string;
  }

  interface Move {
    path: [number, number][];
    options: CtxOptions;
  }

  type Room = Map<string, Move[]>;

  interface ServerToClientEvents {
    joined: (room: string) => void;
    user_draw: (move: Move, userId: string) => void;
    user_undo(userId: string): void;
    mouse_moved: (x: number, y: number, socketId: string) => void;
    users_in_room: (socketIds: string[]) => void;
    user_disconnected: (socketId: string) => void;
  }

  interface ClientToServerEvents {
    draw: (move: Move) => void;
    mouse_move: (x: number, y: number) => void;
    undo: () => void;
  }
}
