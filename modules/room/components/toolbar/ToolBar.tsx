import { BsFillChatFill, BsFillImageFill, BsThreeDots } from 'react-icons/bs';
import { HiOutlineDownload } from 'react-icons/hi';

import ColorPicker from './ColorPicker';
import LineWidthPicker from './LineWidthPicker';

const ToolBar = () => {
  return (
    <div
      className="absolute left-10 top-[50%] z-50 flex flex-col items-center gap-5 rounded-lg bg-black p-5 text-white"
      style={{
        transform: 'translateY(-50%)',
      }}
    >
      <ColorPicker />
      <LineWidthPicker />
      <button className="btn-icon text-xl">
        <BsFillChatFill />
      </button>
      <button className="btn-icon text-xl">
        <BsFillImageFill />
      </button>
      <button className="btn-icon text-xl">
        <BsThreeDots />
      </button>
      <button className="btn-icon text-xl">
        <HiOutlineDownload />
      </button>
    </div>
  );
};

export default ToolBar;
