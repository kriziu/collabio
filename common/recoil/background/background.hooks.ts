import { useEffect } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { backgroundAtom } from './background.atom';

export const useBackground = () => {
  const bg = useRecoilValue(backgroundAtom);

  useEffect(() => {
    const root = window.document.documentElement;

    if (bg.mode === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [bg.mode]);

  return bg;
};

export const useSetBackground = () => {
  const setBg = useSetRecoilState(backgroundAtom);

  const setBackground = (mode: 'dark' | 'light', lines: boolean) => {
    setBg({
      mode,
      lines,
    });
  };

  return setBackground;
};
