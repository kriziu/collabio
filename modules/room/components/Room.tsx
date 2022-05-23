import { useRoom } from '@/common/recoil/room';

import RoomContextProvider from '../context/Room.context';
import Canvas from './Canvas';
import MousePosition from './MousePosition';
import MousesRenderer from './MousesRenderer';
import NameInput from './NameInput';
import ToolBar from './toolbar/ToolBar';

const Room = () => {
  const room = useRoom();

  if (!room.id) return <NameInput />;

  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <ToolBar />
        <Canvas />
        <MousePosition />
        <MousesRenderer />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
