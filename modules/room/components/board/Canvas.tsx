import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

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
  const ctx = useCtx();

  const [dragging, setDragging] = useState(true);

  const {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  } = useDraw(dragging);
  useSocketDraw(drawing);

  const { handleUndo, handleRedo } = useMovesHandlers(clearOnYourMove);

  useEffect(() => {
    setDragging(false);
  }, []);

  // SETUP
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && dragging) {
        setDragging(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setDragging(e.ctrlKey);
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);

    const undoBtn = undoRef.current;
    const redoBtn = redoRef.current;

    undoBtn?.addEventListener('click', handleUndo);
    redoBtn?.addEventListener('click', handleRedo);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
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

      <MiniMap dragging={dragging} />
    </div>
  );
};

export default Canvas;

// TODO:
// !!! Select renderuje sie pod obrazkami w niektorych przypadkach
// 1. Na telefonie przesuwanie, modale
