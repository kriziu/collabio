import { useEffect } from 'react';

import { socket } from '@/common/lib/socket';
import { useOptionsValue } from '@/common/recoil/options';

import { useCtx } from './useCtx';
import { useRefs } from './useRefs';

export const useSelection = (drawAllMoves: () => Promise<void>) => {
  const ctx = useCtx();
  const options = useOptionsValue();
  const { selection } = options;
  const { bgRef } = useRefs();

  useEffect(() => {
    const callback = async () => {
      await drawAllMoves();

      if (ctx && selection) {
        const { x, y, width, height } = selection;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.setLineDash([5, 10]);
        ctx.globalCompositeOperation = 'source-over';

        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();

        ctx.setLineDash([]);
      }
    };

    callback();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, ctx]);

  useEffect(() => {
    const handleCopySelection = (e: KeyboardEvent) => {
      if (!selection) return;

      const { x, y, width, height } = selection;

      if (e.key === 'c' && e.ctrlKey) {
        const imageData = ctx?.getImageData(x, y, width, height);

        if (imageData) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const tempCtx = canvas.getContext('2d');

          if (tempCtx && bgRef.current) {
            const bgImage = bgRef.current
              .getContext('2d')
              ?.getImageData(x, y, width, height);

            if (bgImage) tempCtx.putImageData(bgImage, 0, 0);

            const sTempCtx = tempCanvas.getContext('2d');
            sTempCtx?.putImageData(imageData, 0, 0);

            tempCtx.drawImage(tempCanvas, 0, 0);

            canvas.toBlob((blob) => {
              if (blob)
                navigator.clipboard.write([
                  new ClipboardItem({
                    'image/png': blob,
                  }),
                ]);
            });
          }
        }
      }

      if (e.key === 'Delete' && selection) {
        const move: Move = {
          circle: {
            cX: 0,
            cY: 0,
            radiusX: 0,
            radiusY: 0,
          },
          rect: {
            fill: true,
            width,
            height,
          },
          path: [[x, y]],
          options: {
            ...options,
            shape: 'rect',
            mode: 'eraser',
          },
          id: '',
          img: {
            base64: '',
          },
          timestamp: 0,
        };

        socket.emit('draw', move);
      }
    };

    document.addEventListener('keydown', handleCopySelection);

    return () => {
      document.removeEventListener('keydown', handleCopySelection);
    };
  }, [bgRef, ctx, options, selection]);
};
