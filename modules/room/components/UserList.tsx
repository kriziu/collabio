import { useRoom } from '@/common/recoil/room';

const UserList = () => {
  const { users } = useRoom();

  return (
    <div className="pointer-events-none absolute z-30 flex p-5">
      {[...users.keys()].map((userId, index) => {
        return (
          <div
            key={userId}
            className="flex h-5 w-5 select-none items-center justify-center rounded-full text-xs text-white md:h-8 md:w-8 md:text-base lg:h-12 lg:w-12"
            style={{
              backgroundColor: users.get(userId)?.color || 'black',
              marginLeft: index !== 0 ? '-0.5rem' : 0,
            }}
          >
            {users.get(userId)?.name.split('')[0] || 'A'}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
