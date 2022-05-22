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
    joined: (roomId: string, failed?: boolean) => void;
    room: (room: string) => void;
    created: (roomId: string) => void;
    user_draw: (move: Move, userId: string) => void;
    user_undo(userId: string): void;
    mouse_moved: (x: number, y: number, userId: string) => void;
    new_user: (userId: string) => void;
    user_disconnected: (userId: string) => void;
  }

  interface ClientToServerEvents {
    draw: (move: Move) => void;
    mouse_move: (x: number, y: number) => void;
    undo: () => void;
    create_room: () => void;
    join_room: (room: string) => void;
    joined_room: () => void;
    leave_room: () => void;
  }
}
