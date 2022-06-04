import { useRoom } from '@/common/recoil/room';

import RoomContextProvider from '../context/Room.context';
import Canvas from './board/Canvas';
import MousePosition from './board/MousePosition';
import MousesRenderer from './board/MousesRenderer';
import MoveImage from './board/MoveImage';
import Chat from './chat/Chat';
import NameInput from './NameInput';
import ToolBar from './toolbar/ToolBar';
import UserList from './UserList';

const Room = () => {
  const room = useRoom();

  if (!room.id) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <UserList />
        <ToolBar />
        <MoveImage />
        <Canvas />
        <MousePosition />
        <MousesRenderer />
        <Chat />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
