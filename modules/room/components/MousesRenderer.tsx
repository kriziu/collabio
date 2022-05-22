import { useUsersIds } from '@/common/recoil/users';

import UserMouse from './UserMouse';

const MousesRenderer = () => {
  const usersIds = useUsersIds();

  return (
    <>
      {usersIds.map((userId) => {
        return <UserMouse userId={userId} key={userId} />;
      })}
    </>
  );
};

export default MousesRenderer;
