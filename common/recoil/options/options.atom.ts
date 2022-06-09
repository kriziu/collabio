import { atom } from 'recoil';

export const optionsAtom = atom<CtxOptions>({
  key: 'options',
  default: {
    lineColor: { r: 0, g: 0, b: 0, a: 1 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
    lineWidth: 5,
    mode: 'draw',
    shape: 'line',
    selection: null,
  },
});
