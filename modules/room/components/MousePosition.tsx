import { useRef } from 'react';

import { motion } from 'framer-motion';
import { useInterval, useMouse } from 'react-use';

import { socket } from '@/common/lib/socket';

import { useBoardPosition } from '../hooks/useBoardPosition';

const MousePosition = () => {
  const prevPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const { x, y } = useBoardPosition();

  const ref = useRef<HTMLDivElement>(null);

  const { docX, docY } = useMouse(ref);

  useInterval(() => {
    if (prevPosition.current.x !== docX || prevPosition.current.y !== docY) {
      socket.emit('mouse_move', docX - x.get(), docY - y.get());
      prevPosition.current = { x: docX, y: docY };
    }
  }, 300);

  return (
    <motion.div
      ref={ref}
      className="absolute top-0 left-0 z-50 select-none"
      animate={{ x: docX + 15, y: docY + 15 }}
      transition={{ duration: 0.05, ease: 'linear' }}
    >
      {docX - x.get()} | {docY - y.get()}
    </motion.div>
  );
};

export default MousePosition;
