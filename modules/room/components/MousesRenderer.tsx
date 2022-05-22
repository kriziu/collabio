import { useUsersIds } from '@/common/recoil/users';

import SocketMouse from './SocketMouse';

const MousesRenderer = () => {
  const usersIds = useUsersIds();

  return (
    <>
      {usersIds.map((userId) => {
        return <SocketMouse userId={userId} key={userId} />;
      })}
    </>
  );
};

export default MousesRenderer;
