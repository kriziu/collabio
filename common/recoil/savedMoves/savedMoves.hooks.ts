import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Move } from '@/common/types/global';

import { savedMovesAtom } from './savedMoves.atom';

export const useSetSavedMoves = () => {
  const setSavedMoves = useSetRecoilState(savedMovesAtom);

  const addSavedMove = (move: Move) => {
    if (move.options.mode === 'select') return;

    setSavedMoves((prevMoves) => [move, ...prevMoves]);
  };

  const removeSavedMove = () => {
    let move: Move | undefined;

    setSavedMoves((prevMoves) => {
      move = prevMoves.at(0);

      return prevMoves.slice(1);
    });

    return move;
  };

  const clearSavedMoves = () => {
    setSavedMoves([]);
  };

  return { addSavedMove, removeSavedMove, clearSavedMoves };
};

export const useSavedMoves = () => {
  const savedMoves = useRecoilValue(savedMovesAtom);

  return savedMoves;
};
