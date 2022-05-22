import RoomContextProvider from '../context/Room.context';
import Canvas from './Canvas';
import MousePosition from './MousePosition';
import MousesRenderer from './MousesRenderer';
import ToolBar from './ToolBar';

const Room = () => {
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

// TODO: DODAC METODE OBLICZAJACA SUME MYSZKI I PRZESUNIECIA TABLICY ZEBY NIE ROBIC TEGO MANUALNIE