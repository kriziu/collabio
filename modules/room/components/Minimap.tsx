import { Dispatch, forwardRef, SetStateAction, useEffect, useRef } from 'react';

import { motion, useMotionValue } from 'framer-motion';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';

import { useBoardPosition } from '../hooks/useBoardPosition';

const MiniMap = forwardRef<
  HTMLCanvasElement,
  {
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>;
  }
>(({ dragging, setMovedMinimap }, ref) => {
  const { x, y } = useBoardPosition();

  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useViewportSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  useEffect(() => {
    miniX.onChange((newX) => {
      if (!dragging) x.set(-newX * 10);
    });
    miniY.onChange((newY) => {
      if (!dragging) y.set(-newY * 10);
    });

    return () => {
      miniX.clearListeners();
      miniY.clearListeners();
    };
  }, [dragging, miniX, miniY, x, y]);

  return (
    <div
      className="absolute right-10 top-10 z-50 bg-zinc-400"
      style={{
        width: CANVAS_SIZE.width / 10,
        height: CANVAS_SIZE.height / 10,
      }}
      ref={containerRef}
    >
      <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMinimap((prev) => !prev)}
        onDragEnd={() => setMovedMinimap((prev) => !prev)}
        className="absolute top-0 left-0 cursor-grab border-2 border-red-500"
        style={{
          width: width / 10,
          height: height / 10,
          x: miniX,
          y: miniY,
        }}
        animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
        transition={{ duration: 0 }}
      />
    </div>
  );
});

MiniMap.displayName = 'MiniMap';

export default MiniMap;
