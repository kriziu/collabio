import { useRoom } from '@/common/recoil/room';

const UserList = () => {
  const { users } = useRoom();

  return (
    <div className="pointer-events-none absolute z-30 flex p-5">
      {[...users.keys()].map((userId, index) => {
        return (
          <div
            key={userId}
            className="flex h-12 w-12 select-none items-center justify-center rounded-full text-white"
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
