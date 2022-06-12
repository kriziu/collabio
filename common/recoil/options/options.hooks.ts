import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { optionsAtom } from './options.atom';

export const useOptionsValue = () => {
  const options = useRecoilValue(optionsAtom);

  return options;
};

export const useSetOptions = () => {
  const setOptions = useSetRecoilState(optionsAtom);

  return setOptions;
};

export const useOptions = () => {
  const options = useRecoilState(optionsAtom);

  return options;
};

export const useSetSelection = () => {
  const setOptions = useSetOptions();

  const setSelection = (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    setOptions((prev) => ({ ...prev, selection: rect }));
  };

  const clearSelection = () => {
    setOptions((prev) => ({ ...prev, selection: null }));
  };

  return { setSelection, clearSelection };
};
