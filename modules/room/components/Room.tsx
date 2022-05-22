import { useRoomId } from '@/common/recoil/room';

import RoomContextProvider from '../context/Room.context';
import Canvas from './Canvas';
import MousePosition from './MousePosition';
import MousesRenderer from './MousesRenderer';
import ToolBar from './ToolBar';

const Room = () => {
  const roomId = useRoomId();

  if (!roomId) return <div>No room id</div>;

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
