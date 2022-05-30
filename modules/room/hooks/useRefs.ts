import { useContext } from 'react';

import { roomContext } from '../context/Room.context';

export const useRefs = () => {
  const { undoRef, bgRef, canvasRef } = useContext(roomContext);

  return {
    undoRef,
    bgRef,
    canvasRef,
  };
};
