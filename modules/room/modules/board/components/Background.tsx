import { RefObject, useEffect } from 'react';

import { motion } from 'framer-motion';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useBackground } from '@/common/recoil/background';

import { useBoardPosition } from '../hooks/useBoardPosition';

const Background = ({ bgRef }: { bgRef: RefObject<HTMLCanvasElement> }) => {
  const bg = useBackground();
  const { x, y } = useBoardPosition();

  useEffect(() => {
    const ctx = bgRef.current?.getContext('2d');

    if (ctx) {
      ctx.fillStyle = bg.mode === 'dark' ? '#222' : '#fff';
      ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

      document.body.style.backgroundColor =
        bg.mode === 'dark' ? '#222' : '#fff';

      if (bg.lines) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = bg.mode === 'dark' ? '#444' : '#ddd';
        for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(ctx.canvas.width, i);
          ctx.stroke();
        }

        for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, ctx.canvas.height);
          ctx.stroke();
        }
      }
    }
  }, [bgRef, bg]);

  return (
    <motion.canvas
      ref={bgRef}
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
      className="absolute top-0 bg-zinc-100"
      style={{ x, y }}
    />
  );
};

export default Background;
