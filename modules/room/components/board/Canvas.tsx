import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { useKeyPressEvent } from 'react-use';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { socket } from '@/common/lib/socket';

import { useBoardPosition } from '../../hooks/useBoardPosition';
import { useCtx } from '../../hooks/useCtx';
import { useDraw } from '../../hooks/useDraw';
import { useMovesHandlers } from '../../hooks/useMovesHandlers';
import { useRefs } from '../../hooks/useRefs';
import { useSocketDraw } from '../../hooks/useSocketDraw';
import Background from './Background';
import MiniMap from './Minimap';

const Canvas = () => {
  const { canvasRef, bgRef, undoRef, redoRef } = useRefs();
  const { width, height } = useViewportSize();
  const { x, y } = useBoardPosition();
  const { handleUndo, handleRedo } = useMovesHandlers();
  const ctx = useCtx();

  const [dragging, setDragging] = useState(false);
  const [, setMovedMinimap] = useState(false);

  const { handleEndDrawing, handleDraw, handleStartDrawing, drawing } =
    useDraw(dragging);
  useSocketDraw(drawing);

  useKeyPressEvent('Control', (e) => {
    if (e.ctrlKey && !dragging) {
      setDragging(true);
    }
  });

  // SETUP
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    const undoBtn = undoRef.current;
    const redoBtn = redoRef.current;

    undoBtn?.addEventListener('click', handleUndo);
    redoBtn?.addEventListener('click', handleRedo);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      undoBtn?.removeEventListener('click', handleUndo);
      redoBtn?.removeEventListener('click', handleRedo);
    };
  }, [canvasRef, dragging, handleRedo, handleUndo, redoRef, undoRef]);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

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

      <MiniMap dragging={dragging} setMovedMinimap={setMovedMinimap} />
    </div>
  );
};

export default Canvas;

// TODO:
// 4. copy/paste (localstorage)
// 5. Responsywnosc
// 6. Na telefonie przesuwanie, minimapka na klikciecie, toolbar na klikciecie, osoby co sa to na gorze
