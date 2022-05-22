import { useRecoilValue } from 'recoil';

import { usersAtom, usersIds } from './users.atom';

export const useUsersIds = () => {
  const users = useRecoilValue(usersIds);

  return users;
};

export const useUsers = () => {
  const users = useRecoilValue(usersAtom);

  return users;
};
