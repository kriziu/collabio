import { useRouter } from 'next/router';
import { HiOutlineDownload } from 'react-icons/hi';
import { ImExit } from 'react-icons/im';
import { IoIosShareAlt } from 'react-icons/io';

import { CANVAS_SIZE } from '@/common/constants/canvasSize';
import { useModal } from '@/common/recoil/modal';

import { useRefs } from '../../hooks/useRefs';
import ShareModal from '../../modals/ShareModal';
import ColorPicker from './ColorPicker';
import HistoryBtns from './HistoryBtns';
import ImagePicker from './ImagePicker';
import LineWidthPicker from './LineWidthPicker';
import ModePicker from './ModePicker';
import ShapeSelector from './ShapeSelector';

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { openModal } = useModal();

  const router = useRouter();

  const handleExit = () => router.push('/');

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

  const handleShare = () => {
    openModal(<ShareModal />);
  };

  return (
    <div
      className="absolute left-10 top-[50%] z-50 flex flex-col items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white"
      style={{
        transform: 'translateY(-50%)',
      }}
    >
      <HistoryBtns />

      <div className="h-px w-full bg-white" />

      <ShapeSelector />
      <ColorPicker />
      <LineWidthPicker />
      <ModePicker />
      <ImagePicker />

      <div className="h-px w-full bg-white" />

      <button className="btn-icon text-2xl" onClick={handleShare}>
        <IoIosShareAlt />
      </button>
      <button className="btn-icon text-2xl" onClick={handleDownload}>
        <HiOutlineDownload />
      </button>
      <button className="btn-icon text-xl" onClick={handleExit}>
        <ImExit />
      </button>
    </div>
  );
};

export default ToolBar;
