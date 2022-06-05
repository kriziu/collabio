import { useSetRecoilState } from 'recoil';

import { savedMovesAtom } from './savedMoves.atom';

export const useSavedMoves = () => {
  const setSavedMoves = useSetRecoilState(savedMovesAtom);

  const addSavedMove = (move: Move) => {
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
