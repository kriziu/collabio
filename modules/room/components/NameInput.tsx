import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useSetRoomId } from '@/common/recoil/room';

const NameInput = () => {
  const setRoomId = useSetRoomId();

  const [name, setName] = useState('');

  const router = useRouter();
  const roomId = (router.query.roomId || '').toString();

  useEffect(() => {
    if (!roomId) return;

    socket.emit('check_room', roomId);

    socket.on('room_exists', (exists) => {
      if (!exists) {
        router.push('/');
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('room_exists');
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) router.push('/');
      else setRoomId(roomIdFromServer);
    };

    socket.on('joined', handleJoined);

    return () => {
      socket.off('joined', handleJoined);
    };
  }, [router, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('join_room', roomId, name);
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleJoinRoom}>
      <h1 className="mt-24 text-extra font-extrabold leading-tight">
        Collabio
      </h1>
      <h3 className="text-2xl">Real-time whiteboard</h3>

      <div className="mt-10 mb-3 flex flex-col gap-2">
        <label className="self-start font-bold leading-tight">
          Enter your name
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className="btn" type="submit">
        Enter room
      </button>
    </form>
  );
};

export default NameInput;
