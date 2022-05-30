import { atom } from 'recoil';

export const optionsAtom = atom<CtxOptions>({
  key: 'options',
  default: {
    lineColor: '#000000',
    lineWidth: 5,
    erase: false,
  },
});
