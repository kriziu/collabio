import { atom, selector } from 'recoil';

export const usersAtom = atom<{ [key: string]: [number, number][][] }>({
  key: 'users',
  default: {},
});

export const usersIds = selector({
  key: 'usersIds',
  get: ({ get }) => {
    const users = get(usersAtom);
    return Object.keys(users);
  },
});
