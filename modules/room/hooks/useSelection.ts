import { useEffect } from 'react';

import { useOptionsValue } from '@/common/recoil/options';

import { useCtx } from './useCtx';

export const useSelection = (drawAllMoves: () => void) => {
  const ctx = useCtx();
  const { selection } = useOptionsValue();

  useEffect(() => {
    drawAllMoves();

    if (ctx && selection) {
      const { x, y, width, height } = selection;

      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.globalCompositeOperation = 'source-over';

      ctx.beginPath();
      ctx.rect(x - 2, y - 2, width + 4, height + 4);
      ctx.stroke();
      ctx.closePath();

      ctx.setLineDash([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, ctx]);

  useEffect(() => {
    const handleCopySelection = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey && selection) {
        const { x, y, width, height } = selection;

        const imageData = ctx?.getImageData(x, y, width, height);

        if (imageData) {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const tempCtx = canvas.getContext('2d');
          tempCtx?.putImageData(imageData, 0, 0);

          canvas.toBlob((blob) => {
            if (blob) {
              const item = new ClipboardItem({
                'image/png': blob,
              });

              navigator.clipboard.write([item]);
            }
          });
        }
      }
    };

    document.addEventListener('keydown', handleCopySelection);

    return () => {
      document.removeEventListener('keydown', handleCopySelection);
    };
  }, [ctx, selection]);
};
