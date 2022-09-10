import { useContext } from 'react';

import { roomContext } from '../../../context/Room.context';

export const useBoardPosition = () => {
  const { x, y } = useContext(roomContext);

  return { x, y };
};
