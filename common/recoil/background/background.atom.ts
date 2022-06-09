import { atom } from 'recoil';

export const backgroundAtom = atom<{ mode: 'dark' | 'light'; lines: boolean }>({
  key: 'bg',
  default: {
    mode: 'light',
    lines: true,
  },
});
