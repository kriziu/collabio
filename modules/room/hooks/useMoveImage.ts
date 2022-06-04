import { useContext } from 'react';

import { roomContext } from '../context/Room.context';

export const useMoveImage = () => {
  const { moveImage, setMoveImage } = useContext(roomContext);

  return { moveImage, setMoveImage };
};
