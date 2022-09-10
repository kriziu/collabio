import { atom } from 'recoil';

import { ClientRoom } from '@/common/types/global';

export const DEFAULT_ROOM = {
  id: '',
  users: new Map(),
  usersMoves: new Map(),
  movesWithoutUser: [],
  myMoves: [],
};

export const roomAtom = atom<ClientRoom>({
  key: 'room',
  default: DEFAULT_ROOM,
});
