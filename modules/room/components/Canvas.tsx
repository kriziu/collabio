import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import { useKeyPressEvent } from 'react-use';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useViewportSize } from '@/common/hooks/useViewportSize';
import { socket } from '@/common/lib/socket';
import { useRoom } from '@/common/recoil/room';

import { drawAllMoves } from '../helpers/Canvas.helpers';
import { useBoardPosition } from '../hooks/useBoardPosition';
import { useDraw } from '../hooks/useDraw';
import { useSocketDraw } from '../hooks/useSocketDraw';
import MiniMap from './Minimap';

const Canvas = () => {
  const room = useRoom();

  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const copyCanvasToSmall = () => {
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
  };

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

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (ctx) socket.emit('joined_room');
  }, [ctx]);

  useEffect(() => {
    if (ctx) {
      drawAllMoves(ctx, room);
      copyCanvasToSmall();
    }
  }, [ctx, room]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <button className="absolute top-0" onClick={handleUndo}>
        undo
      </button>
      <motion.canvas
        // SETTINGS
        ref={canvasRef}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className={`bg-zinc-100 ${dragging && 'cursor-move'}`}
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
          handleDraw(e.clientX, e.clientY);
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
// 1. Czat
// 2. Pokazywanie userów i ich kolorkow (cos jak takie koleczka co sa na necie odpalone w ui)
// 3. Przyciski do undo na toolbarze
// 4. Gumka
// 4. Wstawianie obrazka (i moze przesuwanie?) to na jutro jak juz
// 5. Rysowanie roznych figur
