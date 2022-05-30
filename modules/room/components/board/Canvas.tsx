import { useCallback, useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { useKeyPressEvent } from 'react-use';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { socket } from '@/common/lib/socket';
import { useOptionsValue } from '@/common/recoil/options';
import { useRoom } from '@/common/recoil/room';

import { drawAllMoves } from '../../helpers/Canvas.helpers';
import { useBoardPosition } from '../../hooks/useBoardPosition';
import { useDraw } from '../../hooks/useDraw';
import { useRefs } from '../../hooks/useRefs';
import { useSocketDraw } from '../../hooks/useSocketDraw';
import Background from './Background';
import MiniMap from './Minimap';

const Canvas = () => {
  const room = useRoom();
  const options = useOptionsValue();

  const { canvasRef, bgRef, undoRef } = useRefs();

  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [dragging, setDragging] = useState(false);
  const [, setMovedMinimap] = useState(false);

  const { width, height } = useViewportSize();

  const { x, y } = useBoardPosition();

  useKeyPressEvent('Control', (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  const copyCanvasToSmall = useCallback(() => {
    if (canvasRef.current && smallCanvasRef.current) {
      const smallCtx = smallCanvasRef.current.getContext('2d');
      if (smallCtx) {
        smallCtx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        smallCtx.drawImage(
          canvasRef.current,
          0,
          0,
          CANVAS_SIZE.width,
          CANVAS_SIZE.height
        );
      }
    }
  }, [canvasRef, smallCanvasRef]);

  const {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    handleUndo,
  } = useDraw(ctx, dragging);

  useSocketDraw(ctx, drawing);

  // SETUP
  useEffect(() => {
    const newCtx = canvasRef.current?.getContext('2d');
    if (newCtx) setCtx(newCtx);

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    const undoBtn = undoRef.current;

    undoBtn?.addEventListener('click', handleUndo);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      undoBtn?.removeEventListener('click', handleUndo);
    };
  }, [canvasRef, dragging, handleUndo, undoRef]);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      drawAllMoves(ctx, room, options);
      copyCanvasToSmall();
    }
  }, [copyCanvasToSmall, ctx, options, room]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.canvas
        // SETTINGS
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`absolute top-0 z-10 ${dragging && 'cursor-move'}`}
        style={{ x, y }}
        // DRAG
        drag={dragging}
        dragConstraints={{
          left: -(CANVAS_SIZE.width - width),
          right: 0,
          top: -(CANVAS_SIZE.height - height),
          bottom: 0,
        }}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        // HANDLERS
        onMouseDown={(e) => handleStartDrawing(e.clientX, e.clientY)}
        onMouseUp={handleEndDrawing}
        onMouseMove={(e) => {
          handleDraw(e.clientX, e.clientY, e.shiftKey);
        }}
        onTouchStart={(e) =>
          handleStartDrawing(
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
          )
        }
        onTouchEnd={handleEndDrawing}
        onTouchMove={(e) =>
          handleDraw(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        }
      />
      <Background bgRef={bgRef} />

      <MiniMap
        ref={smallCanvasRef}
        dragging={dragging}
        setMovedMinimap={setMovedMinimap}
      />
    </div>
  );
};

export default Canvas;

// TODO:
// 4. Wstawianie obrazka (i moze przesuwanie?) to na jutro jak juz
// 6. Na telefonie przesuwanie, minimapka na klikciecie, toolbar na klikciecie, osoby co sa to na gorze
