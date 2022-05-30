import { useRoom } from '@/common/recoil/room';

const UserList = () => {
  const room = useRoom();

  return (
    <div className="pointer-events-none absolute z-10 flex p-5">
      {[...room.users.keys()].map((userId, index) => {
        return (
          <div
            key={userId}
            className="flex h-12 w-12 select-none items-center justify-center rounded-full text-white"
            style={{
              backgroundColor: room.users.get(userId)?.color || 'black',
              marginLeft: index !== 0 ? '-0.5rem' : 0,
            }}
          >
            {room.users.get(userId)?.name.split('')[0] || 'A'}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
