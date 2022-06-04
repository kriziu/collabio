import { motion, useMotionValue } from 'framer-motion';

import { getPos } from '@/common/lib/getPos';
import { socket } from '@/common/lib/socket';

import { useBoardPosition } from '../../hooks/useBoardPosition';
import { useMoveImage } from '../../hooks/useMoveImage';
import { useRefs } from '../../hooks/useRefs';

const MoveImage = () => {
  const { canvasRef } = useRefs();
  const { x, y } = useBoardPosition();

  const imageX = useMotionValue(50);
  const imageY = useMotionValue(50);

  const { moveImage, setMoveImage } = useMoveImage();

  const handlePlaceImage = () => {
    const [finalX, finalY] = [getPos(imageX.get(), x), getPos(imageY.get(), y)];

    const move: Move = {
      width: 0,
      height: 0,
      radius: 0,
      path: [[finalX, finalY]],
      options: {
        lineWidth: 1,
        lineColor: '#000',
        erase: false,
        shape: 'image',
      },
      timestamp: 0,
      eraser: false,
      base64: moveImage,
    };

    socket.emit('draw', move);

    setMoveImage('');
    imageX.set(50);
    imageY.set(50);
  };

  if (!moveImage) return null;

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragElastic={0}
      dragTransition={{ power: 0.03, timeConstant: 50 }}
      className="absolute top-0 z-20 cursor-grab"
      style={{ x: imageX, y: imageY }}
    >
      <button
        className="w-full text-center text-black"
        onClick={handlePlaceImage}
      >
        Accept
      </button>
      <img
        className="pointer-events-none"
        alt="image to place"
        src={moveImage}
      />
    </motion.div>
  );
};

export default MoveImage;
