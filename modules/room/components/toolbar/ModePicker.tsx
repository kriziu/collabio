import { AiOutlineSelect } from 'react-icons/ai';
import { BsPencilFill } from 'react-icons/bs';
import { FaEraser } from 'react-icons/fa';

import { useOptions } from '@/common/recoil/options';

const ModePicker = () => {
  const [options, setOptions] = useOptions();

  return (
    <>
      <button
        className={`btn-icon text-xl ${
          options.mode === 'draw' && 'bg-green-400'
        }`}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'draw',
          }));
        }}
      >
        <BsPencilFill />
      </button>

      <button
        className={`btn-icon text-xl ${
          options.mode === 'select' && 'bg-green-400'
        }`}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'select',
          }));
        }}
      >
        <AiOutlineSelect />
      </button>

      <button
        className={`btn-icon text-xl ${
          options.mode === 'eraser' && 'bg-green-400'
        }`}
        onClick={() => {
          setOptions((prev) => ({
            ...prev,
            mode: 'eraser',
          }));
        }}
      >
        <FaEraser />
      </button>
    </>
  );
};

export default ModePicker;
