import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { BsCursorFill } from 'react-icons/bs';

import { socket } from '@/common/lib/socket';
import { useRoom } from '@/common/recoil/room';

import { useBoardPosition } from '../hooks/useBoardPosition';

const UserMouse = ({ userId }: { userId: string }) => {
  const { users } = useRoom();

  const boardPos = useBoardPosition();
  const [x, setX] = useState(boardPos.x.get());
  const [y, setY] = useState(boardPos.y.get());

  const [pos, setPos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    socket.on('mouse_moved', (newX, newY, socketIdMoved) => {
      if (socketIdMoved === userId) {
        setPos({ x: newX, y: newY });
      }
    });

    return () => {
      socket.off('mouse_moved');
    };
  }, [userId]);

  useEffect(() => {
    const unsubscribe = boardPos.x.onChange(setX);
    return unsubscribe;
  }, [boardPos.x]);

  useEffect(() => {
    const unsubscribe = boardPos.y.onChange(setY);
    return unsubscribe;
  }, [boardPos.y]);

  return (
    <motion.div
      className={`absolute top-0 left-0 text-blue-800 ${
        pos.x === -1 && 'hidden'
      } pointer-events-none`}
      style={{ color: users.get(userId)?.color }}
      animate={{ x: pos.x + x, y: pos.y + y }}
      transition={{ duration: 0.1, ease: 'linear' }}
    >
      <BsCursorFill className="-rotate-90" />
      <p className="ml-2">{users.get(userId)?.name || 'Anonymous'}</p>
    </motion.div>
  );
};

export default UserMouse;
