import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useModal } from '@/common/recoil/modal';
import { useSetRoomId } from '@/common/recoil/room';

import NotFoundModal from '../modals/NotFound';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const setAtomRoomId = useSetRoomId();

  const router = useRouter();

  const { openModal } = useModal();

  useEffect(() => {
    socket.on('created', (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    socket.on('joined', (roomIdFromServer, failed) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    });

    return () => {
      socket.off('created');
      socket.off('joined');
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit('create_room');
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('join_room', roomId);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-24 text-extra font-extrabold leading-tight">
        Collabio
      </h1>
      <h3 className="text-2xl">Real-time whiteboard</h3>

      <form
        className="mt-8 flex flex-col items-center gap-2"
        onSubmit={handleJoinRoom}
      >
        <label htmlFor="room-id" className="self-start font-bold leading-tight">
          Enter room id
        </label>
        <input
          className="rounded-xl border p-5 py-1"
          id="room-id"
          placeholder="Room id..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          type="submit"
        >
          Join
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new room</h5>

        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          onClick={handleCreateRoom}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
