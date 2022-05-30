import { BsFillImageFill, BsThreeDots } from 'react-icons/bs';
import { FaUndo } from 'react-icons/fa';
import { HiOutlineDownload } from 'react-icons/hi';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';

import { useRefs } from '../../hooks/useRefs';
import ColorPicker from './ColorPicker';
import Eraser from './Eraser';
import LineWidthPicker from './LineWidthPicker';
import ShapeSelector from './ShapeSelector';

const ToolBar = () => {
  const { canvasRef, bgRef, undoRef } = useRefs();

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext('2d');

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'canvas.png';
    link.click();
  };

  return (
    <div
      className="absolute left-10 top-[50%] z-50 flex flex-col items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white"
      style={{
        transform: 'translateY(-50%)',
      }}
    >
      <button className="btn-icon text-xl" ref={undoRef}>
        <FaUndo />
      </button>

      <div className="h-px w-full bg-white" />

      <ColorPicker />
      <ShapeSelector />
      <LineWidthPicker />
      <Eraser />
      <button className="btn-icon text-xl">
        <BsFillImageFill />
      </button>
      <button className="btn-icon text-xl">
        <BsThreeDots />
      </button>
      <button className="btn-icon text-xl" onClick={handleDownload}>
        <HiOutlineDownload />
      </button>
    </div>
  );
};

export default ToolBar;
